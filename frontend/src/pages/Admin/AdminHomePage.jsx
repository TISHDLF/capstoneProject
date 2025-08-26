import React from 'react'

const AdminHomePage = () => {
  return (
    <div className='relative flex flex-col items-center p-10 min-h-screen gap-10 mx-auto'>
      <div className='absolute left-[15%] flex flex-col gap-10'>
        <div className='flex flex-col gap-5 p-5 border-dashed border-2 border-[#DC8801] rounded-[25px]'>
          <label htmlFor="" className='font-bold text-2xl'>Admin Dashboard</label>
          <div className='grid grid-cols-3 w-full h-auto gap-5'>
            <div className='flex flex-row items-center justify-evenly p-5 gap-2 bg-[#FFF] rounded-[20px] shadow-md'> 
              <div className='flex flex-col'>
                <label htmlFor="">Total Users</label>
                <label className='font-bold '>00000</label>
              </div>
              <div>
                <img src="/src/assets/icons/admin-icons/total--user.png" alt="" />
              </div>
            </div>

            <div className='flex flex-row items-center justify-evenly p-5 gap-2 bg-[#FFF] rounded-[20px] shadow-md'> 
              <div className='flex flex-col'>
                <label htmlFor="">Total Cats</label>
                <label className='font-bold '>00000</label>
              </div>
              <div>
                <img src="/src/assets/icons/admin-icons/total-cats.png" alt="" />
              </div>
            </div>

            <div className='flex flex-row items-center justify-evenly p-5 gap-2 bg-[#FFF] rounded-[20px] shadow-md'> 
              <div className='flex flex-col'>
                <label htmlFor="">Total Financial Donations</label>
                <label className='font-bold '>0.00</label>
              </div>
              <div>
                <img src="/src/assets/icons/admin-icons/total-donation.png" alt="" />
              </div>
            </div>
          </div>

        </div>

        <div className='flex flex-col gap-5 bg-[#977655] p-5 rounded-[25px]'>
          <label htmlFor="" className='font-bold text-2xl text-[#FFF]'>Monthly Summary</label>
          
          <div className='grid grid-cols-3 w-full h-auto gap-5'>
            <div className='flex flex-row items-center justify-evenly p-5 gap-2 bg-[#FFF] rounded-[20px] shadow-md'> 
              <div className='flex flex-col'>
                <label htmlFor="">New Users</label>
                <label className='font-bold '>00000</label>
              </div>
              <div>
                <img src="/src/assets/icons/admin-icons/total--user.png" alt="" />
              </div>
            </div>

            <div className='flex flex-row items-center justify-evenly p-5 gap-2 bg-[#FFF] rounded-[20px] shadow-md'> 
              <div className='flex flex-col'>
                <label htmlFor="">Total Cats Adopted</label>
                <label className='font-bold '>00000</label>
              </div>
              <div>
                <img src="/src/assets/icons/admin-icons/total-cats.png" alt="" />
              </div>
            </div>

            <div className='flex flex-row items-center justify-evenly p-5 gap-2 bg-[#FFF] rounded-[20px] shadow-md'> 
              <div className='flex flex-col'>
                <label htmlFor="">Total Financial Donations</label>
                <label className='font-bold '>0.00</label>
              </div>
              <div>
                <img src="/src/assets/icons/admin-icons/total-donation.png" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminHomePage