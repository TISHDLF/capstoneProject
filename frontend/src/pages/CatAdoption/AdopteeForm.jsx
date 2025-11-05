import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom';
import NavigationBar from '../../components/NavigationBar';
import Footer from '../../components/Footer';
import SideNavigation from '../../components/SideNavigation';
import CatBot from '../../components/CatBot';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';


const AdopteeForm = () => {
    
    const [imageSrc, setImageSrc] = useState('/src/assets/icons/id-card.png');
    const [foundOut, setFoundOut] = useState('');
    const [catRaised, setCatRaised] = useState('');
    const [havePets, setHavePets] = useState('');
    const [livingSituation, setLivingSituation] = useState('');
    const [income, setIncome] = useState('');
    const [pickup, setPickup] = useState('');
    const [moreInfo, setMoreInfo] = useState('');
    const [error, setError] = useState('');
    
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
        if (file.size > 10 * 1024 * 1024) { // 10MB limit in bytes
            alert('File size exceeds 10MB limit. Please upload an image of 10MB or smaller.');
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            setImageSrc(reader.result);
        };
        reader.readAsDataURL(file);
        }
    };

    const printRef = React.useRef(null);
    const generateAdoptionForm = async () => {
        // if (
        //     !foundOut ||
        //     !imageSrc ||
        //     !catRaised ||
        //     !havePets.trim() ||
        //     !livingSituation ||
        //     !income ||
        //     !pickup
        // ) {
        //     setError('*Please complete all questions before submitting the form.');
        //     return;
        // }

        const element = printRef.current;
        if(!element)  {return};

        const canvas = await html2canvas(element)

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: 'a4'
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight()

        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pageWidth;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('Adoption_form.pdf');
    }


    



    return (
        <div className='flex flex-col min-h-screen pb-10'>
            <CatBot />
            <NavigationBar />

            <div className='grid grid-cols-[80%_20%] h-full'>
                <div className='flex flex-col pl-50 p-10' >
                    <div className='relative grid grid-cols-[20%_80%] rounded-[25px] gap-2 pb-2'>
                        <div className='flex flex-col gap-10'>
                            <div className='flex flex-row justify-between items-center p-3 bg-[#FFF] rounded-[15px] shadow-md'>
                                <label className='font-bold text-[#DC8801]'>Adoptee Form</label>
                                <div className='flex items-center justify-center w-[30px] h-auto'> 
                                    <img src="/src/assets/icons/clipboard-white.png" alt="white clipboard" className='w-full h-auto '/>
                                </div>
                            </div>

                            <div className='flex flex-row justify-between items-center p-3 border-dashed border-2 border-[#DC8801] rounded-[15px] shadow-md'>
                                <label className='text-[#DC8801]'>Please answer the following questions to submit an adoption request to be reviewed by our Head Volunteers!</label>
                            </div>
                        </div>

                        <form ref={printRef} className='flex flex-col items-start w-full p-5 gap-5 bg-[#FFF] rounded-[15px]' > 
                            <div className='flex flex-row gap-2 w-full justify-between'>
                                <div className='flex gap-2'>
                                    <label htmlFor="">1. You will be adopting:</label>
                                    <label className='font-bold pl-4'>Cat Name </label>
                                    <label className='italic'>6 Years old, </label>
                                    <label className='italic'>Male, </label>
                                    <label className='italic'>Neutered </label>
                                </div>
                            </div>

                            <div className='flex flex-col gap-2 w-full'>
                                <label>2. Please let us know how you found out about the adoption opportunity:</label>
                                <div className='grid grid-cols-3 w-full gap-2'>
                                    <label htmlFor="radioFBPage" className='flex items-center gap-2 p-2 border-1 border-[#252525] rounded-[8px]'>
                                        <input type="radio" id="radioFBPage" name="adaptionOpportunity" value="SPR Cats Facebook Page" onChange={(e) => setFoundOut(e.target.value)}/>
                                        SPR Cats Facebook Page
                                    </label>
                                    <label htmlFor="radioFBGroup" className='flex items-center gap-2 p-2 border-1 border-[#252525] rounded-[8px]'>
                                        <input type="radio" id="radioFBGroup" name='adaptionOpportunity' value="Facebook Group" onChange={(e) => setFoundOut(e.target.value)}/>
                                        Facebook Group
                                    </label>
                                    <label htmlFor="radioCommunityPage" className='flex items-center gap-2 p-2 border-1 border-[#252525] rounded-[8px]'>
                                        <input type="radio" id="radioCommunityPage" name="adaptionOpportunity" value="SPR Community Page" onChange={(e) => setFoundOut(e.target.value)}/>
                                        SPR Community Page
                                    </label>
                                    <label htmlFor="referral" className='flex items-center gap-2 p-2 border-1 border-[#252525] rounded-[8px]'>
                                        <input type="radio" id="referral" name='adaptionOpportunity' value="Referred by a Volunteer" onChange={(e) => setFoundOut(e.target.value)}/>
                                        Referred by a Volunteer
                                    </label>
                                    <label htmlFor="other" className='flex gap-2 p-2 border-1 border-[#252525] rounded-[8px]'>
                                        <input type="radio" name="adaptionOpportunity" id="other" className='bg-[#e6e6e6] rounded-[5px]' onChange={(e) => setFoundOut(e.target.value)}/>
                                        Others
                                    </label>
                                </div>
                            </div>

                            <div className='flex flex-col gap-2'>
                                <div className='flex flex-col'>
                                    <label>3. Kindly attach an ID to verify your identity - we do our best to make sure our cats are adopted by verified people so that they are assured a safe home. Thank you for understanding.</label>
                                    <label className='italic text-[14px] text-[#828282]'>(You may opt to blur sensitive data like Social Security info and etc.)</label>
                                </div>
                                <div className='flex flex-row items-center gap-2'>
                                    <div className={'flex items-center justify-center w-[400px] min-h-[200px] border-dashed border-2 border-[#898989] p-2 object-cover rounded-[15px]'}>
                                        <img src={imageSrc} alt="id-card" className='w-full h-full'/>
                                    </div>
                                    <div className='flex flex-col w-auto'>
                                        <label htmlFor="idUpload" className='bg-[#DC8801] p-2 rounded-[10px] text-[#FFF]'>
                                            Attach ID Photo
                                            <input type="file" accept="image/*" id='idUpload' hidden onChange={handleImageChange} required/>
                                        </label>

                                        <label className='italic text-[#828282] text-[14px]'>
                                            (Upload 1 supported file. Max. 10MB)
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className='flex flex-col gap-2'> 
                                <label>4. Have you raised a cat before?</label>
                                <div className='flex gap-2'>
                                    <label htmlFor="raisedYes" className='flex items-center gap-2 p-2 border-1 border-[#252525] rounded-[8px]'>
                                        <input type="radio" name="raisedCat" id="raisedYes" value="Yes, I know how to take care of a pet cat." onChange={(e) => setCatRaised(e.target.value)}/>
                                        Yes, I know how to take care of a pet cat.
                                    </label>
                                    <label htmlFor="raisedNo" className='flex items-center gap-2 p-2 border-1 border-[#252525] rounded-[8px]'> 
                                        <input type="radio" name="raisedCat" id="raisedNo" value="No, this is my first time." onChange={(e) => setCatRaised(e.target.value)}/>
                                        No, this is my first time.
                                    </label>
                                </div>
                            </div>

                            <div className='flex flex-col gap-3'>
                                <div className='flex flex-col'>
                                    <label>5. Do you have other pets right now? kindly provide information: </label>
                                    <label className='italic text-[14px] text-[#7d7d7d]'>(Eg. "Yes, I have two dogs.")</label>
                                </div>

                                <input type="text" placeholder='Your answer here' className='flex items-center p-2 border-1 border-[#A3A3A3] rounded-[8px]' onChange={(e) => setHavePets(e.target.value)}/>
                            </div>

                            <div className='flex flex-col gap-2 w-full'>
                                <label>6. What is your current living situation?</label>
                               <div className='flex gap-2 w-full'>
                                    <label htmlFor="alone" className='flex items-center gap-2 p-2 border-1 border-[#252525] rounded-[8px]'>
                                        <input type="radio" name="currentSituation" id="alone" value="I live alone" onChange={(e) => setLivingSituation(e.target.value)}/>
                                        I live alone
                                    </label>
                                    <label htmlFor="family" className='flex items-center gap-2 p-2 border-1 border-[#252525] rounded-[8px]'>
                                        <input type="radio" name="currentSituation" id="family" value="I live with my family (no childred)." onChange={(e) => setLivingSituation(e.target.value)}/>
                                        I live with my family (no childred).
                                    </label>
                                    <label htmlFor="nochildren" className='flex items-center gap-2 p-2 border-1 border-[#252525] rounded-[8px]'>
                                        <input type="radio" name="currentSituation" id="nochildren" value="I live with my family (with one or more children)." onChange={(e) => setLivingSituation(e.target.value)}/>
                                        I live with my family (with one or more children).
                                    </label>
                               </div>
                            </div>

                            <div className='flex flex-col gap-2'>
                                <div className='flex flex-col '> 
                                    <label htmlFor="">7. Do you have a regular income?</label>
                                    <label className='italic text-[14px] leading-tight text-[#898989]'>(Raising indoor cats involves costs for essentials like food, litter, vitamins, vaccinations, and other necessities. SPR cats are trained to be indoor-only pets (owners are advised to keep them indoors for safety) and are litter box-trained before being made available for adoption.)</label>
                                </div>
                                <div className='flex flex-row gap-2'> 
                                    <label htmlFor="answerYes" className='flex items-center gap-2 p-2 border-1 border-[#252525] rounded-[8px]'>
                                        <input type="radio" name="yesNo" id="answerYes" value="Yes"
                                        onChange={(e) => setIncome(e.target.value)}/>
                                        Yes
                                    </label>
                                    <label htmlFor="answerNo" className='flex items-center gap-2 p-2 border-1 border-[#252525] rounded-[8px]'>
                                        <input type="radio" name="yesNo" id="answerNo" value="No" onChange={(e) => setIncome(e.target.value)}/>
                                        No
                                    </label>
                                </div>
                            </div>

                            <div className='flex flex-col gap-2 w-full'>
                                <label>8. Are you available to pick up the cat from Siena Park Residences in Bicutan, or would you prefer to meet halfway?</label>
                               <div className='flex w-full gap-2'> 
                                    <label htmlFor="yesPickUp" className='flex items-center gap-2 p-2 border-1 border-[#252525] rounded-[8px]'>
                                        <input type="radio" name="pickup" id="yesPickUp" value="Yes, I'm able to do a pick-up." onChange={(e) => setPickup(e.target.value)}/>
                                    Yes, I'm able to do a pick-up.
                                    </label>
                                    <label htmlFor="YesMeeting" className='flex items-center gap-2 p-2 border-1 border-[#252525] rounded-[8px]'>
                                        <input type="radio" name="pickup" id="YesMeeting" value="Yes, we can arrange a halfway meeting." onChange={(e) => setPickup(e.target.value)}/>
                                        Yes, we can arrange a halfway meeting.
                                    </label>
                               </div>
                            </div>

                            <div className='flex flex-col gap-2'>
                                <label htmlFor="">9. Please share any additional information in order for us to know you better, we'd love to know more about you.</label>
                                <textarea rows="5" placeholder='You answer here' value={moreInfo} onChange={(e) => setMoreInfo(e.target.value)}
                                className='p-2 border-1 border-[#A3A3A3] rounded-[8px] resize-none'>
                                    
                                </textarea>
                            </div>
                        </form>
                    </div>
                        <label className='self-end font-[14px] italic text-[#DC8801]'>{error}</label>
                        <button type='button' onClick={generateAdoptionForm} className='self-end cursor-pointer w-fit text-center bg-[#B5C04A] text-[#FFF] font-bold p-2 pl-5 pr-5 rounded-[15px] hover:bg-[#CFDA34] active:bg-[#B5C04A]'>
                            Submit
                        </button>
                </div>
                <SideNavigation />
            </div>
            <Footer />
        </div>
    )
}

export default AdopteeForm