import React from 'react'
import { Link } from 'react-router-dom'
import NavigationBar from '../components/NavigationBar'
import SideNavigation from '../components/SideNavigation'
import Footer from '../components/Footer'
import CatBot from '../components/CatBot'

const CatAdoption = () => {
  return (
    <div className='flex flex-col min-h-screen'>
      <CatBot />
      <NavigationBar />

      <div className='grid grid-cols-[80%_20%] h-full'>
        <div className='flex flex-col pl-50 p-10'>
          {/* ALL CONTENTS HERE */}
          <div className='grid grid-cols-3 w-[1000px] h-auto place-items-center gap-5'> 

            <div className='grid grid-rows-[60%_40%] bg-[#FFF] rounded-[25px] justify-center border-2 border-[#FFF] shadow-lg hover:border-2 hover:border-[#B5C04A]'>
              <div className='overflow-hidden rounded-tl-[25px] rounded-tr-[25px]'>
                <img src="src/assets/icons/CatImages/cat1.jpg" alt="cat image 1" className='overflow-hidden'/>
              </div>

              <div className='flex flex-col justify-center p-3'> 

                <div className='flex flex-col gap-4'>
                  <div className='grid grid-rows-2'>
                    <label className='flex flex-row items-end font-bold text-2xl text-[#DC8801] gap-2'>
                      <div className='w-[40px] h-auto'>
                        <img src="src/assets/icons/paw-gray.png" alt="gray paw" />
                      </div>
                      Cat Name
                    </label>

                    <div className='flex flex-row gap-3 border-dashed border-b-2 border-b-[#B5C04A]'>
                      <label className='flex flex-row items-center font-bold text-[12px] gap-[5px]'>
                        <div className='flex items-center justify-center w-[20px] h-auto'>
                          <img src="src/assets/icons/female.png" alt="female sign" className='object-cover'/>
                        </div>
                        Gender
                      </label>
                      <label className='flex flex-row items-center font-bold text-[12px] gap-[5px]'>
                        <div className='flex items-center justify-center w-[15px] h-auto'>
                          <img src="src/assets/icons/hourglass.png" alt="hourglas" />
                        </div>
                        Cat Age
                      </label>
                    </div>
                  </div>
                
                  <label className='text-justify leading-tight text-[14px] text-[#555555] pl-2'>Luna is a soft-spoken soul with a quiet, almost celestial presence. She's the...</label>

                  <Link to="/catprofile" className='flex flex-row gap-2 items-center justify-center bg-[#B5C04A] p-2 ml-[25px] rounded-[10px] w-[100%]
                  hover:bg-[#CFDA34] active:bg-[#B5C04A]'>
                    <label className='font-bold text-[#FFF]'>More Info</label>
                    <div className='w-[30px] h-auto object-contain'>
                      <img src="src/assets/icons/right-arrow.png" alt="right arrow" />
                    </div>
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
        <SideNavigation />
      </div>
      <Footer />
    </div>
  )
}

export default CatAdoption