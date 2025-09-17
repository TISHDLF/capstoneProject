import React from 'react'
import AdminSideBar from '../../../components/AdminSideBar'
import { Link } from 'react-router-dom'

const AdopterApplicationView = () => {
  return (
    <div className='relative flex flex-col h-screen overflow-x-hidden '>
        <div className='grid grid-cols-[20%_80%] overflow-x-hidden'> 
            <AdminSideBar />
            <div className='flex flex-col p-10 min-h-screen w-full gap-4 mx-auto overflow-hidden'>
                <div className='flex w-full justify-between pb-2 border-b-1 border-b-[#2F2F2F]'>
                    <label className='text-[24px] font-bold text-[#2F2F2F]'>Adoption Application Form</label>
                    <Link to="/adopterapplication" className='flex items-center bg-[#2F2F2F] p-1 pl-6 pr-6 text-[#FFF] font-bold rounded-[15px]'> Go Back</Link>
                </div>

                <div className='flex flex-col p-5 bg-[#FFF] h-auto w-full rounded-[10px] gap-2'> 
                    <div className='flex items-center justify-between border-b-1 border-b-[#595959] shadow-md pb-3'>
                        <div className='flex justify-start items-center gap-10'>
                            <div className='flex flex-col justify-start'>
                                <label className='text-[#595959] text-[14px]'>Application No.:</label>
                                <label className='text-[#2F2F2F] text-[18px] font-bold' >01</label>
                            </div>
                            <div className='flex flex-col justify-start'>
                                <label className='text-[#595959] text-[14px]'>Name of Applicant:</label>
                                <label className='text-[#2F2F2F] text-[18px] font-bold' > Angelo Cabangal</label>
                            </div>
                            <div className='flex flex-col justify-start'>
                                <label className='text-[#595959] text-[14px]'>User ID:</label>
                                <label className='text-[#2F2F2F] text-[18px] font-bold' > 01</label>
                            </div>
                            <div className='flex flex-col justify-start'>
                                <label className='text-[#595959] text-[14px]'>Date of Application:</label>
                                <label className='text-[#2F2F2F] text-[18px] font-bold' >09/01/25</label>
                            </div>
                        </div>

                        <div className='flex gap-3 items-center' >
                            <button className='bg-[#B5C04A] text-[#FFF] p-2 pl-4 pr-4 rounded-[15px] cursor-pointer active:bg-[#E3E697] active:text-[#2F2F2F]'>Accept</button>
                            <button className='bg-[#DC8801] text-[#FFF] p-2 pl-4 pr-4 rounded-[15px] cursor-pointer active:bg-[#977655]'>Reject</button>
                        </div>
                    </div>

                    <object data="/src/assets/UserProfile/(01 Laboratory Exercise 1 - ARG) Angelo Cabangal - Game Development.pdf" type="application/pdf" width="100%" height="600">
                        alt : <a href="/src/assets/UserProfile/(01 Laboratory Exercise 1 - ARG) Angelo Cabangal - Game Development.pdf">test.pdf</a>
                    </object>
 
                </div>
            </div>
        </div>
    </div>
  )
}

export default AdopterApplicationView