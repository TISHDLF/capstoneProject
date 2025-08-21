import React from 'react'
import NavigationBar from '../components/NavigationBar'
import { Outlet } from 'react-router-dom'
import CatBot from '../components/CatBot'

const RootLayout = () => {
  return (
    <div> 
        <NavigationBar/>
        <CatBot />
        <Outlet />
    </div>
  )
}

export default RootLayout