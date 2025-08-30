import React from 'react'
import { Outlet, ScrollRestoration } from 'react-router-dom'

import NavigationBar from '../components/NavigationBar'
import CatBot from '../components/CatBot'
import SideNavigation from '../components/SideNavigation'
import AdminSideBar from '../components/AdminSideBar'
import Footer from '../components/Footer'

const RootLayout = () => {
  return (
    <div className='relative h-full w-full bg-[#f9f7dc] bg-[url(src/assets/background-paws.png)] bg-cover bg-center bg-repeat'> 
        {/* <SideNavigation /> */}
        {/* <AdminSideBar /> */}
        {/* <NavigationBar /> */}
        <CatBot />
        {/* <Footer /> */}
        <ScrollRestoration />
        <Outlet />
    </div>
  )
}

export default RootLayout