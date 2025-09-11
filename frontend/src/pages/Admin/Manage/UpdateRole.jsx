import React from 'react'
import { Link, useParams } from 'react-router-dom'

const UpdateRole = () => {
  return (
        <div className='absolute bottom-0 flex flex-col w-full gap-5 bg-[#FFF] p-5 rounded-tr-[15px] rounded-tl-[15px] m-10 border-t-2 border-t-[#2F2F2F] border-r-2 border-r-[#2F2F2F] border-l-2 border-l-[#2F2F2F]'>
            <div className='flex flex-col w-full gap-3 pb-3 border-b-2 border-b-[#595959]'>
                <div className='flex justify-between w-full'>
                <label className='self-start text-[18px] text-[#2F2F2F] font-bold'>Assign new admin</label>
                <Link to="/adminlist" type='button' className='cursor-pointer'>Close</Link>
                </div>
                <div className='flex items-center justify-between w-full fit-content gap-4'>
                <label className='flex text-[#595959] text-[16px]'>Search for a new candidate</label>
                <input type="search" name="" id="" placeholder="Type the users name" className='flex-3 p-2 border-1 border-[#a3a3a3] rounded-[15px]'/>
                <button className='flex p-2 pl-3 pr-3 bg-[#2F2F2F] active:bg-[#595959] text-[#FFF] rounded-[15px] cursor-pointer'>Search</button>
                </div>
            </div>

            <div className='flex justify-between w-full gap-4'>
                <div className='flex flex-col w-full justify-start'>
                <label className='text-[#595959] text-[14px]'>Name</label>
                <label className='p-2 border-1 border-[#CCCCCC] rounded-[10px] font-bold'>Angelo Cabangal</label>
                </div>
                <div className='flex flex-col w-full justify-start'>
                <label className='text-[#595959] text-[14px]'>Email</label>
                <label className='p-2 border-1 border-[#CCCCCC] rounded-[10px] font-bold'>EmailAddress@gmail.com</label>
                </div>
                <div className='flex flex-col w-full justify-start'>
                <label className='text-[#595959] text-[14px]'>Role</label>
                <select name="" id="" className='p-2 border-1 border-[#CCCCCC] rounded-[10px] font-bold'>
                    <option value="regular">Basic</option>
                    <option value="head_volunteer">Head Volunteer</option>
                    <option value="admin">Admin</option>
                </select>
                </div>
            </div>

            <div className='flex w-full justify-end'>
                <button className='bg-[#B5C04A] active:bg-[#CFDA34] p-2 pl-6 pr-6 text-[#FFF] font-bold rounded-[15px] cursor-pointer'>Save Changes</button>
            </div>
        </div>
    )
}

export default UpdateRole