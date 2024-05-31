import AdminLayout from '@/components/admin/AdminLayout'
import CreateCompany from '@/components/admin/screens/copmany-settings/CreateCompany'
import React from 'react'

const createNewCompany = () => {
  return (
    <AdminLayout>
      <CreateCompany />
    </AdminLayout>
  )
}

export default createNewCompany
