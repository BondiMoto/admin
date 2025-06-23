import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Search, Shield, Plus, Trash2, UserCheck, UserX } from 'lucide-react'
import api from '@/lib/api'
import toast from 'react-hot-toast'

interface Admin {
  id: number
  nom: string
  prenom: string
  email: string
  role: string
  is_active: boolean
  date_creation: string
}

const AdminsPage = () => {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')

  useEffect(() => {
    fetchAdmins()
  }, [])

  const fetchAdmins = async () => {
    try {
      const response = await api.get('/admin/admins')
      setAdmins(response.data)
    } catch (error) {
      toast.error('Erreur lors du chargement des administrateurs')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleAdminStatus = async (adminId: number, currentStatus: boolean) => {
    try {
      if (currentStatus) {
        await api.post(`/admin/admins/${adminId}/deactivate`)
        toast.success('Administrateur désactivé avec succès')
      } else {
        await api.post(`/admin/admins/${adminId}/activate`)
        toast.success('Administrateur activé avec succès')
      }
      fetchAdmins()
    } catch (error) {
      toast.error('Erreur lors de la modification du statut')
    }
  }

  const handleDeleteAdmin = async (adminId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet administrateur ?')) {
      return
    }

    try {
      await api.delete(`/admin/admins/${adminId}`)
      toast.success('Administrateur supprimé avec succès')
      fetchAdmins()
    } catch (error) {
      toast.error('Erreur lors de la suppression')
    }
  }

  const getRoleBadge = (role: string) => {
    const variants = {
      'super_admin': 'destructive',
      'modérateur': 'secondary'
    } as const

    return (
      <Badge variant={variants[role as keyof typeof variants] || 'outline'}>
        {role === 'super_admin' ? 'Super Admin' : 'Modérateur'}
      </Badge>
    )
  }

  const filteredAdmins = admins.filter(admin => {
    const matchesSearch = 
      admin.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRole = 
      filterRole === 'all' || admin.role === filterRole

    return matchesSearch && matchesRole
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des administrateurs</h1>
          <p className="text-gray-600">
            Gérez les comptes administrateurs de BondiMoto
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nouvel admin
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Administrateurs ({filteredAdmins.length})</CardTitle>
          <CardDescription>
            Liste de tous les administrateurs du système
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filtres et recherche */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher par nom ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous les rôles</option>
              <option value="super_admin">Super Admin</option>
              <option value="modérateur">Modérateur</option>
            </select>
          </div>

          {/* Tableau des administrateurs */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Administrateur</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date de création</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAdmins.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <Shield className="h-4 w-4 mr-1 text-gray-400" />
                        <div>
                          <div className="font-medium">
                            {admin.prenom} {admin.nom}
                          </div>
                          <div className="text-sm text-gray-500">{admin.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getRoleBadge(admin.role)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={admin.is_active ? 'default' : 'destructive'}>
                        {admin.is_active ? 'Actif' : 'Inactif'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(admin.date_creation).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleAdminStatus(admin.id, admin.is_active)}
                        >
                          {admin.is_active ? (
                            <>
                              <UserX className="h-4 w-4 mr-1" />
                              Désactiver
                            </>
                          ) : (
                            <>
                              <UserCheck className="h-4 w-4 mr-1" />
                              Activer
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteAdmin(admin.id)}
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

          {filteredAdmins.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">Aucun administrateur trouvé</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminsPage 