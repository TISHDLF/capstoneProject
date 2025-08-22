import React from 'react'
import { Link } from 'react-router-dom'

const SignUp = () => {
  return (
    <div className='flex flex-col items-center pt-6 min-h-screen '> 
        <div className='flex flex-col gap-8 items-center bg-[#FFF] p-12 rounded-[25px] shadow-md'>
            <div className='max-w-[200px]'>
                <img src="src/assets/whiskerwatchlogo-vertical.png" alt="" />
            </div>
            <form className='grid grid-cols-2 gap-5'>
                <input type="text" placeholder='First Name' className='border-b-2 border-b-[#A8784F] p-2' />
                <input type="text" placeholder='last Name' className='border-b-2 border-b-[#A8784F] p-2' />
                <input type="text" placeholder='Contact Number' className='border-b-2 border-b-[#A8784F] p-2' />
                <div className='flex gap-2 items-center'>
                    <label className='text-[#737373]'> Date of Birth </label>
                    <input type="date" placeholder='Date of Birth' className='border-b-2 border-b-[#A8784F] p-2' />
                </div>
                <input type="text" placeholder='Email' className='border-b-2 border-b-[#A8784F] p-2' />
                <input type="text" placeholder='Username' className='border-b-2 border-b-[#A8784F] p-2' />
                <input type="text" placeholder='Building Name' className='border-b-2 border-b-[#A8784F] p-2' />
                <input type="number" placeholder='Unit Number' className='border-b-2 border-b-[#A8784F] p-2' />
                <input type="password" placeholder='Password' className='border-b-2 border-b-[#A8784F] p-2' />
                <input type="password" placeholder='Confirm Password' className='border-b-2 border-b-[#A8784F] p-2' />
            </form>
            <div className='flex flex-col items-center gap-3'>
                <button className='p-2 bg-[#B5C04A] w-[125px] text-[#FFF] rounded-[50px] active:bg-[#CFDA34] cursor-pointer'> Sign Up </button>
                <label htmlFor="">
                    Already a member of WhiskerWatch?
                    <Link to="/login" className='font-normal md:font-bold hover:underline text-[#B5C04A]'> Log in </Link>
                    instead!
                    </label>
            </div>
        </div>
    </div>
  )
}

export default SignUp