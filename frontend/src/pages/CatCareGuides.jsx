import React from 'react'
import { Link } from 'react-router-dom';
import SideNavigation from '../components/SideNavigation';
import NavigationBar from '../components/NavigationBar';
import Footer from '../components/Footer';

const handleGoBack = () => {
  window.history.back()
}; 

const CatCareGuides = () => {
  return (
    <div className='flex flex-col min-h-screen pb-10'>
      <NavigationBar />

      <div className='grid grid-cols-[80%_20%] h-full'>
        <div className='flex flex-col pl-50 p-10'>
          {/* ALL CONTENTS HERE */}
          <div className='relative flex flex-col items-center max-w-[1000px] bg-[#FFF] p-15 gap-15 rounded-[25px] shadow-md'>
            <Link onClick={handleGoBack} className='absolute left-0 top-0 flex items-center h-12 gap-2 p-2 pr-3 rounded-xl box-border bg-[#DC8801] object-contain hover:bg-[#eea32e] active:bg-[#DC8801]'>
              <img src="src/assets/icons/arrow.png" alt="arrow" className='max-w-full max-h-full object-contain scale-75'/>
              <label className='font-bold text-[#FFF]'> Back </label>
            </Link>

            <div className='flex flex-col items-center gap-3'>
              <label className='font-bold text-2xl leading-tight'> From Stray to Stay: Caring for a Rescue Cat </label>
              <label className='text-center'> Adopting is a big responsibility as cats who once lived on the streets need time, patience and extra love to adjust to their new home. Following this guide will help your new feline friend feel safe, healthy, and truly at home. </label>
            </div>

            
            <div className='grid grid-cols-3 gap-10 place-concent-center w-full'>
              <div className='relative flex flex-col p-5 bg-[#FDF5D8] gap-5 rounded-[25px] shadow-md'>
                <label className='absolute flex items-center justify-center top-[-5%] left-[-10%] w-[50px] h-[50px] font-bold text-2xl bg-[#DC8801] text-[#FFF] p-3 rounded-[50%]'> 1 </label>

                <div className='flex flex-row items-center gap-3'>
                  <div className='h-auto w-[80px] p-4 object-contain flex items-center justify-center bg-[#B5C04A] rounded-[25%]'>
                    <img src="src/assets/icons/CatCareGuides/house.png" alt="" className='max-w-full max-h-full object-fill'/>
                  </div>
                  <label className='w-full font-bold text-center'>Creating a Safe Space</label>
                </div>

                <label className='text-[#515151] text-[16px] leading-tight text-justify'>A new environment can be overwhelming for a rescued cat.</label>

                <div>
                  <label className='font-bold'>Start by preparing:</label>
                  <ul className='list-disc space-y-2 pl-6'>
                    <li className='text-[#515151] leading-tight'>A quiet room with food, water, a litter box, and a soft bed.</li>
                    <li className='text-[#515151] leading-tight'>Safe hiding spots like boxes or corners.</li>
                    <li className='text-[#515151] leading-tight'>Minimal noise and few visitors at first.</li>
                  </ul>
                </div>

                <div className='flex flex-col leading-tight'>
                  <label className='font-bold'>Why it matters:</label>
                  <label className='text-[#515151]'>Strays may be anxious or fearful. A calm, enclosed space helps them feel protected as they settle in.</label>
                </div>
              </div>

              <div className='relative flex flex-col bg-[#FDF5D8] p-5 gap-5 rounded-[25px] shadow-md'>
                <label className='absolute flex items-center justify-center top-[-5%] left-[-10%] w-[50px] h-[50px] font-bold text-2xl bg-[#DC8801] text-[#FFF] p-3 rounded-[50%]'> 2 </label>
                <div className='flex flex-row items-center gap-3'>
                  <div className='h-auto w-[80px] p-4 object-contain flex items-center justify-center bg-[#B5C04A] rounded-[25%]'>
                    <img src="src/assets/icons/CatCareGuides/pet-food.png" alt="pet food" className='max-w-full max-h-full object-contain'/>
                  </div>
                  <label className='w-full font-bold text-center'>Maintain Good Nutrition</label>
                </div>

                <label className='text-[#515151] text-[16px] leading-tight text-justify'>Good nutrition is key to recovery and health.</label>
                
                <div>
                  <label className='font-bold'>Basic feeding guidelines:</label>
                  <ul className='list-disc space-y-2 pl-6'>
                    <li className='text-[#515151] leading-tight'>Use quality cat food suited to their age and health.</li>
                    <li className='text-[#515151] leading-tight'>Provide them fresh water.</li>
                    <li className='text-[#515151] leading-tight'>Feed at consistent times.</li>
                    <li className='text-[#515151] leading-tight'>Avoid giving human food, especially milk, bones, or anything seasoned.</li>
                  </ul>
                </div>

                <div className='flex flex-col leading-tight'>
                  <label className='font-bold'>Why it matters:</label>
                  <label className='text-[#727272]'>Gradually shift from whatever scraps they where used to by mixing in new food slowly.</label>
                </div>
              </div>

              <div className='relative flex flex-col bg-[#FDF5D8] p-5 gap-5 rounded-[25px] shadow-md'>
                <label className='absolute flex items-center justify-center top-[-5%] left-[-10%] w-[50px] h-[50px] font-bold text-2xl bg-[#DC8801] text-[#FFF] p-3 rounded-[50%]'> 3 </label>

                <div className='flex flex-row items-center gap-3 w-100%'>
                  <div className='h-auto w-[80px] p-4 object-contain flex items-center justify-center bg-[#B5C04A] rounded-[25%]'>
                    <img src="src/assets/icons/CatCareGuides/cat-box.png" alt="cat litter box" className='max-w-full max-h-full object-contain'/>
                  </div>
                  <label className='w-full font-bold text-center'>Support Litter Training</label>
                </div>

                <label className='text-[#515151] text-[16px] leading-tight text-justify'>Most stray cats instinctively understand how to use a litter box, but they may need guidance.</label>

                <div>
                  <label className='font-bold'>Tips to encourage good habits:</label>
                  <ul className='list-disc space-y-2 pl-6'>
                    <li className='text-[#515151] leading-tight'>Use unscented, clumping litter.</li>
                    <li className='text-[#515151] leading-tight'>Keep the box clean and in a quiet location.</li>
                    <li className='text-[#515151] leading-tight'>Scoop daily and change the litter weekly.</li>
                    <li className='text-[#515151] leading-tight'>Have one vox per cat, plus one extra.</li>
                  </ul>
                </div>

                <div className='flex flex-col leading-tight'>
                  <label className='font-bold'>Why it matters:</label>
                  <label className='text-[#515151]'>If accidents happen, don't punish-just clean up and try adjusting the box's location.</label>
                </div>
              </div>

              <div className='relative flex flex-col bg-[#FDF5D8] p-5 gap-5 rounded-[25px] shadow-md'>
                <label className='absolute flex items-center justify-center top-[-5%] left-[-10%] w-[50px] h-[50px] font-bold text-2xl bg-[#DC8801] text-[#FFF] p-3 rounded-[50%]'> 4 </label>

                <div className='flex flex-row items-center gap-3 w-100%'>
                  <div className='h-auto w-[80px] p-4 object-contain flex items-center justify-center bg-[#B5C04A] rounded-[25%]'>
                    <img src="src/assets/icons/CatCareGuides/first-aid-kit.png" alt="cat litter box" className='max-w-full max-h-full object-contain'/>
                  </div>
                  <label className='w-full font-bold text-center'>Visit the Vet</label>
                </div>

                <label className='text-[#515151] text-[16px] leading-tight text-justify'>Even if your cat looks healthy, vet care is essential for long-term well-being.</label>

                <div>
                  <label className='font-bold'>First vet visit should cover:</label>
                  <ul className='list-disc space-y-2 pl-6'>
                    <li className='text-[#515151] leading-tight'>Vaccinations and deworming.</li>
                    <li className='text-[#515151] leading-tight'>Flea/tick prevention.</li>
                    <li className='text-[#515151] leading-tight'>Blood tests for common feline illnesses (FIC, FeLV).</li>
                    <li className='text-[#515151] leading-tight'>Spaying/neutering (if not done yet).</li>
                    <li className='text-[#515151] leading-tight'>Microchipping for ID and Safety.</li>
                  </ul>
                </div>

                <div className='flex flex-col leading-tight'>
                  <label className='font-bold'>Why it matters:</label>
                  <label className='text-[#515151]'>Regular check-ups, booster shots, and prevetatives will keep your cat safe and healthy.</label>
                </div>
              </div>

              <div className='relative flex flex-col bg-[#FDF5D8] p-5 gap-5 rounded-[25px] shadow-md'>
                <label className='absolute flex items-center justify-center top-[-5%] left-[-10%] w-[50px] h-[50px] font-bold text-2xl bg-[#DC8801] text-[#FFF] p-3 rounded-[50%]'> 5 </label>

                <div className='flex flex-row items-center gap-3 w-100%'>
                  <div className='h-auto w-[80px] p-4 object-contain flex items-center justify-center bg-[#B5C04A] rounded-[25%]'>
                    <img src="src/assets/icons/CatCareGuides/injury.png" alt="cat litter box" className='max-w-full max-h-full object-contain'/>
                  </div>
                  <label className='w-full font-bold text-center'>Understand Cat Behavior</label>
                </div>

                <label className='text-[#515151] text-[16px] leading-tight text-justify'>Stray cats often carry trauma or fear from life outdoors. Trust takes time.</label>

                <div>
                  <label className='font-bold'>How to build a bond:</label>
                  <ul className='list-disc space-y-2 pl-6'>
                    <li className='text-[#515151] leading-tight'>Speak in a calm voice and avoid sudden movements.</li>
                    <li className='text-[#515151] leading-tight'>Let them come to you on their own terms.</li>
                    <li className='text-[#515151] leading-tight'>Use treats and play to create positive experiences.</li>
                    <li className='text-[#515151] leading-tight'>Respect their need for space-don't force interaction.</li>
                  </ul>
                </div>

                <div className='flex flex-col leading-tight'>
                  <label className='font-bold'>Watch for body language:</label>
                  <label className='text-[#515151]'>A slow blink is a sign of trust or a flicking tail might mean "not now."</label>
                </div>
              </div>

              <div className='relative flex flex-col bg-[#FDF5D8] p-5 gap-5 rounded-[25px] shadow-md'>
                <label className='absolute flex items-center justify-center top-[-5%] left-[-10%] w-[50px] h-[50px] font-bold text-2xl bg-[#DC8801] text-[#FFF] p-3 rounded-[50%]'> 5 </label>

                <div className='flex flex-row items-center gap-3 w-100%'>
                  <div className='h-auto w-[80px] p-4 object-contain flex items-center justify-center bg-[#B5C04A] rounded-[25%]'>
                    <img src="src/assets/icons/CatCareGuides/paw.png" alt="cat litter box" className='max-w-full max-h-full object-contain'/>
                  </div>
                  <label className='w-full font-bold text-center'>Make indoor Life Fun</label>
                </div>

                <label className='text-[#515151] text-[16px] leading-tight text-justify'>Life indoors doesn't have to be boring! Keep your cat mentally and physically engaged.</label>

                <div>
                  <label className='font-bold'>Ways to enrich their space:</label>
                  <ul className='list-disc space-y-2 pl-6'>
                    <li className='text-[#515151] leading-tight'>Provide scratching posts, cat trees, and climbing shelves.</li>
                    <li className='text-[#515151] leading-tight'>Offer toys like feather wands, balls, and puzzle feeders.</li>
                    <li className='text-[#515151] leading-tight'>Play with them daily for atleast 10-15 minutes.</li>
                  </ul>
                </div>

                <div className='flex flex-col leading-tight'>
                  <label className='font-bold'>Watch for body language:</label>
                  <label className='text-[#515151]'>A slow blink is a sign of trust or a flicking tail might mean "not now."</label>
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

export default CatCareGuides