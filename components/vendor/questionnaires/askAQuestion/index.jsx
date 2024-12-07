import React from 'react'
import EnterQuestion from './EnterQuestion'
import GetAnswer from './GetAnswer'
import Reference from './Reference'

const AskAQuestion = () => {
  return (
    <div className="flex gap-5  flex-1 items-center justify-center">
    <EnterQuestion />
    <GetAnswer />
    <Reference />
    </div>
  )
}

export default AskAQuestion