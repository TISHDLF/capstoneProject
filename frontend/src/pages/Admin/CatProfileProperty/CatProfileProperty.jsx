import React, {useState, useEffect} from 'react'
import AdminSideBar from '../../../components/AdminSideBar'
import { Link, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';


const CatProfileProperty = () => {

    const location = useLocation();
    const [catprofile, setCatprofile] = useState({
        cat_id: '',
        name: '',
        gender: 'Male',
        age: '',
        adoption_status: 'Available',
        sterilization_status: 'Intact',
        description: '',
        date_created: '',
        date_updated: ''
    });

    const [originalCatprofile, setOriginalCatprofile] = useState(null);

    const { cat_id } = useParams();

    const [catImage, setCatImage] = useState([]);
    const [catImagePreview, setCatImagePreview] = useState([]);
    const [uploaderVisible, setUploaderVisible] = useState(false);
    
    // Fetch data of cat profile and display
    useEffect(() => {
        if (!cat_id) return;

        const fetchProfile = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/catprofile/${cat_id}`);
                console.log(response.data.date_created)
                setCatprofile(response.data)
                setOriginalCatprofile(response.data)

            } catch(err) {
                console.error('Error fetching cat:', err);
            }
        }
        fetchProfile()
        
    }, [cat_id]); 

    // Update data 
    const handleCatProfileUpdate = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.patch(`http://localhost:5000/cat/update/${cat_id}`, {
                name: catprofile.name,
                gender: catprofile.gender,
                age: catprofile.age,
                adoption_status: catprofile.adoption_status,
                sterilization_status: catprofile.sterilization_status,
                description: catprofile.description
            });

            console.log('Update success:', response.data);

            console.log('Sending:', {
                name: catprofile.name,
                gender: catprofile.gender,
                age: catprofile.age,
                adoption_status: catprofile.adoption_status,
                sterilization_status: catprofile.sterilization_status,
                description: catprofile.description
            });

        } catch(err) {
            console.error('Update failed:', err.response?.data || err.message);
        }
    }

    const isProfileModified = () => {
        return JSON.stringify(catprofile) !== JSON.stringify(originalCatprofile);
    };


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                alert('Only image files are allowed.');
                return;
            }

            const reader = new FileReader();
            reader.onload = () => {
                setCatImagePreview(prevImages => [...prevImages, reader.result]);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDeleteImage = (indexToDelete) => {
        setCatImagePreview(prevImages => prevImages.filter((_, index) => index !== indexToDelete));
    };

    const handleImageUploaderWindow = () => {
        setUploaderVisible(!uploaderVisible)
    }

    const handleUploadImages = async (cat_id) => {
        try {
            const response = await axios.post(`http://localhost:5000/catimage/${cat_id}`, {
                cat_id: cat_id,
                images: catImagePreview,
            })

            if (response.status === 200) {
                console.log('Image uploaded successfully!');
                setCatImage([])
                setUploaderVisible(false);   // Close uploader
                await fetchCatImage();
            }

            setUploaderVisible(false)
        } catch (error) {
            console.error('Image upload failed:', error.response?.data || error.message);
        }
    }

    // Fetching Image data of the CAT
    const fetchCatImage = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/image/${cat_id}`);
                
                const imagesWithPrefix = response.data.map(base64Str =>
                    `data:image/jpeg;base64,${base64Str}`
                );
                setCatImage(imagesWithPrefix)

            } catch(err) {
                console.error('Error fetching cat Image:', err);
            }
        }
        fetchCatImage()

    
    useEffect(() => {
        if (!cat_id) return;
        fetchCatImage(); 
    }, [cat_id]); 



    return (
        <div className='relative flex flex-col h-screen'>
            <div className='grid grid-cols-[20%_80%] overflow-x-hidden'>
                <AdminSideBar /> 

                <div className='relative flex flex-col items-center p-10 min-h-screen gap-3 overflow-y-scroll'>
                    <div className='flex w-full items-center justify-between'>
                        <label className='text-[26px] font-bold text-[#2F2F2F] pl-2'> CAT PROFILE </label>

                        <Link to="/catprofilecreate" className='flex flex-row items-center justify-center gap-3 p-3 pl-6 pr-6 bg-[#B5C04A] text-[#FFF] rounded-[15px] hover:bg-[#CFDA34] active:bg-[#B5C04A]'>Create New</Link>
                    </div>

                    {catprofile && (
                        <form onSubmit={handleCatProfileUpdate} className='flex flex-col gap-4 w-full h-auto bg-[#FFF] p-7 rounded-[20px]'>
                            {/* MAIN CONTENT OF CAT PROPERTY */}
                            <div className='flex flex-row justify-end gap-6 pb-2'>
                                <div className='flex items-center gap-2'> 
                                    <label className='text-[14px]'>Date created:</label>
                                    <label className='text-[14px] font-bold'>{catprofile.date_created}</label>
                                </div>
                                <div className='flex items-center gap-2'> 
                                    <label className='text-[14px]'>Date updated:</label>
                                    <label className='text-[14px] font-bold'>{!catprofile.date_updated ? 'No updates' : catprofile.date_updated}</label>
                                </div>
                            </div>
                            <div className='flex flex-row justify-between pb-2 border-b-1 border-b-[#CFCFCF]'>
                                <div className='flex flex-col'>
                                    <label className='text-[16px] text-[#595959]'>Name</label>
                                    {/* <label className='font-bold text-[#2F2F2F] text-[20px]'>{catprofile.name}</label> */}
                                    <input type="text" placeholder='Add name' className='font-bold text-[#2F2F2F] text-[20px] p-2 text-[#2F2F2F] rounded-[10px] border-2 border-[#CFCFCF]'
                                    value={catprofile?.name || ''}
                                    onChange={(e) => setCatprofile(prev => ({...prev, name: e.target.value}))}/>
                                </div>
                                <div className='flex flex-col items-end'>
                                    <label className='text-[16px] text-[#595959]'>Cat ID</label>
                                    <label className='font-bold text-[#2F2F2F] text-[20px]'>{catprofile.cat_id}</label>
                                </div>
                            </div>

                            {/* Age/Gender/Sterilization Status/Adoption Status */}
                            <div className='flex flex-row justify-between gap-3 w-full '>
                                <div className='flex flex-col gap-1 w-full'>
                                    <label className='text-[16px] text-[#595959]'>Age</label>
                                    <input type="number" placeholder='Input Age here'
                                    value={catprofile?.age || ''}
                                    onChange={(e) => setCatprofile(prev => ({...prev, age: e.target.value}))} 
                                    className='appearance-none p-2 text-[#2F2F2F] rounded-[10px] border-2 border-[#CFCFCF] font-bold'/>
                                </div>
                                <div className='flex flex-col gap-1 w-full'>
                                    <label className='text-[16px] text-[#595959]'>Gender</label>
                                    <select value={catprofile?.gender || ''}
                                    onChange={(e) => setCatprofile((prev) => ({...prev, gender: e.target.value}))}
                                    className='p-[10px] text-[#2F2F2F] rounded-[10px] border-2 border-[#CFCFCF] font-bold text-[#2F2F2F]'>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                                <div className='flex flex-col gap-1 w-full'>
                                    <label className='text-[16px] text-[#595959]'>Sterilization Status</label>
                                    <select value={catprofile?.sterilization_status || ''} 
                                    onChange={(e) => setCatprofile((prev) => ({...prev, sterilization_status: e.target.value}))}
                                    className='p-[10px] text-[#2F2F2F] rounded-[10px] border-2 border-[#CFCFCF] font-bold text-[#2F2F2F]'>
                                        <option value="Intact">Intact</option>
                                        <option value="Neutered">Neutered</option>
                                        <option value="Spayed">Spayed</option>
                                    </select>
                                </div>

                                <div className='flex flex-col gap-1 w-full'>
                                    <label className='text-[16px] text-[#595959]'>Adoption Status</label>
                                    <select  value={catprofile?.adoption_status || ''} 
                                    onChange={(e) => setCatprofile((prev) => ({...prev, adoption_status: e.target.value}))}
                                    className='p-[10px] text-[#2F2F2F] rounded-[10px] border-2 border-[#CFCFCF] font-bold text-[#2F2F2F]'>
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
                            <div className={uploaderVisible ? 'hidden' : 'flex flex-col'}>
                                <div className='flex items-center justify-between pb-2'>
                                    <label className='text-[#595959]'>Image/s</label>
                                    <div className='flex gap-2 items-center'>
                                    
                                        <button type='button' onClick={handleImageUploaderWindow}
                                        className={!uploaderVisible ? 'p-2 pl-6 pr-6 w-auto h-auto bg-[#2F2F2F] text-[#FFF] rounded-[15px] cursor-pointer hover:bg-[#595959] active:bg-[#2F2F2F]' : 'hidden' }>
                                            Add Image
                                        </button>
                                    </div>
                                </div>
                                <div className='grid grid-cols-5 gap-2 w-full'>
                                    {catImage.map((image, index) => (
                                        
                                        <div key={index} className='relative flex items-center bg-[#595959] max-w-[250px] h-[250px] rounded-[10px] overflow-hidden'>
                                            <button type='button' onClick={() => handleDeleteImage(index)} className='absolute top-2 right-2 p-1 pl-4 pr-4 bg-[#FFF] text-[#2F2F2F] font-bold rounded-[10px] cursor-pointer active:bg-[#CFCFCF]'>Delete</button>
                                            <img src={image} alt={`uploaded-${index}`} className="w-full h-full object-cover"/> 
                                        </div>
                                        
                                    ))}
                                </div>
                            </div>

                            {uploaderVisible && (
                                <>
                                    <div className='flex flex-col w-full gap-2 p-5 rounded-[10px] border-1 border-[#a3a3a3] bg-[#FDF5D8]'>
                                        <div className='flex w-full gap-2 justify-between border-b-1 border-b-[#595959] pb-2'>
                                            <div className='flex gap-4 items-center'>
                                                <label className='text-[18px] text-[#2F2F2F] font-bold'>UPLOAD NEW IMAGE</label>
                                                <label htmlFor="catImageUpload"
                                                className='p-2 pl-4 pr-4 w-auto h-auto bg-[#2F2F2F] text-[#FFF] rounded-[10px] cursor-pointer hover:bg-[#595959] active:bg-[#2F2F2F]'>
                                                    Add Image
                                                    <input type="file" accept='image/*' id="catImageUpload" onChange={handleImageChange} className='hidden'/>
                                                </label>
                                            </div>
                                            <button type='button' onClick={handleImageUploaderWindow}
                                            className='cursor-pointer p-2 pl-6 pr-6 hover:bg-[#CCCCCC] active:bg-[#FFF] rounded-[15px]'> 
                                                Close
                                            </button>
                                        </div>
                                        <div className='grid grid-cols-5 gap-2 w-full min-h-[200px]'>
                                            {catImagePreview.map((img, index) => (
                                                <div key={index} className='relative flex items-center bg-[#595959] max-w-[250px] h-[250px] rounded-[10px] overflow-hidden'>
                                                    <button type='button' onClick={() => handleDeleteImage(index)} className='absolute top-2 right-2 p-1 pl-4 pr-4 bg-[#FFF] text-[#2F2F2F] font-bold rounded-[10px] cursor-pointer active:bg-[#CFCFCF]'>Delete</button>
                                                    <img src={img} alt={`uploaded-${index}`} className="w-full h-full object-cover"/> 
                                                </div> 
                                            ))}
                                        </div>
                                        <div className='flex w-full gap-2 justify-end'>
                                            <div className='flex gap-2 items-center'>
                                                <button type='button' onClick={() => handleUploadImages(cat_id)} 
                                                className={ !catImagePreview[0] ? 'hidden' : 'p-2 pl-6 pr-6 w-auto h-auto bg-[#B5C04A] text-[#FFF] rounded-[15px] cursor-pointer hover:bg-[#CFDA34] active:bg-[#B5C04A]' }>
                                                    Save
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* CAT DESCRIPTION */}
                            <div className='flex flex-col'>
                                <label className='text-[#595959] font-bold'>Description</label>
                                <textarea name="" id="" rows={5} className='border-2 border-[#CFCFCF] resize-none rounded-[15px] p-2'
                                value={catprofile.description} 
                                onChange={(e) => setCatprofile((prev) => ({...prev, description: e.target.value}))}
                                placeholder='Describe the cat here'></textarea>
                            </div>

                            <div className='flex justify-end'>
                                <button type='submit' 
                                className={isProfileModified() ? 'p-2 pl-4 pr-4 bg-[#DC8801] text-[#FFF] font-bold w-auto rounded-[15px] hover:bg-[#FFB235] active:bg-[#DC8801]' : 'hidden'}>
                                Save Changes
                            </button>
                            </div>
                        </form>
                    )}
                </div>
                
            </div>
            
        </div>
    )
}

export default CatProfileProperty