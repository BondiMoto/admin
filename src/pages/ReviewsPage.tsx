import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Search, Star, User, MessageSquare, Trash2 } from 'lucide-react'
import api from '@/lib/api'
import toast from 'react-hot-toast'

interface Review {
  id: number
  auteur_id: number
  cible_id: number
  trajet_id: number
  note: number
  commentaire?: string
  date_avis: string
  auteur_nom?: string
  auteur_prenom?: string
  cible_nom?: string
  cible_prenom?: string
}

const ReviewsPage = () => {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRating, setFilterRating] = useState('all')

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      const response = await api.get('/reviews')
      setReviews(response.data)
    } catch (error) {
      toast.error('Erreur lors du chargement des avis')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteReview = async (reviewId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet avis ?')) {
      return
    }

    try {
      await api.delete(`/reviews/${reviewId}`)
      toast.success('Avis supprimé avec succès')
      fetchReviews()
    } catch (error) {
      toast.error('Erreur lors de la suppression')
    }
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-sm font-medium">{rating}/5</span>
      </div>
    )
  }

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = 
      `${review.auteur_prenom} ${review.auteur_nom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${review.cible_prenom} ${review.cible_nom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.commentaire?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRating = 
      filterRating === 'all' || 
      (filterRating === 'high' && review.note >= 4) ||
      (filterRating === 'medium' && review.note >= 3 && review.note < 4) ||
      (filterRating === 'low' && review.note < 3)

    return matchesSearch && matchesRating
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gestion des avis</h1>
        <p className="text-gray-600">
          Gérez les avis et commentaires des utilisateurs
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Avis ({filteredReviews.length})</CardTitle>
          <CardDescription>
            Liste de tous les avis laissés par les utilisateurs
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filtres et recherche */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher par utilisateur ou commentaire..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Toutes les notes</option>
              <option value="high">4-5 étoiles</option>
              <option value="medium">3-4 étoiles</option>
              <option value="low">1-2 étoiles</option>
            </select>
          </div>

          {/* Tableau des avis */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Auteur</TableHead>
                  <TableHead>Destinataire</TableHead>
                  <TableHead>Note</TableHead>
                  <TableHead>Commentaire</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1 text-gray-400" />
                        <div>
                          <div className="font-medium">
                            {review.auteur_prenom} {review.auteur_nom}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1 text-gray-400" />
                        <div>
                          <div className="font-medium">
                            {review.cible_prenom} {review.cible_nom}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {renderStars(review.note)}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        {review.commentaire ? (
                          <div className="flex items-start">
                            <MessageSquare className="h-4 w-4 mr-1 text-gray-400 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-gray-700 line-clamp-2">
                              {review.commentaire}
                            </p>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">Aucun commentaire</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(review.date_avis).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteReview(review.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredReviews.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">Aucun avis trouvé</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ReviewsPage 