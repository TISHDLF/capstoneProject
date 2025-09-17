import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios';

import NavigationBar from '../../components/NavigationBar';
import Footer from '../../components/Footer';
import SideNavigation from '../../components/SideNavigation';
import CatBot from '../../components/CatBot';


// TODO: Remove pending status > Change to only Available/Adopted


const CatProfile = () => {

    const [selectedImage, setSelectedImage] = useState('');
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);

    const [currentCatIndex, setCurrentCatIndex] = useState(0)
    
    const [catInfo, setCatInfo] = useState([]);
    const [catImage, setCatImage] = useState([]); 
    const { cat_id } = useParams();


    // Fetches Cat data then sends cat_id to URL
    useEffect(() => {
        const fetchCat = async () => {
            try {
                const response = await axios.get('http://localhost:5000/cat/list');
                const cats = response.data;

                setCatInfo(cats);

                // Find index of the cat matching the cat_id in the URL
                const index = cats.findIndex(cat => cat.cat_id.toString() === cat_id);

                // If cat found, use its index, otherwise default to 0
                setCurrentCatIndex(index !== -1 ? index : 0);
            } catch (err) {
                console.error('Error fetching cat profiles:', err);
            }
        };
        fetchCat();
    }, [cat_id]);



    useEffect(() => {
        const fetchCatImage = async () => {
            if (!catInfo[currentCatIndex]) return;

            try {
            const catId = catInfo[currentCatIndex].cat_id;
            const response = await axios.get(`http://localhost:5000/cat/image/${catId}`);
            const imageUrls = response.data.map(filename => ({
                filename: filename,
                url: `http://localhost:5000/FileUploads/${filename}`
            }));

            setCatImage(imageUrls);
            setSelectedImage(imageUrls[0]?.url || '');
            setSelectedImageIndex(0);
            } catch (err) {
            console.error('Error fetching cat images:', err);
            }
        };

        fetchCatImage();
    }, [currentCatIndex, catInfo]);


    const currentCat = catInfo[currentCatIndex];

    const handlePreviousCat = () => {
        setCurrentCatIndex((prev) => (prev - 1 + catInfo.length) % catInfo.length);
    };

    const handleNextCat = () => {
        setCurrentCatIndex((prev) => (prev + 1) % catInfo.length);
    };


    const handleImageClick = (index) => {
        setSelectedImageIndex(index);
        setSelectedImage(catImage[index].url); 
    };


  return (
    <div className='flex flex-col min-h-screen pb-10'>
        <CatBot />
        <NavigationBar />

        <div className='grid grid-cols-[80%_20%] h-full'>
            <div className='relative flex flex-col pl-50 p-8'>
                <div className='relative flex flex-row items-center gap-2'>
                    <button onClick={handlePreviousCat} className='flex items-center justify-center bg-[#B5C04A] w-[50px] h-[50px] p-2 rounded-[50%]  hover:bg-[#CFDA34] active:bg-[#B5C04A]'>
                        <img src="/src/assets/icons/arrow-left-no-tail.png" alt="arrow left" className='w-auto h-full' />
                    </button>

                    <div className='relative grid grid-cols-[60%_40%] w-[1000px] h-auto bg-[#FFF] p-5 rounded-[25px] shadow-md'>
                        <div className='flex flex-col w-auto p-4 gap-4 rounded-[20px] box-content overflow-hidden'>
                            <div className='flex flex-col items-center h-[450px] w-full rounded-[16px] overflow-hidden'>
                                {selectedImage ? (
                                    <img src={selectedImage} alt="cat image" className='w-full h-full object-cover'/>
                                ) : (
                                    <div className='w-full h-full flex items-center justify-center text-gray-400'>
                                    No image available
                                    </div>
                                )}
                            </div>
                            <div className='grid grid-cols-5 object-cover pl-1 overflow-hidden gap-2 overflow-x-auto'>
                                {catImage.map((imageURL, index) => {
                                    const isSelected = index === selectedImageIndex;
                                    return (
                                        <div key={index}
                                            className={`w-[100px] h-[100px] overflow-hidden object-fill rounded-[10px] ${
                                                isSelected ? 'opacity-100' : 'opacity-40'
                                            } hover:opacity-100 active:opacity-40`}>
                                            <img
                                                src={imageURL.url}
                                                alt={`cat image ${index}`}
                                                className='w-full h-full object-cover'
                                                onClick={() => handleImageClick(index)}
                                            />
                                        </div>
                                    );
                                })}


                            </div>
                        </div>

                        {currentCat && (
                            <div className='flex flex-col justify-between items-start p-5 w-full'>
                                <div className='flex flex-col gap-2 items-start w-full'>
                                    <div className='flex flex-row items-center w-full gap-2 pb-2 border-b-2 border-b-[#DC8801]'>
                                        <div className='w-[30px] h-auto'>
                                            <img src="/src/assets/icons/paw-gray.png" alt="cat paw" />
                                        </div>
                                        <label className='font-bold text-[18px] text-[#DC8801]'>{currentCat.name}</label>
                                    </div>

                                    <div className='flex flex-col pt-3 pb-3 w-full'>
                                        <div className='flex flex-row items-center gap-1 border-b-1 border-b-[#B5C04A] pb-1 pt-1'>
                                            <div className='flex flex-col items-center justify-center h-[30px] w-[30px] bg-[#B5C04A] p-[5px] rounded-[50%]'>
                                                <img src="/src/assets/icons/genders.png" alt="gender" />
                                            </div>
                                            <div className='text-[14px]'>
                                                <label className='font-bold pr-2'>Gender:</label>
                                                <label>I am a <strong>{currentCat.gender}</strong></label>
                                            </div>  
                                        </div>
                                        <div className='flex flex-row items-center gap-1 border-b-1 border-b-[#B5C04A] pb-1 pt-1'>
                                            <div className='flex flex-col items-center justify-center h-[30px] w-[30px] bg-[#B5C04A] p-[5px] rounded-[50%]'>
                                                <img src="/src/assets/icons/hourglass-white.png" alt="gender" />
                                            </div>
                                            <div className='text-[14px]'>
                                                <label className='font-bold pr-2'>Age:</label>
                                                <label>{currentCat.age} years old</label>
                                            </div>  
                                        </div>
                                        <div className='flex flex-row items-center gap-1 border-b-1 border-b-[#B5C04A] pb-1 pt-1'>
                                            <div className='flex flex-col items-center justify-center h-[30px] w-[30px] bg-[#B5C04A] p-[5px] rounded-[50%]'>
                                                <img src="/src/assets/icons/status.png" alt="gender" />
                                            </div>
                                            <div className='text-[14px]'>
                                                <label className='font-bold pr-2x'>Sterilization Status:</label>
                                                <label> {currentCat.sterilization_status}</label>
                                            </div>  
                                        </div>
                                        
                                    </div>
                                    <div className='text-justify text-[#5f5f5f] leading-tight'>
                                        {/* Cat Description */} 
                                        {currentCat.description}
                                    </div>
                                </div>

                                <div className='flex flex-col w-full gap-2'>
                                    <Link to={`/adopteeform/${currentCat.cat_id}`} className='bg-[#B5C04A] text-[#FFF] font-bold p-3 rounded-[15px] w-full text-center hover:bg-[#CFDA34] active:bg-[#B5C04A]'>
                                        I want to adopt this cat
                                    </Link>
                                    <Link to="/catadoption" className='border-[#B5C04A] border-2 text-[#B5C04A] font-bold p-3 rounded-[15px] w-full text-center hover:bg-[#B5C04A] hover:text-[#FFF] active:bg-[#CFDA34] active:border-[#CFDA34]'>
                                        See other Cats
                                    </Link>
                                </div>
                            </div>
                        )}

                    </div>

                    <button onClick={handleNextCat} className='flex items-center justify-center bg-[#B5C04A] w-[50px] h-[50px] rounded-[50%] p-2 hover:bg-[#CFDA34] active:bg-[#B5C04A]'>
                        <img src="/src/assets/icons/arrow-right-no-tail.png" alt="arrow right" className='w-auto h-full' />
                    </button>
                </div>
            </div>
            <SideNavigation />
        </div>
        <Footer />
    </div>
  )
}

export default CatProfile