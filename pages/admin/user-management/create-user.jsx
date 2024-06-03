import AdminLayout from '@/components/admin/AdminLayout'
import CreateUser from '@/components/admin/screens/user-management/CreateUser'
import React from 'react'

const createUser = () => {
  return (
    <AdminLayout>
      <CreateUser />
    </AdminLayout>
  )
}

export default createUser
