import CreatePassword from '@/components/auth/CreatePassword'
import React from 'react'

const passwordConfirmation = () => {
  return (
    <div>
      <CreatePassword type="vendor" isNew={true}/>
    </div>
  )
}

export default passwordConfirmation
