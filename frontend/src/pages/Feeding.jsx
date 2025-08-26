import React from 'react'
import { Link } from 'react-router-dom'

const handleGoBack = () => {
  window.history.back();
}

const Feeding = () => {
  return (
    <div className='flex flex-col pt-8 pl-55 pb-20 min-h-screen w-auto'>
        <div className='relative grid grid-cols-[30%_70%] bg-[#FFF] w-[1000px] rounded-[25px]'>
          <div className='flex flex-col gap-10'>
              <Link onClick={handleGoBack} className='flex flex-rows items-center gap-3 bg-[#DC8801] rounded-[15px] p-3 w-[100px] hover:bg-[#ffa71a] active:bg-[#DC8801]'>
                  <div className='w-[25px] h-[25px]'>
                      <img src="src/assets/icons/arrow.png" alt="" className='w-full h-auto'/>
                  </div>
                  <label className='font-bold text-[#FFF]'>Back</label>
              </Link>

              <div className='flex flex-row justify-between items-center p-3 bg-[#FDF5D8] rounded-tr-[20px] rounded-br-[20px] shadow-md'>
                  <label className='font-bold text-[#DC8801]'>Feeders Form</label>
                  <div className='flex items-center justify-center w-[30px] h-auto'> 
                      <img src="src/assets/icons/clipboard-white.png" alt="white clipboard" className='w-full h-auto '/>
                  </div>
              </div>

              <div className='flex flex-row justify-between items-center p-3 bg-[#FDF5D8] rounded-tr-[20px] rounded-br-[20px] shadow-md'>
                  <label className='text-[#DC8801]'>Please answer the following questions to submit a request and become a part of the feeders team!</label>
              </div>
          </div>

          <form className='flex flex-col gap-8 p-5'>
            <div className='flex flex-col gap-2'>
              <label>1. Why are you interested in becoming a feeder for the Siera Park Residences Cat Community?</label>
              <textarea name="" id="" placeholder='Answer here' rows={5} className='p-2 border-1 border-[#252525] rounded-[8px] resize-none'></textarea>
            </div>

            <div className='flex flex-col gap-2'>
              <label>2. Do you have any prior experience with feeding or caring for stray cats or community animals?</label>
              <div className='flex flex-row gap-2'>
                <label htmlFor="feedingYes" className='flex items-center gap-2 p-2 border-1 border-[#252525] rounded-[8px]'>
                  <input type="radio" name="feedingExp" id="feedingYes" value="Yes"/>
                  Yes
                </label>
                <label htmlFor="feedingNo" className='flex items-center gap-2 p-2 border-1 border-[#252525] rounded-[8px]'>
                  <input type="radio" name="feedingExp" id="feedingNo" value="No"/>
                  No
                </label>
              </div>
              <label htmlFor="feedingDescribe">if <strong>Yes</strong>, please describe your experience to us.</label>
              <textarea name="" id="feedingDescribe" placeholder='Answer here' rows={5} className='p-2 border-1 border-[#252525] rounded-[8px] resize-none'></textarea>
            </div>

            <div className='flex flex-col gap-2'> 
              <label htmlFor="">3. Which day of the week can you commit to feeding the cats?</label>
              <div className='flex flex-row gap-2'>

                <select name="feedingDay" id="feedingDay" className='p-2 border-2 border-[#626262] rounded-[10px]'>
                  <option selected disabled hidden>Select a day</option>
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                  <option value="Sunday">Sunday</option>
                </select>

                <label className='text-[14px] text-[#626262] italic leading-tight'>(There's no guarantee that day you choose will be your feeding day due to other active feeders. Coordinate with the Head volunteers for this matter.)</label>
              </div>
            </div>

            <div className='flex flex-col gap-2'>
              <label>4. Feeding typically begins at 8:00 pm and may continue late into the evening. Are you comfortable with this schedule? </label>
              <div className='flex flex-row gap-2'>
                <label htmlFor="eveningYes" className='flex items-center gap-2 p-2 border-1 border-[#252525] rounded-[8px]'>
                  <input type="radio" name="feedingNight" id="eveningYes" value="Yes"/>
                  Yes
                </label>
                <label htmlFor="eveningNo" className='flex items-center gap-2 p-2 border-1 border-[#252525] rounded-[8px]'>
                  <input type="radio" name="feedingNight" id="eveningNo" value="No"/>
                  No
                </label>
              </div>
              <label htmlFor="nightFeedConcern">if <strong>No</strong>, please explain if you have any concerns.</label>
              <textarea name="" id="nightFeedConcern" placeholder='Answer here' rows={5} className='p-2 border-1 border-[#252525] rounded-[8px] resize-none'></textarea>
            </div>

            <button className='flex justify-center w-full text-center bg-[#B5C04A] text-[#FFF] font-bold p-2 rounded-[15px] hover:bg-[#CFDA34] active:bg-[#B5C04A]'>
              Submit
            </button>
          </form>
        </div>
    </div>
  )
}

export default Feeding