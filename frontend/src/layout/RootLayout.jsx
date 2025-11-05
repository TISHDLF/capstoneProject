import React from 'react'
import { Outlet, ScrollRestoration, Navigate } from 'react-router-dom'

import CatBot from '../components/CatBot'


const RootLayout = () => {
  return (
    <div className='relative h-full w-full bg-[#f9f7dc] bg-[url(src/assets/background-paws.png)] bg-cover bg-fit bg-repeat'> 
        {/* <CatBot /> */}
        <ScrollRestoration />
        <Outlet />
    </div>
  )
}

export default RootLayout