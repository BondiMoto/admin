import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Search, User, CheckCircle, XCircle } from 'lucide-react'
import api from '@/lib/api'
import toast from 'react-hot-toast'

interface Reservation {
  id: number
  passager_id: number
  trajet_id: number
  nombre_places: number
  statut: string
  date_reservation: string
  date_confirmation?: string
  passager_nom?: string
  passager_prenom?: string
  trajet_info?: {
    ville_depart: string
    ville_arrivee: string
    date_depart: string
    conducteur_nom: string
    conducteur_prenom: string
  }
}

const ReservationsPage = () => {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    fetchReservations()
  }, [])

  const fetchReservations = async () => {
    try {
      const response = await api.get('/reservations')
      setReservations(response.data)
    } catch (error) {
      toast.error('Erreur lors du chargement des réservations')
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmReservation = async (reservationId: number) => {
    try {
      await api.post(`/reservations/${reservationId}/confirm`)
      toast.success('Réservation confirmée avec succès')
      fetchReservations()
    } catch (error) {
      toast.error('Erreur lors de la confirmation')
    }
  }

  const handleCancelReservation = async (reservationId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
      return
    }

    try {
      await api.post(`/reservations/${reservationId}/cancel`)
      toast.success('Réservation annulée avec succès')
      fetchReservations()
    } catch (error) {
      toast.error('Erreur lors de l\'annulation')
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      'en_attente': 'secondary',
      'confirmée': 'default',
      'annulée': 'destructive',
      'terminée': 'outline'
    } as const

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status}
      </Badge>
    )
  }

  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = 
      `${reservation.passager_prenom} ${reservation.passager_nom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.trajet_info?.ville_depart.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.trajet_info?.ville_arrivee.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = 
      filterStatus === 'all' || reservation.statut === filterStatus

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
        <h1 className="text-2xl font-bold text-gray-900">Gestion des réservations</h1>
        <p className="text-gray-600">
          Gérez les réservations de trajets sur BondiMoto
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Réservations ({filteredReservations.length})</CardTitle>
          <CardDescription>
            Liste de toutes les réservations effectuées par les passagers
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filtres et recherche */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher par passager ou trajet..."
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
              <option value="en_attente">En attente</option>
              <option value="confirmée">Confirmées</option>
              <option value="annulée">Annulées</option>
              <option value="terminée">Terminées</option>
            </select>
          </div>

          {/* Tableau des réservations */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Passager</TableHead>
                  <TableHead>Trajet</TableHead>
                  <TableHead>Conducteur</TableHead>
                  <TableHead>Places</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReservations.map((reservation) => (
                  <TableRow key={reservation.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1 text-gray-400" />
                        <div>
                          <div className="font-medium">
                            {reservation.passager_prenom} {reservation.passager_nom}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {reservation.trajet_info?.ville_depart} → {reservation.trajet_info?.ville_arrivee}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(reservation.trajet_info?.date_depart || '').toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {reservation.trajet_info?.conducteur_prenom} {reservation.trajet_info?.conducteur_nom}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-center font-medium">
                        {reservation.nombre_places}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(reservation.statut)}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm">
                          {new Date(reservation.date_reservation).toLocaleDateString('fr-FR')}
                        </div>
                        {reservation.date_confirmation && (
                          <div className="text-xs text-gray-500">
                            Confirmée: {new Date(reservation.date_confirmation).toLocaleDateString('fr-FR')}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {reservation.statut === 'en_attente' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleConfirmReservation(reservation.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Confirmer
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCancelReservation(reservation.id)}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Annuler
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredReservations.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">Aucune réservation trouvée</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ReservationsPage 