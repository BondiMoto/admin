import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Search, Car, MapPin, Calendar, User, Trash2, Eye } from 'lucide-react'
import api from '@/lib/api'
import toast from 'react-hot-toast'

interface Trip {
  id: number
  conducteur_id: number
  ville_depart: string
  ville_arrivee: string
  date_depart: string
  heure_depart: string
  nombre_places: number
  places_disponibles: number
  prix_par_place: number
  statut: string
  date_creation: string
  conducteur_nom?: string
  conducteur_prenom?: string
  conducteur_note?: number
}

const TripsPage = () => {
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    fetchTrips()
  }, [])

  const fetchTrips = async () => {
    try {
      const response = await api.get('/trips')
      setTrips(response.data)
    } catch (error) {
      toast.error('Erreur lors du chargement des trajets')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTrip = async (tripId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce trajet ?')) {
      return
    }

    try {
      await api.delete(`/trips/${tripId}`)
      toast.success('Trajet supprimé avec succès')
      fetchTrips()
    } catch (error) {
      toast.error('Erreur lors de la suppression')
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      'planifié': 'default',
      'en_cours': 'secondary',
      'terminé': 'outline',
      'annulé': 'destructive'
    } as const

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status}
      </Badge>
    )
  }

  const filteredTrips = trips.filter(trip => {
    const matchesSearch = 
      trip.ville_depart.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.ville_arrivee.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${trip.conducteur_prenom} ${trip.conducteur_nom}`.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = 
      filterStatus === 'all' || trip.statut === filterStatus

    return matchesSearch && matchesStatus
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
        <h1 className="text-2xl font-bold text-gray-900">Gestion des trajets</h1>
        <p className="text-gray-600">
          Gérez les trajets de covoiturage sur BondiMoto
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Trajets ({filteredTrips.length})</CardTitle>
          <CardDescription>
            Liste de tous les trajets créés par les conducteurs
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filtres et recherche */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher par ville ou conducteur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="planifié">Planifiés</option>
              <option value="en_cours">En cours</option>
              <option value="terminé">Terminés</option>
              <option value="annulé">Annulés</option>
            </select>
          </div>

          {/* Tableau des trajets */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Trajet</TableHead>
                  <TableHead>Conducteur</TableHead>
                  <TableHead>Places</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTrips.map((trip) => (
                  <TableRow key={trip.id}>
                    <TableCell>
                      <div>
                        <div className="flex items-center font-medium">
                          <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                          {trip.ville_depart} → {trip.ville_arrivee}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(trip.date_depart).toLocaleDateString('fr-FR')} à {trip.heure_depart}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1 text-gray-400" />
                        <div>
                          <div className="font-medium">
                            {trip.conducteur_prenom} {trip.conducteur_nom}
                          </div>
                          {trip.conducteur_note && (
                            <div className="text-sm text-gray-500">
                              ⭐ {trip.conducteur_note.toFixed(1)}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <div className="font-medium">{trip.places_disponibles}</div>
                        <div className="text-sm text-gray-500">/ {trip.nombre_places}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {trip.prix_par_place.toLocaleString('fr-FR')} FCFA
                      </div>
                      <div className="text-sm text-gray-500">par place</div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(trip.statut)}
                    </TableCell>
                    <TableCell>
                      {new Date(trip.date_creation).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteTrip(trip.id)}
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

          {filteredTrips.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">Aucun trajet trouvé</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default TripsPage 