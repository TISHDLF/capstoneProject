import React from 'react'
import { Link } from 'react-router-dom'

const SideNavigation = () => {

  const sideItemStyle = 'flex items-center justify-start gap-4 min-w-[200px] w-full h-auto rounded-tl-[50px] rounded-bl-[50px] box-border pl-3 pr-12 pt-2 pb-2 cursor-pointer bg-white border-2 border-white drop-shadow-md active:border-2 active:border-[#DC8801] hover:text-[#DC8801]'

  return (
    <div className='fixed right-0 top-[20%] flex flex-col gap-4 min-w-[200px] h-auto z-50'>
      {/* Login or Signup button */}
      <Link to="/login" className={sideItemStyle}> 
        <div className='flex justify-center items-center w-[40px] h-auto'>
          <img src="src/assets/icons/account.png" alt="account" />
        </div>
        <label className='cursor-pointer'> Login or Signup </label>
      </Link>

      
      <div className='flex flex-col justify-center gap-4 pl-12'>

        {/* Donate */} 
        <Link to="/donate" className={sideItemStyle}> 
          <div className='flex justify-center items-center w-[40px] h-auto'>
            <img src="src/assets/icons/donation.png" alt="account" />
          </div>
          <label className='cursor-pointer'> Donate </label>
        </Link>

        {/* Cat Adoption */}
        <Link to="/catadoption" className={sideItemStyle}>
          <div className='flex justify-center items-center w-[40px] h-auto'>
            <img src="src/assets/icons/paws.png" alt="account" />
          </div>
          <label className='cursor-pointer'> Cat Adoption </label>
        </Link>

        {/* Feeding */}
        <Link  to="/feeding" className={sideItemStyle}>
          <div className='flex justify-center items-center w-[40px] h-auto'>
            <img src="src/assets/icons/pet-food.png" alt="account" />
          </div>
          <label className='cursor-pointer'> Feeding </label>
        </Link>

        {/* Community Guidelines */}
        <Link to="communityguide" className={sideItemStyle}>
          <div className='flex justify-center items-center w-[40px] h-auto -z-50'>
            <img src="src/assets/icons/information.png" alt="account" />
          </div>
          <label className='cursor-pointer'> Community Guidelines </label>
        </Link>
      </div>
    </div>
  )
}

export default SideNavigation