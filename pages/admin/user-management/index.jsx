import React from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import UserManagement from '@/components/admin/screens/user-management/UserManagement';

const index = () => {
  return (
    <AdminLayout>
      <UserManagement />
    </AdminLayout>
  )
}

export default index
