import React from 'react'
import { Link } from 'react-router-dom'

const AssignNewAdmin = () => {
  return (
        <div className='absolute bottom-0 flex flex-col w-full  bg-[#FFF] gap-5 p-5 rounded-tr-[15px] rounded-tl-[15px] m-10 border-t-2 border-t-[#2F2F2F] border-r-2 border-r-[#2F2F2F] border-l-2 border-l-[#2F2F2F]'>
            <div className='flex flex-col w-full gap-3 pb-3 border-b-1 border-b-[#595959]'>
                <div className='flex justify-between w-full'>
                <label className='self-start text-[24px] text-[#2F2F2F] font-bold'>Update Role</label>
                <Link to="/adminlist" className='cursor-pointer'>Close</Link>
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
                <select name="" id="" className='p-2 border-1 border-[#DC8801] rounded-[10px] font-bold text-[#DC8801]'>
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

export default AssignNewAdmin