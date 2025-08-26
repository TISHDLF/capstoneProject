import React from 'react'
import { Link, useLocation } from 'react-router-dom'


const AdminSideBar = () => {
  const location = useLocation();

  const sideItemStyle = 'flex items-center justify-start gap-4 min-w-[200px] w-full h-auto rounded-tl-[50px] rounded-bl-[50px] box-border pl-3 pr-12 pt-2 pb-2 cursor-pointer bg-white border-2 border-white drop-shadow-md active:border-2 active:border-[#DC8801] hover:text-[#DC8801]'
  const sideItemStyleCurrent = 'flex items-center justify-start gap-4 min-w-[200px] w-full h-auto rounded-tl-[50px] rounded-bl-[50px] box-border pl-3 pr-12 pt-2 pb-2 cursor-pointer bg-white border-2 drop-shadow-md border-[#977655] text-[#977655] font-bold'

  return (
    <div className='absolute right-0 top-[20%] flex flex-col gap-4 min-w-[200px] h-auto z-50'>
      {/* Login or Signup button */}
      <Link to="/admin/homepage" className={location.pathname === "/admin/homepage" ? sideItemStyleCurrent : sideItemStyle}> 
        <div className='flex justify-center items-center w-[40px] h-auto'>
          <img src="/src/assets/icons/account.png" alt="account" />
        </div>
        <label className='cursor-pointer'> Admin Home Page </label>
      </Link>

      
      <div className='flex flex-col justify-center gap-4 pl-12'>

        <Link to="/dashboard" className={location.pathname === "/dashboard" ? sideItemStyleCurrent : sideItemStyle}> 
          <div className='flex justify-center items-center w-[40px] h-auto'>
            <img src="/src/assets/icons/admin-icons/sidedbar/dashboard.png" alt="account" />
          </div>
          <label className='cursor-pointer'> Dashboard </label>
        </Link>
        
        {/* Donate */} 
        <Link className={location.pathname === "/donate" ? sideItemStyleCurrent : sideItemStyle}> 
          <div className='flex justify-center items-center w-[40px] h-auto'>
            <img src="/src/assets/icons/admin-icons/sidedbar/in-kind-donation-application.png" alt="account" />
          </div>
          <label className='cursor-pointer'> In-Kind Donation Applications </label>
        </Link>

        {/* Cat Adoption */}
        <Link className={location.pathname === "/catadoption" ? sideItemStyleCurrent : sideItemStyle}>
          <div className='flex justify-center items-center w-[40px] h-auto'>
            <img src="/src/assets/icons/admin-icons/sidedbar/adoption-application.png" alt="account" />
          </div>
          <label className='cursor-pointer'> Adoption Applications </label>
        </Link>

        {/* Feeding */}
        <Link className={location.pathname === "/feeding" ? sideItemStyleCurrent : sideItemStyle}>
          <div className='flex justify-center items-center w-[40px] h-auto'>
            <img src="/src/assets/icons/admin-icons/sidedbar/feeders-application.png" alt="account" />
          </div>
          <label className='cursor-pointer'> Feeders Application </label>
        </Link>

        {/* Community Guidelines */}
        <Link className={location.pathname === "/communityguide" ? sideItemStyleCurrent : sideItemStyle}>
          <div className='flex justify-center items-center w-[40px] h-auto -z-50'>
            <img src="/src/assets/icons/admin-icons/sidedbar/reports-and-analytics.png" alt="account" />
          </div>
          <label className='cursor-pointer'> Reports and Analytics</label>
        </Link>
      </div>
    </div>
  )
}

export default AdminSideBar