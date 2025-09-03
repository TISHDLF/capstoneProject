import React from 'react'
import NavigationBar from '../../components/NavigationBar'
import Footer from '../../components/Footer'
import SideNavigation from '../../components/SideNavigation'


const Profile = () => {
  return (
    <div className='flex flex-col min-h-screen pb-10'>
        <NavigationBar />

        <div className='grid grid-cols-[80%_20%] h-full'>
            <div className='flex flex-col pl-50 p-10'>
                {/* ALL CONTENTS HERE */}
                <div className='grid grid-cols-[20%_80%] bg-[#FFF] rounded-[12px] overflow-hidden'>
                    <div className='flex flex-col gap-10 pt-10'>
                        <div className='flex flex-row justify-between items-center p-3 bg-[#FFF] rounded-tr-[20px] rounded-br-[20px] shadow-md'>
                            <label className='font-bold text-[#DC8801]'>Adoptee Form</label>
                            <div className='flex items-center justify-center w-[30px] h-auto'> 
                                <img src="src/assets/icons/clipboard-white.png" alt="white clipboard" className='w-full h-auto '/>
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-col bg-[#FFF] p-10 gap-5'>
                        <div className='flex flex-col gap-4 bg-[#FDF5D8] p-10 rounded-[15px] shadow-md'>
                            {/* MAIN PROFILE */}
                            <div className='relative flex flex-row gap-5'>
                                <div className='flex w-[250px] h-[200px] bg-[#B5C04A] rounded-sm p-2'>
                                    <img src="/src/assets/UserProfile/Profile.jpg" alt="" className='object-cover'/>
                                </div>
                                <div className='flex flex-col'>
                                    <div className='flex flex-row gap-3 border-b-2 border-dashed border-[#bbc3c1] pt-2 pb-2'>
                                        <label className='font-bold'>Name:</label>
                                        <label>Angelo Cabangal</label>
                                    </div>
                                    <div className='flex flex-row items-center gap-3 border-b-2 border-dashed border-[#bbc3c1] pt-2 pb-2'>
                                        
                                        <label className='flex flex-row items-center font-bold gap-[5px]'>
                                            <div className='w-[30px] h-auto'>
                                                <img src="/src/assets/icons/location-orange.png" alt="" />
                                            </div> 
                                            Address: 
                                        </label>
                                        <label> Philippines </label>
                                    </div>
                                    <div className='flex flex-row items-center gap-3 border-b-2 border-dashed border-[#bbc3c1] pt-2 pb-2'>
                                        <label className='flex flex-row items-center font-bold gap-[5px]'>
                                            <div className='w-[30px] h-auto'>
                                                <img src="/src/assets/icons/email-orange.png" alt="" />
                                            </div> 
                                            Email: 
                                        </label>
                                        <label>EmailAddress@yahoo.com</label>
                                    </div>
                                    <div className='flex flex-row items-center gap-3 border-b-2 border-dashed border-[#bbc3c1] pt-2 pb-2'>
                                        <label className='flex flex-row items-center font-bold gap-[5px]'>
                                            <div className='w-[30px] h-auto'>
                                                <img src="/src/assets/icons/badge-orange.png" alt="" />
                                            </div> 
                                            Badge: 
                                        </label>
                                        <label>Toe Bean Trainee</label>
                                    </div>
                                    <label className='leading-tight text-[14px] pt-4 pb-2 text-[#645e5f]'>
                                        You've received the <strong>Snuggle Scout</strong> badge! You're cuddly corners and warming hearts along the way. <br/>
                                        Thanks for your growing support! Your cozy contributions don't go unnoticed!
                                    </label>
                                </div>
                                <div className='absolute bottom-0 left-0 flex flex-row gap-2'>
                                    <button className='bg-[#B5C04A] min-w-[90px] p-2 rounded-[10px] text-[#000] hover:bg-[#CFDA34] active:bg-[#B5C04A]'>Edit Profile</button>
                                    <button className='bg-[#B5C04A] min-w-[90px] p-2 rounded-[10px] text-[#000] hover:bg-[#CFDA34] active:bg-[#B5C04A]'>Save</button>
                                </div>              
                            </div>     
                        </div>
                        <div className='flex flex-col gap-4 bg-[#FDF5D8] p-10 rounded-[15px] shadow-md'>
                            {/* WHISKER METER */}
                            Badge Design Here
                            <progress className='w-full 
                                [&::-webkit-progress-bar]:rounded-lg 
                                [&::-webkit-progress-value]:rounded-lg 
                                [&::-webkit-progress-bar]:bg-slate-300 
                                [&::-webkit-progress-value]:bg-[#B5C04A]
                                [&::-moz-progress-bar]:bg-green-400' value="50" max="100">
                                100%
                            </progress>
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

export default Profile