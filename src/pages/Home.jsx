import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
        Home Page
        <Link to="/catcommunitynews" className='bg-[#DC8801]'> View More Button </Link>
    </div>
  )
}

export default Home