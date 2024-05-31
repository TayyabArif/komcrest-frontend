import AdminLayout from '@/components/admin/AdminLayout'
import CompanySettings from '@/components/admin/screens/copmany-settings';
import { Button } from "@nextui-org/react";
import React from 'react'

const index = () => {
  return (
    <AdminLayout>
      <CompanySettings />
    </AdminLayout>
  )
}

export default index
