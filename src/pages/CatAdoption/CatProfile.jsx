import React from 'react'
import { Link } from 'react-router-dom'

const CatProfile = () => {
  return (
    <div className='relative flex flex-row items-center pl-50 pb-20 w-auto min-h-screen gap-2'>
        <button className='flex items-center justify-center bg-[#B5C04A] w-[50px] h-[50px] p-2 rounded-[50%]  hover:bg-[#CFDA34] active:bg-[#B5C04A]'>
            <img src="src/assets/icons/arrow-left-no-tail.png" alt="arrow left" className='w-auto h-full' />
        </button>
        
        <div className='relative grid grid-cols-[60%_40%] w-[1000px] h-auto bg-[#FFF] p-5 rounded-[25px] shadow-md'>
            <div className='flex flex-col bg-[#FDF5D8] w-auto p-4 gap-4 rounded-[20px] box-content overflow-hidden'>
                <div className='flex flex-col items-center h-[500px] w-full rounded-[16px] overflow-hidden'>
                    <img src="src/assets/icons/CatImages/cat2.jpg" alt="cat image" className='h-auto object-cover'/>
                </div>
                <div className='grid grid-cols-5 object-cover pl-1 overflow-hidden gap-2'>
                    <div className='w-[100px] h-[100px] overflow-hidden object-fill rounded-[10px]'>
                        <img src="src/assets/icons/CatImages/cat2.jpg" alt="cat image" className='w-full h-full object-cover'/>
                    </div>
                    <div className='w-[100px] h-[100px] overflow-hidden object-fill rounded-[10px]'>
                        <img src="src/assets/icons/CatImages/cat2.jpg" alt="cat image" className='w-full h-full object-cover'/>
                    </div>
                    <div className='w-[100px] h-[100px] overflow-hidden object-fill rounded-[10px]'>
                        <img src="src/assets/icons/CatImages/cat2.jpg" alt="cat image" className='w-full h-full object-cover'/>
                    </div>
                    <div className='w-[100px] h-[100px] overflow-hidden object-fill rounded-[10px]'>
                        <img src="src/assets/icons/CatImages/cat2.jpg" alt="cat image" className='w-full h-full object-cover'/>
                    </div>
                    <div className='w-[100px] h-[100px] overflow-hidden object-fill rounded-[10px]'>
                        <img src="src/assets/icons/CatImages/cat2.jpg" alt="cat image" className='w-full h-full object-cover'/>
                    </div>
                </div>
            </div>


            <div className='flex flex-col justify-between items-start p-5 w-full'>
                <div className='flex flex-col gap-2 items-start w-full'>
                    <div className='flex flex-row items-center w-full gap-2 pb-2 border-b-2 border-b-[#DC8801]'>
                        <div className='w-[30px] h-auto'>
                            <img src="src/assets/icons/paw-gray.png" alt="cat paw" />
                        </div>
                        <label className='font-bold text-[18px] text-[#DC8801]'>Cat Name</label>
                    </div>

                    <div className='flex flex-col pt-3 pb-3 w-full'>
                        <div className='flex flex-row items-center gap-1 border-b-1 border-b-[#B5C04A] pb-1 pt-1'>
                            <div className='flex flex-col items-center justify-center h-[30px] w-[30px] bg-[#B5C04A] p-[5px] rounded-[50%]'>
                                <img src="src/assets/icons/genders.png" alt="gender" />
                            </div>
                            <div className='text-[14px]'>
                                <label className='font-bold pr-2'>Gender:</label>
                                <label> I am a male, i have a dih! </label>
                            </div>  
                        </div>
                        <div className='flex flex-row items-center gap-1 border-b-1 border-b-[#B5C04A] pb-1 pt-1'>
                            <div className='flex flex-col items-center justify-center h-[30px] w-[30px] bg-[#B5C04A] p-[5px] rounded-[50%]'>
                                <img src="src/assets/icons/genders.png" alt="gender" />
                            </div>
                            <div className='text-[14px]'>
                                <label className='font-bold pr-2'>Age:</label>
                                <label> Age doesn't matter! </label>
                            </div>  
                        </div>
                        <div className='flex flex-row items-center gap-1 border-b-1 border-b-[#B5C04A] pb-1 pt-1'>
                            <div className='flex flex-col items-center justify-center h-[30px] w-[30px] bg-[#B5C04A] p-[5px] rounded-[50%]'>
                                <img src="src/assets/icons/genders.png" alt="gender" />
                            </div>
                            <div className='text-[14px]'>
                                <label className='font-bold pr-2x'>Sterilization Status:</label>
                                <label> I still have my balls! </label>
                            </div>  
                        </div>
                        
                    </div>
                    <div className='text-justify text-[#5f5f5f]'>
                        {/* Cat Description */} True to his name, Loki is the trickster of the bunch. Always scheming, always curious, he’s never too far from the scene of a minor disaster, like an upturned water bowl or a mysteriously relocated toy. He thrives on stimulation, loves interactive play, and often greets visitors with bold, playful energy. He’s affectionate too, but on his own terms, often flopping dramatically when he wants belly rubs (and maybe when he doesn’t, just to keep things interesting).
                    </div>
                </div>

                <Link to="" className='bg-[#B5C04A] text-[#FFF] font-bold p-3 rounded-[15px] w-full text-center hover:bg-[#CFDA34] active:bg-[#B5C04A]'>
                    I want to adopt this cat
                </Link>
            </div>
        </div>

        <button className='flex items-center justify-center bg-[#B5C04A] w-[50px] h-[50px] rounded-[50%] p-2 hover:bg-[#CFDA34] active:bg-[#B5C04A]'>
            <img src="src/assets/icons/arrow-right-no-tail.png" alt="arrow right" className='w-auto h-full' />
        </button>
    </div>
  )
}

export default CatProfile