import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'


import NavigationBar from '../components/NavigationBar'
import SideNavigation from '../components/SideNavigation'
import Footer from '../components/Footer'
import CatBot from '../components/CatBot'

const CatAdoption = () => {

  const [catList, setCatList] = useState([]);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/cat/catlist`);

        const formattedCats = response.data.map(cat => ({
          ...cat,
          thumbnail: cat.thumbnail
            ? `http://localhost:5000/FileUploads/${cat.thumbnail}`
            : null
        }));

        setCatList(formattedCats);
      } catch(err) {
        console.error('Error fetching cat:', err);
      }
    };
    fetchCats();
  }, []);

  return (
    <div className='flex flex-col min-h-screen'>
      <CatBot />
      <NavigationBar />

      <div className='grid grid-cols-[80%_20%] h-full p-10'>
        <div className='flex flex-col pl-50 p-10'>
          {/* ALL CONTENTS HERE */}
          <div className='grid grid-cols-3 h-auto place-items-center gap-5'> 

          {catList.map((cat) => (
              <div key={cat.cat_id} 
              className='w-[350px] grid grid-rows-[auto_auto] justify-center overflow-hidden rounded-[25px] border-2 border-white bg-white shadow-lg hover:border-[#B5C04A]'>
                <div className='h-[250px] overflow-hidden rounded-t-[25px] w-[350px]'>
                  <img 
                  src={cat.thumbnail} 
                  alt={`cat image ${cat.cat_id}`} 
                  className='overflow-hidden w-full h-full object-cover'/>
                </div>

                <div className='flex flex-col justify-center p-3'> 

                  <div className='flex flex-col gap-4'>
                    <div className='grid grid-rows-2'>
                      <label className='flex items-end gap-2 text-2xl font-bold text-[#DC8801]'>
                        <div className='w-[40px] h-auto'>
                          <img src="/src/assets/icons/paw-gray.png" alt="gray paw" />
                        </div>
                        {cat.name}
                      </label>

                      <div className='flex flex-row gap-3 border-dashed border-b-2 border-b-[#B5C04A]'>
                        <label className='flex flex-row items-center font-bold text-[12px] gap-[5px]'>
                          <div className='flex items-center justify-center w-[20px] h-auto'>
                            <img src="src/assets/icons/genders-black.png" alt="female sign" className='object-cover'/>
                          </div>
                          {cat.gender}
                        </label>
                        <label className='flex flex-row items-center font-bold text-[12px] gap-[5px]'>
                          <div className='flex items-center justify-center w-[15px] h-auto'>
                            <img src="src/assets/icons/hourglass.png" alt="hourglas" />
                          </div>
                          {cat.age} years old
                        </label>
                      </div>
                    </div>
                  
                    <p className='pl-2 text-[14px] text-[#555555] leading-tight text-justify break-words break-all whitespace-normal'>
                      {cat.description.length > 50 ? cat.description.slice(0, 50) + '...' : cat.description}
                    </p>

                    <Link to={`/catprofile/${cat.cat_id}`} className='flex items-center justify-center gap-2 w-full ml-[25px] rounded-[10px] bg-[#B5C04A] p-2 hover:bg-[#CFDA34] active:bg-[#B5C04A]'>
                      <label className='font-bold text-[#FFF]'>More Info</label>
                      <div className='w-[30px] h-auto object-contain'>
                        <img src="src/assets/icons/right-arrow.png" alt="right arrow" />
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
          ))}

          </div>
        </div>
        <SideNavigation />
      </div>
      <Footer />
    </div>
  )
}

export default CatAdoption