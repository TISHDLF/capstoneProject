import React from 'react'
import NavigationBar from './components/NavigationBar'
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom'
import RootLayout from './layout/RootLayout'

import Home from './pages/Home'
import AboutUs from './pages/AboutUs'
import CatCareGuides from './pages/CatCareGuides'
import ContactUs from './pages/ContactUs'
import Login from './pages/Login'
import CatCommunityNews from './pages/Home/CatCommunityNews'
import Donate from './pages/Donate'
import CatAdoption from './pages/CatAdoption'
import Feeding from './pages/Feeding'
import CommunityGuide from './pages/CommunityGuide'



const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route path="home" element={<Home />} />
        <Route path="catcommunitynews" element={<CatCommunityNews />} />
        <Route path="aboutus" element={<AboutUs />} />
        <Route path="catcareguides" element={<CatCareGuides />} />
        <Route path="contactus" element={<ContactUs />} />
        <Route path="login" element={<Login />} />
        <Route path="donate" element={<Donate />} />
        <Route path="catadoption" element={<CatAdoption />} />
        <Route path="feeding" element={<Feeding />} />
        <Route path="communityguide" element={<CommunityGuide />} />
      </Route>
    )
  )

  return (
    <RouterProvider router = {router} />
  )
}

export default App