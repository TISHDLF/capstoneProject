import React from 'react'
import { Link } from 'react-router-dom'

const AdminLogin = () => {
  return (
    <div className='flex flex-col items-center p-10 h-screen'>
        <div className='flex flex-col items-center gap-10 w-100% min-w-[200px] h-auto bg-[#FFF] p-15 rounded-[25px] shadow-md'> 
            <div className='max-w-[250px]'>
                <img src="src/assets/whiskerwatchlogo-vertical.png" alt="" />
            </div>
            <form className='flex flex-col items-center gap-5'>
                <input type="text" placeholder='Username' className='border-b-2 border-b-[#977655] p-2' />
                <select name="" id="" className='border-b-2 border-b-[#977655] w-full p-2'>
                    <option value="" disabled selected className='hidden'>Select a role</option>
                    <option data="" type=""> Admin </option>
                    <option data="" type=""> Head Volunteer </option>
                </select>
                <input type="password" name="" id="" placeholder='Password' className='border-b-2 border-b-[#977655] p-2' />
            </form>
            <div className='flex gap-2'>
                <Link to="/dashboard" className='bg-[#DC8801] text-[#FFF] w-30 text-center p-2 rounded-[25px] cursor-pointer active:bg-[#977655]'> Log In </Link>
                <Link to="/login" className='border-2 border-[#DC8801] text-[#DC8801] w-30 text-center p-2 rounded-[25px] active:bg-[#977655] active:text-[#FFF] active:border-[#977655]'> Cancel </Link>
            </div>
        </div>
    </div>
  )
}

export default AdminLogin