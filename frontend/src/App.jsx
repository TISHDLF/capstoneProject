import React from 'react'
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom'
import RootLayout from './layout/RootLayout'

import Home from './pages/Home'
import AboutUs from './pages/AboutUs'
import CatCareGuides from './pages/CatCareGuides'
import ContactUs from './pages/ContactUs'
import Login from './pages/LoginAndSignUp/Login'
import CatCommunityNews from './pages/Home/CatCommunityNews'
import Donate from './pages/Donate'
import CatAdoption from './pages/CatAdoption'
import Feeding from './pages/Feeding'
import CommunityGuide from './pages/CommunityGuide'
import AdminLogin from './pages/LoginAndSignUp/AdminLogin'
import SignUp from './pages/LoginAndSignUp/SignUp'
import CatProfile from './pages/CatAdoption/CatProfile'
import AdopteeForm from './pages/CatAdoption/AdopteeForm'

import AdminHomePage from './pages/Admin/AdminHomePage'
import Dashboard from './pages/Admin/Dashboard'




const App = () => {
    
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="home" element={<Home />} />
        <Route path="catcommunitynews" element={<CatCommunityNews />} />
        <Route path="aboutus" element={<AboutUs />} />
        <Route path="catcareguides" element={<CatCareGuides />} />
        <Route path="contactus" element={<ContactUs />} />
        <Route path="login" element={<Login />} />
        <Route path="adminlogin" element={<AdminLogin />}/> 
        <Route path="signup" element={<SignUp />} />
        <Route path="donate" element={<Donate />} />
        <Route path="catadoption" element={<CatAdoption />} />
        <Route path="catprofile" element={<CatProfile />}/>
        <Route path="adopteeform" element={<AdopteeForm />}/>
        <Route path="feeding" element={<Feeding />} />
        <Route path="communityguide" element={<CommunityGuide />} />

        <Route path="admin/homepage" element={<AdminHomePage />}/>
        <Route path="dashboard" element={<Dashboard />}/>
      </Route> 
    )
  )

  return (
    <RouterProvider router = {router} />

  )
}

export default App