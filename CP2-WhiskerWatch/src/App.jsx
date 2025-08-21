import React from 'react'
import NavigationBar from './components/NavigationBar'
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom'
import Home from './pages/Home'
import AboutUs from './pages/AboutUs'
import CatCareGuides from './pages/CatCareGuides'
import ContactUs from './pages/ContactUs'
import RootLayout from './layout/RootLayout'


const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element = {<RootLayout />}>
        <Route index element = { <Home /> } />
        <Route path = 'aboutus' element = { <AboutUs /> } />
        <Route path = 'catcareguides' element = { <CatCareGuides /> } />
        <Route path = 'contactus' element = { <ContactUs /> } />
      </Route>
    )
  )

  return (
    <RouterProvider router = {router} />
  )
}

export default App