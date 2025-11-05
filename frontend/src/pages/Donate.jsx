import React from 'react'
import NavigationBar from '../components/NavigationBar';
import SideNavigation from '../components/SideNavigation';
import Footer from '../components/Footer';
import CatBot from '../components/CatBot';
import { useState } from 'react';
import Food from './DonateComponents/Food';
import Money from './DonateComponents/Money';
import Items from './DonateComponents/Items';
import Others from './DonateComponents/Others';


//TODO: Add screenshot of image of transaction for money dontation

const Donate = () => {

  const [selected, setSelected] = useState(null);

  const handleToggle = (value) => {
    setSelected(value);
  };

  return (
    <div className='flex flex-col min-h-screen pb-10'>
      <CatBot />
      <NavigationBar />
      <div className='grid grid-cols-[80%_20%] h-full'>
        <div className='flex flex-col pl-50 p-10'>
            <div  className='grid grid-cols-[20%_80%] w-full h-auto object-fit gap-2'>
              <div className='flex flex-col justify-start gap-10'>
                <div className='flex gap-2 items-center bg-[#DC8801] p-3 rounded-[10px] rounded-br-[0px]'> {/* HEADER TITLE */}
                  <div className='flex w-[30px] h-[30px]'>
                    <img src="/src/assets/icons/document.png" alt="" className='w-full h-full object-cover'/>
                  </div>
                  <label className='text-[16px] text-[#FFF] font-bold'>Donation Form</label>
                </div>
              </div>

              <div className='flex flex-col gap-2 p-3 bg-[#FFF] rounded-[25px]'>
                  <div className='flex flex-col items-center gap-2 w-full'> {/* DONATION OPTION TITLE */}
                    <div className='relative flex flex-col rounded-[15px] bg-[#DC8801]'>
                      <label className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[24px] text-[#FFF] font-bold z-10'>What do you want to donate?</label>
                      <div className='w-full h-[150px] rounded-[15px] overflow-hidden isolation-isolate'>
                        <img src="/src/assets/cats/cat-donate-bg.jpg" alt="" className='w-full h-auto object-cover mix-blend-multiply opacity-20'/>
                      </div>
                    </div>

                    {/* RADIO BUTTON */}
                    <div className='flex gap-3 w-full pb-4 pt-2 pr-4 border-dashed border-b-1 border-b-[#a3a3a3]'>
                      <label htmlFor="money" className='flex items-center justify-between w-full gap-3 p-2 border-1 border-[#a3a3a3] rounded-[10px]'>
                        <input type="radio" name="donation_type"  id="money" 
                        checked={selected === 'money'} onChange={() => handleToggle('money')}/>
                        Money
                      </label>
                      <label htmlFor="food" className='flex items-center justify-between w-full gap-3 p-2 border-1 border-[#a3a3a3] rounded-[10px]'>
                        <input type="radio" name="donation_type" id="food" 
                        checked={selected === 'food'} onChange={() => handleToggle('food')}/>
                        Food
                      </label>
                      <label htmlFor="items" className='flex items-center justify-between w-full gap-3 p-2 border-1 border-[#a3a3a3] rounded-[10px]'>
                        <input type="radio" name="donation_type" id="items" 
                        checked={selected === 'items'} onChange={() => handleToggle('items')}/>
                        Items
                      </label>
                      <label htmlFor="others" className='flex items-center justify-between w-full gap-3 p-2 border-1 border-[#a3a3a3] rounded-[10px]'>
                        <input type="radio" name="donation_type" id="others" 
                        checked={selected === 'others'} onChange={() => handleToggle('others')}/>
                        Others
                      </label>
                    </div>
                  </div>
                
                  {selected === 'money' && ( <Money /> )}
                  {selected === 'food' && ( <Food /> )}
                  {selected === 'items' && ( <Items />)}
                  {selected === 'others' && ( <Others /> )}
              </div>
            </div>
        </div>
        <SideNavigation />
      </div>

      <Footer />
    </div>
  )

}



export default Donate