import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import NavigationBar from "../../components/NavigationBar";
import Footer from "../../components/Footer";
import SideNavigation from "../../components/SideNavigation";
import CatBot from "../../components/CatBot";
import HeadVolunteerSideBar from "../../components/HeadVolunteerSideBar";
import AdminSideBar from "../../components/AdminSideBar";
import { useWhiskerMeter } from "../../context/WhiskerMeterContext";
import WhiskerMeter from "../../components/WhiskerMeter";

const CatProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user"));
  const { points } = useWhiskerMeter();

  const [cats, setCats] = useState([]); // list of all cats
  const [cat, setCat] = useState(null); // single cat
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]); // 👈 cat images
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/cats");
        if (!res.ok) throw new Error("Failed to fetch cats");
        const data = await res.json();
        setCats(data);
      } catch (err) {
        console.error("Failed to fetch cats:", err);
      }
    };
    fetchCats();
  }, []);

  // Fetch single cat
  useEffect(() => {
    const fetchCat = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5000/api/cats/${id}`);
        if (!res.ok) throw new Error("Failed to fetch cat");
        const data = await res.json();
        setCat(data);
      } catch (err) {
        console.error("Failed to fetch cat:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCat();
  }, [id]);

  // Fetch cat images
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch(`http://localhost:5000/upload/catimages/${id}`);
        if (!res.ok) throw new Error("Failed to fetch images");
        const data = await res.json();

        setImages(data);
        if (data.length > 0) {
          // Prefer primary image
          const primary = data.find((img) => img.is_primary === 1);
          setSelectedImage(primary ? primary.url : data[0].url);
        } else {
          setSelectedImage("/src/assets/icons/CatImages/cat1.jpg");
        }
      } catch (err) {
        console.error("Failed to fetch images:", err);
        setSelectedImage("/src/assets/icons/CatImages/cat1.jpg");
      }
    };

    if (id) fetchImages();
  }, [id]);

  if (loading) return <p className="p-10">Loading cat info...</p>;
  if (!cat) return <p className="p-10">Cat not found</p>;

  const currentIndex = cats.findIndex((c) => c.cat_id === parseInt(id));

  const goToPrevCat = () => {
    if (currentIndex > 0) {
      const prevCat = cats[currentIndex - 1];
      navigate(`/cat/${prevCat.cat_id}`);
    }
  };

  const goToNextCat = () => {
    if (currentIndex < cats.length - 1) {
      const nextCat = cats[currentIndex + 1];
      navigate(`/cat/${nextCat.cat_id}`);
    }
  };

  const handleImageClick = (src) => {
    setSelectedImage(src);
  };

  return (
    <div className="flex flex-col min-h-screen pb-10">
      <CatBot />
      <NavigationBar />
      {user?.role === "head_volunteer" ? (
        <HeadVolunteerSideBar />
      ) : (
        <SideNavigation />
      )}

      <div className="grid grid-cols-[80%_20%] h-full">
        <div className="relative flex flex-col pl-50 p-8">
          <div className="relative flex flex-row items-center gap-2">
            {/* Left Arrow */}
            <button
              onClick={goToPrevCat}
              disabled={currentIndex <= 0}
              className="flex items-center justify-center bg-[#B5C04A] w-[50px] h-[50px] p-2 rounded-[50%] hover:bg-[#CFDA34] disabled:opacity-50"
            >
              <img
                src="/src/assets/icons/arrow-left-no-tail.png"
                alt="arrow left"
              />
            </button>

            {/* Cat Details Card */}
            <div className="relative grid grid-cols-[60%_40%] w-[1000px] bg-white p-5 rounded-[25px] shadow-md">
              {/* Left side: images */}
              <div className="flex flex-col bg-[#FDF5D8] p-4 gap-4 rounded-[20px]">
                <div className="flex flex-col items-center h-[450px] w-full rounded-[16px] overflow-hidden">
                  <img
                    src={selectedImage}
                    alt={cat.name}
                    className="h-full w-auto object-cover"
                  />
                </div>
                <div className="grid grid-cols-5 gap-2 overflow-x-auto">
                  {images.map((img, index) => (
                    <img
                      key={img.image_id || `${img.url}-${index}`} // fallback for uniqueness
                      src={img.url}
                      alt={`${cat.name} ${index}`}
                      onClick={() => handleImageClick(img.url)}
                      className={`w-[100px] h-[100px] rounded-[10px] object-cover cursor-pointer ${
                        selectedImage === img.url
                          ? "opacity-100 border-2 border-[#DC8801]"
                          : "opacity-60 hover:opacity-100"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Right side: info */}
              <div className="flex flex-col justify-between p-5">
                <div>
                  <h2 className="text-2xl font-bold text-[#DC8801] border-b-2 border-b-[#DC8801] pb-2">
                    {cat.name}
                  </h2>

                  <div className="mt-4 space-y-3 text-sm text-gray-700">
                    <p>
                      <strong>Gender:</strong> {cat.gender}
                    </p>
                    <p>
                      <strong>Age:</strong> {cat.age || "Unknown"}
                    </p>
                    <p>
                      <strong>Sterilization Status:</strong>{" "}
                      {cat.sterilization_status}
                    </p>
                  </div>

                  <p className="mt-4 text-justify">{cat.description}</p>
                </div>

                <div className="flex flex-col w-full gap-2 mt-6">
                  {!user ? (
                    <Link
                      to="/login"
                      className="bg-[#B5C04A] text-white font-bold p-3 rounded-[15px] text-center hover:bg-[#CFDA34]"
                    >
                      Login to adopt this cat
                    </Link>
                  ) : (
                    <Link
                      to={`/adopteeform/${id}`}
                      className="bg-[#B5C04A] text-white font-bold p-3 rounded-[15px] text-center hover:bg-[#CFDA34]"
                    >
                      I want to adopt this cat
                    </Link>
                  )}

                  <Link
                    to="/catadoption"
                    className="border-2 border-[#B5C04A] text-[#B5C04A] font-bold p-3 rounded-[15px] text-center hover:bg-[#B5C04A] hover:text-white"
                  >
                    See other Cats
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Arrow */}
            <button
              onClick={goToNextCat}
              disabled={currentIndex >= cats.length - 1}
              className="flex items-center justify-center bg-[#B5C04A] w-[50px] h-[50px] rounded-[50%] p-2 hover:bg-[#CFDA34] disabled:opacity-50"
            >
              <img
                src="/src/assets/icons/arrow-right-no-tail.png"
                alt="arrow right"
              />
            </button>
          </div>
        </div>
        <WhiskerMeter user={{ points }} />
      </div>

      <Footer />
    </div>
  );
};

export default CatProfile;
