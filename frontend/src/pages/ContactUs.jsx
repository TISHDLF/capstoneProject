import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import NavigationBar from '../components/NavigationBar';
import SideNavigation from '../components/SideNavigation';
import Footer from '../components/Footer';
import CatBot from '../components/CatBot';

const handleGoBack = () => {
  window.history.back();
}

const ContactUs = () => {
  return (
    <div className='flex flex-col min-h-screen pb-10'>
      <CatBot />
      <NavigationBar />
      <div className='grid grid-cols-[80%_20%] h-full'>
        <div className='flex flex-col pl-50 p-10'> 
          <div className='relative flex flex-col items-center bg-[#FFF] w-[1000px] p-10 gap-10 rounded-[25px] shadow-md'>
            <Link onClick={handleGoBack} className='absolute left-0 top-0 flex items-center h-12 gap-2 p-2 pr-3 rounded-xl box-border bg-[#DC8801] object-contain hover:bg-[#eea32e] active:bg-[#DC8801]'>
              <img src="src/assets/icons/arrow.png" alt="arrow" className='max-w-full max-h-full object-contain scale-75'/>
              <label className='font-bold text-[#FFF]'> Back </label>
            </Link>

            <label className='font-bold text-3xl'>Pet Shops and Veterinary Clinics Near Us</label>
            <div className='grid grid-cols-3 gap-5'>
              <div className='flex flex-col bg-[#FDF5D8] p-3 drop-shadow-[0px_-12px_0px_rgba(181,192,74,1)] rounded-[25px] gap-3'>
                <div className='flex flex-row items-center justify-between border-b-2 border-b-[#B5C04A] pb-2'>
                  <label className='font-bold text-[18px]'>Delivery Option</label>
                  <div className='flex items-center justify-center h-auto w-[50px] p-2 bg-[#CFDA34] rounded-[25px]'>
                    <img src="src/assets/icons/delivery.png" alt="box" className='max-w-full max-h-full object-contain'/>
                  </div>
                </div>
                <div className='flex flex-col'>
                  <label className='font-bold text-[#DC8801]'>Barkbol Pet Supplies and Trading</label>
                  <label>Las Pinas City</label>
                </div>
                <div className='flex flex-col gap-2'>
                  <label className='leading-tight'>Free delivery with minimum purchase!</label>
                  <label className='underline'>0960 604 1885</label>
                </div>
              </div>

              <div className='flex flex-col bg-[#FDF5D8] p-3 drop-shadow-[0px_-12px_0px_rgba(181,192,74,1)] rounded-[25px] gap-3'>
                <div className='flex flex-row items-center justify-between border-b-2 border-b-[#B5C04A] pb-2'>
                  <label className='font-bold text-[18px]'>Veterinary Clinics</label>
                  <div className='flex items-center justify-center h-auto w-[50px] p-2 bg-[#CFDA34] rounded-[25px]'>
                    <img src="src/assets/icons/clip-board.png" alt="box" className='max-w-full max-h-full object-contain'/>
                  </div>
                </div>
                <div className='flex flex-col'>
                  <label className='font-bold text-[#DC8801]'>Petpaws Animal Clinic</label>
                  <label className='leading-tight'>Dona Soledad, Paranaque City</label>
                </div>
                <div className='flex flex-col gap-2'>
                  <label className='leading-tight'>Open 24 Hours for your pet's needs!</label>
                  <label>
                    <label className='underline'>0919 306 7808</label>
                    <label> or </label>
                    <label className='underline'>0915 615 7776</label>
                  </label>
                </div>
              </div>

              <div className='flex flex-col bg-[#FDF5D8] p-3 drop-shadow-[0px_-12px_0px_rgba(181,192,74,1)] rounded-[25px] gap-3'>
                <div className='flex flex-row items-center justify-between border-b-2 border-b-[#B5C04A] pb-2'>
                  <label className='font-bold text-[18px]'>Delivery Option</label>
                  <div className='flex items-center justify-center h-auto w-[50px] p-2 bg-[#CFDA34] rounded-[25px]'>
                    <img src="src/assets/icons/delivery.png" alt="box" className='max-w-full max-h-full object-contain'/>
                  </div>
                </div>
                <div className='flex flex-row justify-between items-center'>
                  <div className='flex flex-col'>
                    <label className='font-bold leading-tight'>Jeal's Petshop</label>
                    <label>Paranaque City</label>
                  </div>
                  <div>
                    <label className='underline'>0960 354 4354</label>
                  </div>
                </div>
                <div className='flex flex-row justify-between items-center'>
                  <div className='flex flex-col'>
                    <label className='font-bold leading-tight'>Grinsy Petshop</label>
                    <label className='leading-tight'>Dona Soledad, Paranaque City</label>
                  </div>
                  <div>
                    <label className='underline'>0927 335 7878</label>
                  </div>
                </div>
              </div>
            </div>

            <div className='flex items-center justify-center object-cover pl-1'>
              <img src="src/assets/cat-contacts.png" alt="" className='scale-114'/>
            </div>

            <label className='leading-tight'>
              Stay updated on pet care tips, events, and adorable cat pictures follow us at 
              <Link to="https://www.facebook.com/sprcats" target='_blank' className='text-[#DC8801]'> https://www.facbook.com/sprcats</Link> 
            </label>
          </div>
        </div>
        <SideNavigation />
      </div>  

      <Footer />    
    </div>
  )
}

export default ContactUs