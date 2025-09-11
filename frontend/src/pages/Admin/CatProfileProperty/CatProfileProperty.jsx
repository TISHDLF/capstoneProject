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


    // CHECKS FOR CHANGES ON THE DATA
    const isProfileModified = () => {
        return JSON.stringify(catprofile) !== JSON.stringify(originalCatprofile);
    };

    // HANDLES THE UPDATE OF DATA ONCE SAVE BUTTON CLICKED 
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

    

    // DISPLAYS AN IMAGE SELECTED
    // NOT YET UPLOADED TO DATABASE UNLESS SAVE BUTTON IS CLICKED
    const handleImageChange = (event) => {
        const files = Array.from(event.target.files);

        const newFiles = files.map((file) => ({
            file,
            preview: URL.createObjectURL(file)
        }));

        setCatImagePreview((prev) => [...prev, ...newFiles])
    }


    const handleImageUploaderWindow = () => {
        if (uploaderVisible) {
            // Closing the uploader — clear preview images
            setCatImagePreview([]);
        }
        setUploaderVisible(!uploaderVisible);
    }


    const handleUploadImages = async (cat_id) => {
        try {
            const formData = new FormData();

            catImagePreview.forEach(({file}) => {
                formData.append('images', file);
            });

            const response = await axios.post(
                `http://localhost:5000/upload/catimages/${cat_id}`,
                formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                }
            );

            if (response.status === 200) {
                console.log('Image uploaded successfully!')
                setCatImagePreview([])
                setUploaderVisible(false);  
                await fetchCatImage();
            } 
        } catch(err) {
            console.error('Image upload failed: ', err.response?.data || err.message);
        }
    }

    // Fetching Image data of the CAT
    const fetchCatImage = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/image/${cat_id}`);

            const imageUrls = response.data.map(filename => ({
                filename: filename,
                url: `http://localhost:5000/FileUploads/${filename}`
            }));

            setCatImage(imageUrls);
        } catch(err) {
            console.error('Error fetching cat Image:', err);
        }
    }

    const handleDeleteImage = async (filename) => {
    try {
        await axios.delete(`http://localhost:5000/image/${filename}`);
            console.log(`Deleted image: ${filename}`);
            fetchCatImage(); // Refresh the image list

        } catch (err) {
            console.error('Failed to delete image:', err);
        }
    };

    

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
                                    <label className='text-[14px] font-bold'>{(catprofile.date_created == catprofile.date_updated) ? 'No updates' : catprofile.updated_at  }</label>
                                </div>
                            </div>
                            <div className='flex flex-row justify-between pb-2 border-b-1 border-b-[#CFCFCF]'>
                                <div className='flex flex-col'>
                                    <label className='text-[16px] text-[#595959]'>Name</label>
                                    {/* <label className='font-bold text-[#2F2F2F] text-[20px]'>{catprofile.name}</label> */}
                                    <input type="text" placeholder='Add name' className='font-bold text-[#2F2F2F] text-[20px] p-2 text-[#2F2F2F] rounded-[10px] border-2 border-[#CFCFCF]'
                                    value={catprofile.name || ''}
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
                                    value={catprofile.age || ''}
                                    onChange={(e) => setCatprofile(prev => ({...prev, age: e.target.value}))} 
                                    className='appearance-none p-2 text-[#2F2F2F] rounded-[10px] border-2 border-[#CFCFCF] font-bold'/>
                                </div>
                                <div className='flex flex-col gap-1 w-full'>
                                    <label className='text-[16px] text-[#595959]'>Gender</label>
                                    <select value={catprofile.gender || ''}
                                    onChange={(e) => setCatprofile((prev) => ({...prev, gender: e.target.value}))}
                                    className='p-[10px] text-[#2F2F2F] rounded-[10px] border-2 border-[#CFCFCF] font-bold text-[#2F2F2F]'>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                                <div className='flex flex-col gap-1 w-full'>
                                    <label className='text-[16px] text-[#595959]'>Sterilization Status</label>
                                    <select value={catprofile.sterilization_status || ''} 
                                    onChange={(e) => setCatprofile((prev) => ({...prev, sterilization_status: e.target.value}))}
                                    className='p-[10px] text-[#2F2F2F] rounded-[10px] border-2 border-[#CFCFCF] font-bold text-[#2F2F2F]'>
                                        <option value="Intact">Intact</option>
                                        <option value="Neutered">Neutered</option>
                                        <option value="Spayed">Spayed</option>
                                    </select>
                                </div>

                                <div className='flex flex-col gap-1 w-full'>
                                    <label className='text-[16px] text-[#595959]'>Adoption Status</label>
                                    <select  value={catprofile.adoption_status || ''} 
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

                            
                            {/* CAT DESCRIPTION */}
                            <div className='flex flex-col'>
                                <label className='text-[#595959] font-bold'>Description</label>
                                <textarea name="" id="" rows={5} className='border-2 border-[#CFCFCF] resize-none rounded-[15px] p-2'
                                value={catprofile.description} 
                                onChange={(e) => setCatprofile((prev) => ({...prev, description: e.target.value}))}
                                placeholder='Describe the cat here'></textarea>
                            </div>


                            {/* Image/s */}
                            {/* FUNCTION: Fetches all the Image data from the Database */}
                            {/* <div className={uploaderVisible ? 'hidden' : 'flex flex-col'}>
                                <div className='flex items-center justify-between pb-2'>
                                    <label className='text-[#595959]'>Image/s</label>
                                    <div className='flex gap-2 items-center'>
                                    
                                        <button type='button' onClick={handleImageUploaderWindow}
                                        className={!uploaderVisible ? 'flex gap-2 items-center justify-center p-2 pl-3 pr-4 w-auto h-auto bg-[#2F2F2F] text-[#FFF] rounded-[15px] cursor-pointer hover:bg-[#595959] active:bg-[#2F2F2F]' : 'hidden' }>
                                            <div className='flex items-center w-[25px] h-auto'>
                                                <img src="/src/assets/icons/admin-icons/setting_white.png" alt="settings" />
                                            </div>
                                            Manage Image
                                        </button>
                                    </div>
                                </div>
                                <div className='grid grid-cols-5 gap-2 w-full'>
                                    {catImage.map((image, index) => (
                                        <div key={index} className='relative flex items-center bg-[#595959] max-w-[250px] h-[250px] rounded-[10px] overflow-hidden'>
                                            <img src={image} alt={`uploaded-${index}`} className="w-full h-full object-cover"/> 
                                        </div>
                                        
                                    ))}
                                </div>
                            </div> */}

                            {/* FUNCTION: Display all the image and delete selected image */}
                            {/* {uploaderVisible && (
                                <>
                                    <div className='flex flex-col w-full gap-2 p-5 rounded-[10px] border-1 border-[#a3a3a3] bg-[#FDF5D8]'>
                                    <div className='flex w-full gap-2 justify-between border-b-1 border-b-[#595959] pb-2'>
                                        <div className='flex gap-4 items-center'>
                                        <label className='text-[18px] text-[#2F2F2F] font-bold'>UPLOAD NEW IMAGE</label>
                                        <label htmlFor="catImageUpload"
                                            className='flex items-center justify-center p-2 pl-4 pr-4 gap-2 w-auto h-auto bg-[#2F2F2F] text-[#FFF] rounded-[20px] cursor-pointer hover:bg-[#595959] active:bg-[#2F2F2F]'>
                                               <div className='w-[15px] h-auto'>
                                                <img src="/src/assets/icons/add-white.png" alt="" />
                                               </div>
                                            Add Image
                                            <input type="file" accept='image/*' id="catImageUpload" onChange={handleImageChange} className='hidden' />
                                        </label>
                                        </div>
                                        <button type='button' onClick={handleImageUploaderWindow}
                                        className='cursor-pointer p-2 pl-6 pr-6 hover:bg-[#CCCCCC] active:bg-[#FFF] rounded-[15px]'>
                                        Close
                                        </button>
                                    </div>

                                    <div className='grid grid-cols-5 gap-2 w-full'>
                                        {catImage.map((base64Str, index) => (
                                            <div key={`existing-${index}`} className='relative flex items-center bg-[#595959] max-w-[250px] h-[250px] rounded-[10px] overflow-hidden'>
                                            <button
                                                type='button'
                                                className='absolute top-2 right-2 p-1 pl-4 pr-4 bg-[#FFF] text-[#2F2F2F] font-bold rounded-[10px] cursor-pointer active:bg-[#CFCFCF]'>
                                                Delete
                                            </button>
                                            <img src={base64Str} alt={`uploaded-${index}`} className="w-full h-full object-cover" />
                                            </div>
                                        ))}

                                        {catImagePreview.map((previewBase64Str, index) => (
                                            <div key={`preview-${index}`} className='relative flex items-center bg-[#CFCFCF] max-w-[250px] h-[250px] rounded-[10px] overflow-hidden'>
                                            <button
                                                type='button'
                                                onClick={() => handleDeleteImage(index)} // Deletes from preview
                                                className='absolute top-2 right-2 p-1 pl-4 pr-4 bg-[#FFF] text-[#2F2F2F] font-bold rounded-[10px] cursor-pointer active:bg-[#AAA]' >
                                                Delete
                                            </button>
                                            <img src={previewBase64Str} alt={`preview-${index}`} className="w-full h-full object-cover opacity-90" />
                                            <span className='absolute bottom-2 left-2 text-xs bg-white text-black px-2 py-1 rounded'>Preview</span>
                                            </div>
                                        ))}

                                        

                                    </div>

                                    <div className='flex w-full gap-2 justify-end'>
                                        <div className='flex gap-2 items-center'>
                                            <button type='button' onClick={() => handleUploadImages(cat_id)}
                                                className={!catImagePreview.length ? 'hidden' : 'p-2 pl-6 pr-6 w-auto h-auto bg-[#B5C04A] text-[#FFF] rounded-[15px] cursor-pointer hover:bg-[#CFDA34] active:bg-[#B5C04A]'}>
                                                Save
                                            </button>
                                            </div>
                                        </div>
                                    </div>
                                </> 
                            )} */}


                            {/* THIS BLOCK DISPLAYS THE IMAGE SAVED ON DATABASE w/ DELETE FUNCTIONALITY */}
                            {!uploaderVisible && (
                                <div className='flex flex-col gap-2 border-1 border-[#a3a3a3] p-3 rounded-[15px]'>
                                    {/* HEADER */}
                                    <div className='flex items-center justify-between'>
                                        <label className='text-[20px] text-[#2F2F2F] font-bold '> IMAGES </label>
                                        <button onClick={handleImageUploaderWindow} type='button' className='flex items-center gap-2 bg-[#2F2F2F] text-[#FFF] p-2 pl-4 pr-4 rounded-[25px] cursor-pointer active:bg-[#595959]'> 
                                            <div className='w-[20px] h-auto'>
                                                <img src="/src/assets/icons/admin-icons/setting_white.png" alt=""/>
                                            </div>
                                            Manage Images
                                        </button>
                                    </div>

                                    {/* PREVIEW IMAGE HERE */}
                                    <div className='grid grid-cols-5 gap-2 w-full'>

                                        {/* SINGLE IMAGE CONTAINER */}
                                        {catImage.map((imageURL, index) => (
                                            <div key={index} className='relative flex items-center max-w-[250px] h-[250px] rounded-[10px] overflow-hidden bg-[#CCCCCC] border-1 border-[#CCCCCC]'>
                                                <button type='button' onClick={() => handleDeleteImage(imageURL.filename)}
                                                className='absolute top-2 right-2 bg-[#DC8801] text-[#FFF] p-1 pl-2 pr-2 rounded-[15px] cursor-pointer active:bg-[#2F2F2F]'>delete</button>
                                                <img src={imageURL.url} alt={`Cat Image ${index}`} className="w-full h-full object-cover"/>
                                            </div>
                                        ))}
                                        
                                    </div>
                                </div>
                            )}


                            {/* THIS BLOCK DISPLAYS IMAGES TO UPLOAD */}
                            {uploaderVisible && (
                                <div className='flex flex-col gap-2 border-1 border-[#a3a3a3] p-3 rounded-[15px]'>
                                    {/* HEADER */}
                                    <div className='flex items-center justify-between'>
                                        <label className='text-[20px] text-[#2F2F2F] font-bold '> IMAGES </label>

                                        {/* UPLOADER BUTTON */}
                                        <label htmlFor='image' className='flex items-center gap-2 bg-[#2F2F2F] text-[#FFF] p-2 pl-4 pr-4 rounded-[25px] cursor-pointer active:bg-[#595959]'> 
                                            <div className='w-[15px] h-auto'>
                                                <img src="/src/assets/icons/add-white.png" alt=""/>
                                            </div>
                                            <input type="file" name="image" id="image" className='hidden'
                                            onChange={handleImageChange}/>
                                            Add
                                        </label>
                                    </div>

                                    {/* PREVIEW IMAGE HERE */}
                                    {/* IF NO IMAGE IS SELECTED YET = Display the label */}
                                    {!catImagePreview || catImagePreview.length === 0 ?  
                                        <label className='flex justify-center text-[#DC8801]'>Uploade a new Image here.</label>
                                        :
                                        <div className='grid grid-cols-5 gap-2 w-full min-h-[250px]'>

                                            {/* SINGLE IMAGE CONTAINER */}
                                            {/* catImagePreview.map allows for multiple image to display */}
                                            {catImagePreview.map((imagePreview, index) => (
                                                <div key={index} className='relative flex items-center max-w-[250px] h-[250px] rounded-[10px] overflow-hidden'>
                                                    <img src={imagePreview.preview} alt="" className={"w-full h-full object-cover" }/>
                                                </div>
                                            ))}
                                        </div>
                                    }

                                    {/* SAVE BUTTON */}
                                    <div className='flex items-center justify-end gap-1 w-full'>
                                        <button type='button' onClick={() => handleUploadImages(cat_id)} className='flex items-center justify-center gap-2 bg-[#B5C04A] text-[#FFF]  font-bold p-2 pl-4 pr-4 min-w-[80px] rounded-[25px] cursor-pointer active:bg-[#595959]'>
                                            Save
                                        </button>
                                        <button onClick={handleImageUploaderWindow} type='button' className='flex items-center gap-2 bg-[#2F2F2F] text-[#FFF] font-bold p-2 pl-4 pr-4 rounded-[25px] cursor-pointer active:bg-[#595959]'>
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}

                    
                            {/* SAVE CHANGES FOR THE FORM EXCEPT THE IMAGES*/}
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