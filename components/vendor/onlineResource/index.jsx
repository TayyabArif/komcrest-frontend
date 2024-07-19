import React from 'react'
import KnowledgeHeader from '../shared/KnowledgeHeader'
import ResourceHome from "./ResourceHome"


const headerData ={
    title:"Online sources",
    desc1 :"Seamlessly integrate external information into your account.",
    desc2:"This ensures that Komcrest AI draws upon the most up-to-date and pertinent answers when addressing your questions."
}
const OnlineResourceComponent = () => {
  
  return (
    <div>
        <KnowledgeHeader headerData = {headerData}/>
        <ResourceHome />
    </div>
  )
}

export default OnlineResourceComponent