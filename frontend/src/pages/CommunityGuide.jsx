import React from 'react'
import { Link } from 'react-router-dom'

const handleGoBack = () => {
  window.history.back()
}

const CommunityGuide = () => {
  return (
    <div className='flex flex-col pt-10 pl-50 pb-20 h-screen w-auto'>
      <div className='relative flex flex-col items-center justify-center w-[950px] h-auto bg-[#FFF] pt-20 p-10 rounded-[25px] gap-10 shadow-md'>
        <Link onClick={handleGoBack} className='absolute left-0 top-0 flex items-center h-12 gap-2 p-2 pr-3 rounded-xl box-border bg-[#DC8801] object-contain hover:bg-[#eea32e] active:bg-[#DC8801]'>
          <img src="src/assets/icons/arrow.png" alt="arrow" className='max-w-full max-h-full object-contain scale-75'/>
          <label className='font-bold text-[#FFF]'> Back </label>
        </Link>

        <div className='flex flex-row gap-5'>
          <div className='relative flex items-center justify-center h-auto w-[75px] p-3 bg-[#f3e0c3] rounded-[50%]'>
            <img src="src/assets/icons/id.png" alt="id" className='max-w-full max-h-full object-contain'/>
            <img src="src/assets/icons/check.png" alt="check mark" className='absolute bottom-[-10%] right-[-10%] w-[35px] h-auto'/>
          </div>

          <div className='flex flex-col'>
            <label className='font-bold pb-2 pt-3 border-b-2 border-b-[#DC8801]'>Only official Volunteers may feed the cats at a designated time and place.</label>
            <label className='leading-tight italic pt-2'>Ang mga opisyal na voluteer lang ang puwedeng magpakain sa mga pusa sa tamang oras at lugar.</label>
          </div>

        </div>

        <div className='flex flex-row gap-5'>
          <div className='relative flex items-center justify-center h-auto w-[75px] p-3 bg-[#f3e0c3] rounded-[50%]'>
            <img src="src/assets/icons/trash-bin-black.png" alt="id" className='max-w-full max-h-full object-contain'/>
            <img src="src/assets/icons/check.png" alt="check mark" className='absolute bottom-[-10%] right-[-10%] w-[35px] h-auto'/>
          </div>

          <div className='flex flex-col'>
            <label className='font-bold pb-2 pt-3 border-b-2 border-b-[#DC8801]'>Only official Volunteers may feed the cats at a designated time and place.</label>
            <label className='leading-tight italic pt-2'>Ang mga opisyal na voluteer lang ang puwedeng magpakain sa mga pusa sa tamang oras at lugar.</label>
          </div>

        </div>

        <div className='flex flex-row gap-5'>
          <div className='relative flex items-center justify-center h-auto w-[75px] p-3 bg-[#f3e0c3] rounded-[50%]'>
            <img src="src/assets/icons/cat-food.png" alt="id" className='max-w-full max-h-full object-contain'/>
            <img src="src/assets/icons/check.png" alt="check mark" className='absolute bottom-[-10%] right-[-10%] w-[35px] h-auto'/>
          </div>

          <div className='flex flex-col'>
            <label className='font-bold pb-2 pt-3 border-b-2 border-b-[#DC8801]'>Only official Volunteers may feed the cats at a designated time and place.</label>
            <label className='leading-tight italic pt-2'>Ang mga opisyal na voluteer lang ang puwedeng magpakain sa mga pusa sa tamang oras at lugar.</label>
          </div>

        </div>

        <div className='flex flex-row gap-5'>
          <div className='relative flex items-center justify-center h-auto w-[75px] p-3 bg-[#f3e0c3] rounded-[50%]'>
            <img src="src/assets/icons/canned-food.png" alt="id" className='max-w-full max-h-full object-contain'/>
            <img src="src/assets/icons/check.png" alt="check mark" className='absolute bottom-[-10%] right-[-10%] w-[35px] h-auto'/>
          </div>

          <div className='flex flex-col'>
            <label className='font-bold pb-2 pt-3 border-b-2 border-b-[#DC8801]'>Only official Volunteers may feed the cats at a designated time and place.</label>
            <label className='leading-tight italic pt-2'>Ang mga opisyal na voluteer lang ang puwedeng magpakain sa mga pusa sa tamang oras at lugar.</label>
          </div>

        </div>
        
      </div>
    </div>
  )
}

export default CommunityGuide