// CatProfile.jsx
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
import { useSession } from "../../context/SessionContext";

const CatProfile = () => {
  // CatProfile.jsx
  const { cat_id } = useParams();

  const { user, loading, refreshSession } = useSession();
  const navigate = useNavigate();
  const { points } = useWhiskerMeter();
  const [catLoading, setCatLoading] = useState(false);

  const [cats, setCats] = useState([]);
  const [cat, setCat] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // Fetch all cats
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await fetch("http://localhost:5000/cats/catlist");
        if (!res.ok) throw new Error("Failed to fetch cats");
        const data = await res.json();
        setCats(data);
      } catch (err) {
        console.error("Failed to fetch cats:", err);
      }
    };
    fetchCats();
  }, []);

  useEffect(() => {
    const fetchCat = async () => {
      try {
        setCatLoading(true);
        // optionally: you can set a local loading state if needed
        const res = await fetch(
          `http://localhost:5000/cats/catprofile/${cat_id}`
        );
        if (!res.ok) throw new Error("Failed to fetch cat");
        const data = await res.json();
        setCat(data);
      } catch (err) {
        console.error("Failed to fetch cat:", err);
      } finally {
        setCatLoading(false);
      }
    };

    if (cat_id) fetchCat();
  }, [cat_id]);

  // Fetch one image
  useEffect(() => {
    const fetchImage = async () => {
      try {
        const res = await fetch(`http://localhost:5000/cats/${cat_id}/images`);
        if (!res.ok) throw new Error("Failed to fetch images");
        const data = await res.json();

        if (data.length > 0) {
          const primary = data.find((img) => img.is_primary === 1);
          setSelectedImage(primary ? primary.url : data[0].url);
        } else {
          setSelectedImage("/src/assets/icons/CatImages/cat1.jpg");
        }
      } catch (err) {
        console.error("Failed to fetch image:", err);
        setSelectedImage("/src/assets/icons/CatImages/cat1.jpg");
      }
    };

    if (cat_id) fetchImage();
  }, [cat_id]);

  const currentIndex = cats.findIndex((c) => c.cat_id === parseInt(cat_id));

  const goToPrevCat = () => {
    if (currentIndex > 0) {
      const prevCat = cats[currentIndex - 1];
      navigate(`/catprofile/${prevCat.cat_id}`);
    }
  };

  const goToNextCat = () => {
    if (currentIndex < cats.length - 1) {
      const nextCat = cats[currentIndex + 1];
      navigate(`/catprofile/${nextCat.cat_id}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen pb-10">
      <CatBot />
      <NavigationBar />
      {user?.role === "head_volunteer" ? (
        <HeadVolunteerSideBar />
      ) : user?.role === "admin" ? (
        <AdminSideBar />
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

            {/* Cat Details */}
            <div className="relative grid grid-cols-[60%_40%] w-[1000px] bg-white p-5 rounded-[25px] shadow-md">
              {/* Left: Image */}
              <div className="flex flex-col bg-[#FDF5D8] p-4 gap-4 rounded-[20px]">
                <div className="flex flex-col items-center h-[450px] w-full rounded-[16px] overflow-hidden">
                  <img
                    src={selectedImage}
                    alt={cat?.name || "Cat"}
                    className="h-full w-auto object-cover"
                  />
                </div>
              </div>

              {/* Right: Info */}
              <div className="flex flex-col justify-between p-5">
                <div>
                  <h2 className="text-2xl font-bold text-[#DC8801] border-b-2 border-b-[#DC8801] pb-2">
                    {cat?.name || "Unnamed Cat"}
                  </h2>

                  <div className="mt-4 space-y-3 text-sm text-gray-700">
                    <p>
                      <strong>Gender:</strong> {cat?.gender || "Unknown"}
                    </p>
                    <p>
                      <strong>Age:</strong> {cat?.age || "Unknown"}
                    </p>
                    <p>
                      <strong>Sterilization Status:</strong>{" "}
                      {cat?.sterilization_status || "Unknown"}
                    </p>
                  </div>

                  <p className="mt-4 text-justify">
                    {cat?.description || "No description available."}
                  </p>
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
                      to={`/adopteeform/${cat_id}`}
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
