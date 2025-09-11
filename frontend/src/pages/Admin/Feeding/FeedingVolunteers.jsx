import React from 'react'
import AdminSideBar from '../../../components/AdminSideBar'

const FeedingVolunteers = () => {
  return (
    <div className='relative flex flex-col h-screen'>
        <div className='grid grid-cols-[20%_80%] overflow-x-hidden'> 
            <AdminSideBar />
            <div className='flex flex-col items-start justify-between p-10 min-h-screen gap-10 mx-auto'>
                <div className='flex flex-col w-full gap-5'>
                  <label className='flex items-start text-[#2F2F2F] text-[24px] font-bold border-b-2 border-b-[#595959]'>Feeding Volunteers</label>

                  <div className='flex flex-col gap-4'>
                    {/* FILTERS */}
                    <div className='flex flex-row justify-between w-full'>
                      <form className='flex gap-2'>
                        <input type="search" placeholder='Search' className='bg-[#FFF] p-2 min-w-[400px] border-1 border-[#595959] rounded-[15px]'/>
                        <button className='bg-[#CFCFCF] p-2 pl-4 pr-4 rounded-[15px] cursor-pointer hover:bg-[#a3a3a3] active:bg-[#CFCFCF]'>Search</button>
                      </form>


                      <form className='flex flex-row items-center gap-2'>
                        <div className='flex items-center gap-1'>
                          <label className='leading-tight'>Date</label>
                          <input type="datetime-local" name="" id="" className='bg-[#FFF] p-2 min-w-[250px] rounded-[15px] border-1 border-[#595959]'/>
                        </div>
                        <button className='bg-[#CFCFCF] p-2 pl-4 pr-4 rounded-[15px] cursor-pointer hover:bg-[#a3a3a3] active:bg-[#CFCFCF]'>Search</button>
                      </form>
                    </div>

                    <table className='flex flex-col gap-2 w-full'>
                      <thead className='flex flex-col w-full gap-2'>
                        <tr className='grid grid-cols-5 justify-items-start place-items-center w-full bg-[#DC8801] p-3 rounded-[15px] text-[#FFF]'>
                          <th>User ID</th>
                          <th>Name</th>
                          <th>Contact No.</th>
                          <th>Schedule</th>
                          <th></th>
                        </tr>
                      </thead>

                      <tbody className='flex flex-col w-full  overflow-y-scroll min-h-[600px]'>
                        <tr className='grid grid-cols-5 justify-items-start place-items-center w-full bg-[#FFF] p-3 rounded-[15px] text-[#2F2F2F] border-b-1 border-b-[#595959]'>
                          <td>01</td>
                          <td>Angelo Cabangal</td>
                          <td>09084853419</td>
                          <td><input type="datetime-local" name="" id="" /></td>
                          <td className='flex gap-1'> 
                            <button className='bg-[#bbbbbb] p-1 pl-4 pr-4 text-[#2F2F2F] rounded-[15px] cursor-pointer active:bg-[#a3a3a3]'>Remove</button>
                          </td>
                        </tr>
                        <tr className='grid grid-cols-5 justify-items-start place-items-center w-full bg-[#FFF] p-3 rounded-[15px] text-[#2F2F2F] border-b-1 border-b-[#595959]'>
                          <td>01</td>
                          <td>Angelo Cabangal</td>
                          <td>09084853419</td>
                          <td>
                            <input type="datetime-local" name="" id="" />
                          </td>
                          <td className='flex gap-1'> 
                            <button className='bg-[#B5C04A] p-1 pl-4 pr-4 text-[#2F2F2F] rounded-[15px] cursor-pointer active:bg-[#a3a3a3]'>Save</button>
                            <button className='bg-[#bbbbbb] p-1 pl-4 pr-4 text-[#2F2F2F] rounded-[15px] cursor-pointer active:bg-[#a3a3a3]'>Remove</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default FeedingVolunteers