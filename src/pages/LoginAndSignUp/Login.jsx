import React from 'react'
import { Link } from 'react-router-dom'

const Login = () => {
  return (
    <div className='flex flex-col items-center pt-10 h-screen'>

        <div className='fixed flex flex-col items-center gap-10 w-100% min-w-[200px] h-auto bg-[#FFF] p-20 rounded-[25px] shadow-md'>
          <div className='max-w-[250px]'>
            <img src="src/assets/whiskerwatchlogo-vertical.png" alt="" />
          </div>
          
          <form className='flex flex-col items-center gap-10'>
            <input type="email" name="emailInput" id="" placeholder="Email" className='border-b-2 border-b-[#A8784F] p-2'/>
            <input type="password" name="passwordInput" id="" placeholder="Password"  className='border-b-2 border-b-[#A8784F] p-2'/>
          </form>

          <div className='flex flex-col items-center'>
            <div className='flex flex-row gap-1 justify-stretch'>
              <button className='bg-[#B5C04A] text-[#FFF] p-[10px] w-30 rounded-[50px] active:bg-[#CFDA34] cursor-pointer'> Log in </button>
              <Link to="/signup" className='bg-amber-600 text-[#FFF] p-[10px] w-30 text-center rounded-[50px] active:bg-[#977655]'> Sign Up </Link>
            </div>
            <Link to="/adminlogin" className='pt-4 active:text-[#977655] hover:underline'> Log in as Admin </Link>
          </div>
        </div>

    </div>

    
  )
}

export default Login