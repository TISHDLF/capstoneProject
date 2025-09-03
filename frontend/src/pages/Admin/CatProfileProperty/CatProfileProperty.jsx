import React from 'react'
import AdminSideBar from '../../../components/AdminSideBar'

const CatProfileProperty = () => {
  return (
    <div className='relative flex flex-col h-screen'>
        <div className='grid grid-cols-[20%_80%] overflow-x-hidden'>
            <AdminSideBar /> 

            <div className='flex flex-col items-center p-10 min-h-screen gap-3 overflow-y-scroll'>
                <div className='flex w-full items-center justify-between'>
                    <label className='text-[26px] font-bold text-[#2F2F2F] pl-2'> CAT PROFILE </label>

                    <button className='flex flex-row items-center justify-center gap-3 p-3 pl-6 pr-6 bg-[#B5C04A] text-[#FFF] rounded-[15px] hover:bg-[#CFDA34] active:bg-[#B5C04A]'>Create New</button>
                </div>

                <form className='flex flex-col gap-4 w-full h-auto bg-[#FFF] p-7 rounded-[20px]'>
                    {/* MAIN CONTENT OF CAT PROPERTY */}
                    <div className='flex flex-row justify-end gap-6 pb-2'>
                        <div className='flex items-center gap-2'> 
                            <label className='text-[14px]'>Date created:</label>
                            <label className='text-[14px] font-bold'>00/00/00</label>
                        </div>
                        <div className='flex items-center gap-2'> 
                            <label className='text-[14px]'>Date updated:</label>
                            <label className='text-[14px] font-bold'>00/00/00</label>
                        </div>
                    </div>
                    <div className='flex flex-row justify-between pb-2 border-b-1 border-b-[#CFCFCF]'>
                        <div className='flex flex-col'>
                            <label className='text-[16px] text-[#595959]'>Name</label>
                            <label className='font-bold text-[#2F2F2F] text-[20px]'>CAT NAME</label>
                        </div>
                        <div className='flex flex-col items-end'>
                            <label className='text-[16px] text-[#595959]'>Cat ID</label>
                            <label className='font-bold text-[#2F2F2F] text-[20px]'>0000</label>
                        </div>
                    </div>

                    {/* Age/Gender/Sterilization Status/Adoption Status */}
                    <div className='flex flex-row justify-between gap-3 w-full '>
                        <div className='flex flex-col gap-1 w-full'>
                            <label className='text-[16px] text-[#595959]'>Age</label>
                            <input type="number" placeholder='Input Age here'
                            className='appearance-none p-2 text-[#2F2F2F] rounded-[10px] border-2 border-[#CFCFCF] font-bold'/>
                        </div>
                        <div className='flex flex-col gap-1 w-full'>
                            <label className='text-[16px] text-[#595959]'>Gender</label>
                            {/* <input type="text" placeholder='Input gender here'
                            className='p-2 text-[#2F2F2F] rounded-[10px] border-2 border-[#CFCFCF] font-bold'/> */}
                            <select className='p-[10px] text-[#2F2F2F] rounded-[10px] border-2 border-[#CFCFCF] font-bold text-[#2F2F2F]'>
                                <option disable hidden>Select a gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                        <div className='flex flex-col gap-1 w-full'>
                            <label className='text-[16px] text-[#595959]'>Sterilization Status</label>
                            <select className='p-[10px] text-[#2F2F2F] rounded-[10px] border-2 border-[#CFCFCF] font-bold text-[#2F2F2F]'>
                                <option disable hidden>Select the cat's sterilization status</option>
                                <option value="Intact">Intact</option>
                                <option value="Neutered">Neutered</option>
                                <option value="Spayed">Spayed</option>
                            </select>
                        </div>

                        <div className='flex flex-col gap-1 w-full'>
                            <label className='text-[16px] text-[#595959]'>Adoption Status</label>
                            <select className='p-[10px] text-[#2F2F2F] rounded-[10px] border-2 border-[#CFCFCF] font-bold text-[#2F2F2F]'>
                                <option disable hidden>Select the cat's adoption status</option>
                                <option value="Available">Available</option>
                                <option value="Pending">Pending</option>
                                <option value="Adopted">Adopted</option>
                            </select>
                        </div>
                    </div>

                    {/* Adoption History */}
                    <div className='flex flex-col gap-1'>
                        <label className='text-[16px] text-[#595959]'>Adoption history</label>
                        <div className='flex flex-row justify-between p-2 rounded-[10px] border-2 border-[#F2F2F2] bg-[#F2F2F2]'>
                            <div className='flex flex-row gap-5'>
                                <label className='text-[#595959]'>Adopter: </label>
                                <label className='text-[#2F2F2F] font-bold'>Angelo M. Cabangal</label>
                            </div>

                            <div className='flex flex-row gap-5'>
                                <label className='text-[#595959]'>Date Adopted: </label>
                                <label className='text-[#2F2F2F] font-bold'>00/00/00</label>
                            </div>

                            <div className='flex flex-row gap-5'>
                                <label className='text-[#595959]'>Contact #: </label>
                                <label className='text-[#2F2F2F] font-bold'>09084853419</label>
                            </div>
                        </div>
                    </div>

                    {/* Image/s */}
                    <div className='flex flex-col'>
                        <div className='flex items-center justify-between'>
                            <label className='text-[#595959]'>Image/s</label>
                            <label htmlFor="catImageUpload"
                            className='p-2 pl-6 pr-6 w-auto h-auto bg-[#2F2F2F] text-[#FFF] rounded-[15px] cursor-pointer hover:bg-[#595959] active:bg-[#2F2F2F]'>
                                Upload
                                <input type="file" accept='image/*' id="catImageUpload" className='hidden'/>
                            </label>
                        </div>
                        <div className='flex gap-2 w-full'>
                            <div className='relative bg-[#595959] w-[250px] h-auto rounded-[10px] overflow-hidden'>
                                <button className='absolute top-2 right-2 p-1 pl-4 pr-4 bg-[#FFF] text-[#2F2F2F] font-bold rounded-[10px] cursor-pointer active:bg-[#CFCFCF]'>Delete</button>
                                <img src="/src/assets/icons/CatImages/cat1.jpg" alt="" /> 
                            </div>
                        </div>
                    </div>

                    {/* CAT DESCRIPTION */}
                    <div className='flex flex-col'>
                        <label className='text-[#595959] font-bold'>Description</label>
                        <textarea name="" id="" rows={5} className='border-2 border-[#CFCFCF] resize-none rounded-[15px] p-2' placeholder='Describe the cat here'></textarea>
                    </div>

                    <div className='flex justify-end'>
                        <button className='p-2 pl-4 pr-4 bg-[#DC8801] text-[#FFF] font-bold w-auto rounded-[15px] hover:bg-[#FFB235] active:bg-[#DC8801]'>
                        Save Changes
                    </button>
                    </div>
                </form>
            </div>
        </div>

    </div>
  )
}

export default CatProfileProperty