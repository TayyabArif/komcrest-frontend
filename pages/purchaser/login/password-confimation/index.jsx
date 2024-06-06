import CreatePassword from '@/components/auth/CreatePassword'
import React from 'react'

const passwordConfirmation = () => {
  return (
    <div>
      <CreatePassword type="purchaser" isNew={true}/>
    </div>
  )
}

export default passwordConfirmation
