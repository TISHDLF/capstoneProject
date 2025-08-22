import React from 'react'
import logo from '../assets/whiskerwatchlogo.png'
import { Link } from 'react-router-dom'

const pageStyling = 'flex items-center justify-center box-content h-full w-auto px-[10px] py-[6px] rounded-[10px] hover:bg-[#DC8801] hover:text-[#FFF] hover:cursor-pointer active:bg-[#FFF] active:text-[#DC8801] active:cursor-pointer'

const NavigationBar = () => {
  return (
    <div className='sticky top-0 left-0 w-full grid grid-cols-[40%_40%_20%] bg-[#f9f7dc] box-content items-center max-h-[100px] border-b-2 border-b-[#DC8801] z-50'>
      <Link to="/home" className='flex items-center justify-center w-auto h-[100px]'>
        <img className='max-w-full max-h-full object-contain p-[10px]'
        src={logo} alt="whiskerwatch logo" />
      </Link>
      <div className='flex flex-row justify-evenly items-center'>
        <Link to="/home" className={pageStyling}>Home</Link>
        <Link to="/aboutus" className={pageStyling}>About Us</Link>
        <Link to="/catcareguides" className={pageStyling}>Cat Care Guides</Link>
        <Link to="/contactus" className={pageStyling}>Contact Us</Link>
      </div>

      <div className='flex items-center justify-center w-auto h-[100px] box-border'>
        <button className='flex items-center justify-center w-[50px] h-auto bg-[#FFFFFF] rounded-[10px] drop-shadow-lg
        active:scale-95 active:border-2 border-[#DC8801] border-solid'>
          <img className='max-w-full max-h-full object-contain p-[10px]'
          src="src/assets/icons/notification-bell.png" alt="notification bell" />
        </button>
      </div>
    </div>
  )
}

export default NavigationBar