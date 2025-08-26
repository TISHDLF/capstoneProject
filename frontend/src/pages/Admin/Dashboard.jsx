import React from 'react'

const Dashboard = () => {
  return (

    <div className='relative flex flex-col items-center p-10 min-h-screen gap-10 mx-auto'>
        <div className='absolute left-[15%] flex flex-col'>
            <div className='flex flex-row gap-1'> {/* Tabs */}
              <div className='font-bold text-[#FFF] p-4 pl-8 pr-8  bg-[#977655] rounded-tl-[15px] rounded-tr-[15px]  cursor-pointer hover:bg-[#DC8801] active:bg-[#977655]'>Users</div>
              <div className='font-bold text-[#FFF] p-4 pl-8 pr-8 bg-[#977655] rounded-tl-[15px] rounded-tr-[15px]  cursor-pointer hover:bg-[#DC8801] active:bg-[#977655]'>Cats</div>
              <div className='font-bold text-[#FFF] p-4 pl-8 pr-8 bg-[#977655] rounded-tl-[15px] rounded-tr-[15px]  cursor-pointer hover:bg-[#DC8801] active:bg-[#977655]'>Donations</div>
              <div className='font-bold text-[#FFF] p-4 pl-8 pr-8 bg-[#977655] rounded-tl-[15px] rounded-tr-[15px]  cursor-pointer hover:bg-[#DC8801] active:bg-[#977655]'>Adoption</div>
            </div>

            <div>
              Waitings pa sa final decisions
            </div>
        </div>

        
    </div>
  )
}

export default Dashboard