import React from 'react'
import AdminSideBar from '../../components/AdminSideBar'
import { Link } from 'react-router-dom'

const AdminCatProfile = () => {
  return (
    <div className='flex flex-col h-screen overflow-x-hidden'>
      <div className='grid grid-cols-[20%_80%]'>
        <AdminSideBar />
        <div className='flex flex-col items-start p-10 min-h-screen gap-10 mx-auto overflow-y-scroll'>
          <div className='flex flex-row items-center justify-between w-full gap-4'>
            <input type="search" placeholder='Search' 
            className='bg-[#FFF] border-2 border-[#989898] p-2 rounded-[15px] w-[500px]'/>

            <div className='flex flex-row items-center gap-4'>
              <Link to="/catprofileproperty" className='flex flex-row items-center justify-center gap-3 p-3 pl-6 pr-6 min-w-[225px] h-auto bg-[#B5C04A] text-[#FFF] rounded-[15px] hover:bg-[#CFDA34] active:bg-[#B5C04A]'>
                <div className='flex justify-center items-center w-[15px] h-auto'>
                  <img src="/src/assets/icons/add-white.png" alt="" />
                </div>  
                <label className='inline-block text-[#FFF]'>Create Cat Profile</label>
              </Link>
            </div>
          </div>          


          {/* TABLE */}
          <table className='flex flex-col gap-2 w-full'>
            <thead className='flex bg-[#DC8801] text-[#FFF] rounded-[10px]'>
              <tr className='grid grid-cols-[10%_15%_15%_25%_25%_10%] place-items-start w-full p-3'>
                <th>Cat ID</th>
                <th>Name</th>
                <th>Gender</th>
                <th>Description</th>
                <th>Adoption Status</th>
              </tr>
            </thead>

            <tbody className='flex flex-col w-full'>
              <tr className='grid grid-cols-[10%_15%_15%_25%_35%] place-items-center justify-items-start w-full p-3 bg-[#FFF] rounded-[15px] border-b-1 border-b-[#2F2F2F]'>
                <td>1</td>
                <td>Wally Bayola</td>
                <td>Male</td>
                <td>Kalbo tas mejo bading</td>
                <td className='flex flex-row items-center justify-between w-full'>
                  <label>Available</label>
                  <Link to="/catprofileproperty" className='p-2 pl-6 pr-6 w-auto h-auto bg-[#2F2F2F] text-[#FFF] rounded-[15px] cursor-pointer active:bg-[#595959]'>View</Link>
                </td>
              </tr>
            </tbody>
          </table>

        </div>
      </div>

    </div>
  )
}

export default AdminCatProfile