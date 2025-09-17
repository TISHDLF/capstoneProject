import React, { use } from 'react'

import NavigationBar from '../components/NavigationBar';
import Footer from '../components/Footer';
import SideNavigation from '../components/SideNavigation';
import CatBot from '../components/CatBot';

import { Link } from 'react-router-dom'
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import axios from 'axios';
import { useState } from 'react';
import Cookies from 'js-cookie';
import { useEffect } from 'react';


const Feeding = () => {

  const loggedUser = Cookies.get('user');
  const userParsed = JSON.parse(loggedUser);

  const [interestReason, setInterestReason] = useState('');
  const [experienceDetails, setExperienceDetails] = useState('');
  const [feedingDay, setFeedingDay] = useState('');
  const [concernReason, setConcernReason] = useState('');
  const [error, setError] = useState('');

  const [feedingExperience, setfeedingExperience] = useState(false);
  const [feedingSchedule, setFeedingSchedule] = useState(false)

  const [submitMessage, setSubmitMessage] = useState('');

  const handleExpSelected = (value) => setfeedingExperience(value);
  const handleSchedSelected = (value) => setFeedingSchedule(value);
  

  const printRef = React.useRef(null);


  
  const fetchUser = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/user/logged?user_id=${userParsed.user_id}`)
      console.log(response.data);

      return response.data
    } catch (err) {
      console.error('Failed to fetch user data: ', err);
    }
  }

  const generateFeedingForm = async  () => {
    if (
      !interestReason.trim() ||
      !feedingExperience ||
      (feedingExperience === 'Yes' && !experienceDetails.trim()) ||
      !feedingDay ||
      !feedingSchedule ||
      (feedingSchedule === 'No' && !concernReason.trim())
    ) {
      setError('*Please complete all questions before submitting the form.');
      return;
    }

    const element = printRef.current
    if (!element) { return };

    const canvas = await  html2canvas(element, {
      scale: 2,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: 'a4'
    })

    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pageWidth;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    
    const pdfBlob = pdf.output('blob');
    // pdf.save('feeding-form.pdf');

    const user = await fetchUser();

    const formData = new FormData();
    const filename = `feeding-form-${user.firstname}-${user.lastname}.pdf`;

    formData.append('file', pdfBlob, filename);
    formData.append('user_id', userParsed.user_id);

    try {
      await axios.post(`http://localhost:5000/user/feeding/form`, formData, {
        headers: {'Content-Type': 'multipart/form-data' },
      });

      setSubmitMessage('You successfully submitted your application!\nPlease wait for approval. Thank you!');

      console.log('You successfully submitted your application!\nPlease wait for approval. Thank you!');
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setError('You already have a pending application. Please wait for it to be processed.');
      } else {
        setError('Your submission failed. Please try again.');
      }

      console.error('Submission failed:', err);
    }
  }



  
  return (
    <div className='flex flex-col min-h-full pb-10'>
      <CatBot />
      <NavigationBar />

      <div className='grid grid-cols-[80%_20%] h-full'>
        <div className='flex flex-col pl-50 p-10'> 
          <div className='flex flex-col min-h-screen w-auto gap-3'>
            <div className='relative grid grid-cols-[20%_80%] w-full rounded-[25px] gap-3'>
              <div className='flex flex-col gap-5'>
                  <div className='flex flex-row justify-between items-center p-3 bg-[#FFF] rounded-[15px] shadow-md'>
                      <label className='font-bold text-[#DC8801]'>Feeders Form</label>
                      <div className='flex items-center justify-center w-[30px] h-auto'> 
                          <img src="src/assets/icons/clipboard-white.png" alt="white clipboard" className='w-full h-auto '/>
                      </div>
                  </div>
  
                  <div className='flex flex-row justify-between items-center p-3 border-dashed border-2 border-[#DC8801] rounded-[15px]'>
                      <label className='text-[#DC8801]'>Please answer the following questions to submit a request and become a part of the feeders team!</label>
                  </div>
              </div>
  
              {!submitMessage ? (
                <form ref={printRef} className='flex flex-col justify-center gap-8 p-5 bg-[#FFF] rounded-[15px] w-full h-fit'>
                  <div className='flex flex-col gap-2'>
                    <label>1. Why are you interested in becoming a feeder for the Siera Park Residences Cat Community?</label>
                    <textarea placeholder='Answer here' rows={5} value={interestReason} onChange={(e) => setInterestReason(e.target.value)}
                    className='p-2 border-1 border-[#252525] rounded-[8px] resize-none'></textarea>
                  </div>
    
                  <div className='flex flex-col gap-2'>
                    <label>2. Do you have any prior experience with feeding or caring for stray cats or community animals?</label>
                    <div className='flex flex-row gap-2'>
                      <label htmlFor="feedingYes" className='flex items-center gap-2 p-2 border-1 border-[#252525] rounded-[8px]'>
                        <input type="radio" name="feedingExp" id="feedingYes" value="Yes"
                        checked={feedingExperience === 'Yes'}
                        onChange={() => handleExpSelected('Yes')}/>
                        Yes
                      </label>
                      <label htmlFor="feedingNo" className='flex items-center gap-2 p-2 border-1 border-[#252525] rounded-[8px]'>
                        <input type="radio" name="feedingExp" id="feedingNo" value="No"
                        checked={feedingExperience === 'No'} onChange={() => handleExpSelected('No')}
                        />
                        No
                      </label>
                    </div>
                    {feedingExperience === 'Yes' && (
                      <div className={feedingExperience === 'No' ? 'hidden' : 'flex flex-col'}>
                        <label htmlFor="feedingDescribe">if <strong>Yes</strong>, please describe your experience to us.</label>
                  
                      <textarea name="" id="feedingDescribe" placeholder='Answer here' rows={5}
                      value={experienceDetails} onChange={(e) => setExperienceDetails(e.target.value)}
                      className={'p-2 border-1 border-[#252525] rounded-[8px] resize-none'}></textarea>
                      </div>
                    )}
                    
                  </div>
    
                  <div className='flex flex-col gap-2'> 
                    <label htmlFor="">3. Which day of the week can you commit to feeding the cats?</label>
                    <div className='flex flex-row gap-2'>
    
                      <select name="feedingDay" id="feedingDay" value={feedingDay} onChange={(e) => setFeedingDay(e.target.value)}
                      className='flex items-center justify-center border-1 border-[#A3A3A3] rounded-[10px]'>
                        <option hidden>Select a day</option>
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
    
                  <div className='flex flex-col gap-4'>
                    <label>4. Feeding typically begins at 8:00 pm and may continue late into the evening. Are you comfortable with this schedule? </label>
                    <div className='flex flex-row gap-2'>
                        <label htmlFor="eveningYes" className='flex items-center gap-2 p-2 border-1 border-[#252525] rounded-[8px]'>
                          <input type="radio" name="feedingNight" id="eveningYes" value="Yes"
                          checked={feedingSchedule === 'Yes'} onChange={() => handleSchedSelected('Yes')}/>
                          Yes
                        </label>
                        <label htmlFor="eveningNo" className='flex items-center gap-2 p-2 border-1 border-[#252525] rounded-[8px]'>
                          <input type="radio" name="feedingNight" id="eveningNo" value="No"
                          checked={feedingSchedule === 'No'} onChange={() => handleSchedSelected('No')}/>
                          No
                        </label>
                    </div>
                    <div className={feedingSchedule === 'No' ? 'flex flex-col' : 'hidden'}>
                      <label htmlFor="nightFeedConcern">if <strong>No</strong>, please explain if you have any concerns.</label>
                      <textarea  id="nightFeedConcern" placeholder='Answer here' rows={5} 
                      value={concernReason} onChange={(e) => setConcernReason(e.target.value)}
                      className='p-2 border-1 border-[#252525] rounded-[8px] resize-none'></textarea>
                    </div>
                  </div>
                  <label className='self-end font-[14px] italic text-[#DC8801]'>{error}</label>
                </form>
              ) : (
                <div className='flex items-center justify-center p-5 bg-[#FFF] rounded-[15px] w-full h-full'>
                  <label className='text-[#DC8801] text-center'>{submitMessage}</label>
                </div>
              )}
              
            </div>
                <button type='button' onClick={generateFeedingForm} className='self-end w-fit text-center bg-[#B5C04A] text-[#FFF] font-bold p-2 pl-4 pr-4 rounded-[15px] hover:bg-[#CFDA34] active:bg-[#B5C04A] cursor-pointer'>
                  Submit
                </button>
          </div>
        </div>
        <SideNavigation />
      </div>
      <Footer />
    </div>

  )
}

export default Feeding