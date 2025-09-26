import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

import NavigationBar from "../components/NavigationBar";
import SideNavigation from "../components/SideNavigation";
import HeadVolunteerSideBar from "../components/HeadVolunteerSideBar";
import Footer from "../components/Footer";
import CatBot from "../components/CatBot";

import pic from "../assets/CatNewsModel.png";
import news1 from "../assets/SampleNewsPic.png";
import news2 from "../assets/news2.png";
import news3 from "../assets/news3.png";

import WhiskerMeterGuide from "../components/WhiskerMeterGuide";
import WhiskerMeter from "../components/WhiskerMeter";
import { useWhiskerMeter } from "../context/WhiskerMeterContext";
import { useSession } from "../context/SessionContext";

const Home = () => {
  const { user } = useSession();
  const { points } = useWhiskerMeter();

  const [catImages, setCatImages] = useState([]);
  const [selectedImage] = useState(null);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const response = await axios.get("http://localhost:5000/cats/catlist");
        console.log("API raw response:", response.data);
        const formattedCats = response.data.map((cat) => ({
          ...cat,
          url: cat.thumbnail
            ? `http://localhost:5000/uploads/cats/${cat.thumbnail}`
            : null,
        }));

        setCatImages(formattedCats);
        console.log(formattedCats);
      } catch (err) {
        console.error("Error fetching cat list:", err);
      }
    };

    fetchCats();
  }, []);

  return (
    <div className="flex flex-col min-h-screen pb-10">
      <CatBot />
      <NavigationBar />
      <WhiskerMeter user={{ points }} />
      {user?.role === "head_volunteer" && "admin" ? (
        <HeadVolunteerSideBar />
      ) : (
        <SideNavigation />
      )}
      {/* Cat Community News Section */}
      <div className="h-full w-full">
        <div className="flex p-10 pl-0 pr-0">
          <div className="flex justify-center p-10 gap-10">
            <div className="w-13"></div>
            <div className="justify-center w-270 rounded-br-4xl rounded-bl-4xl rounded-tl-4xl shadow-2xl hover:shadow-xl transition-shadow duration-300 p-3">
              <img src={pic} alt="" className="w-full" />
              <p className="absolute top-150 left-50 text-white font-bold text-[50px]">
                Stray Today,
                <br /> Safe Tomorrow
              </p>
            </div>
            <div></div>
          </div>
        </div>

        <div className="flex p-10 pl-0 pr-0">
          <div className="flex justify-center p-10 gap-10">
            <div className="w-13"></div>
            <div className="justify-center w-270 rounded-br-4xl rounded-bl-4xl rounded-tr-4xl shadow-2xl hover:shadow-xl transition-shadow duration-300 p-3">
              <div>
                <div className="bg-yellow-600 w-50 p-4 text-white rounded-tr-4xl rounded-tl-4xl absolute top-227 left-33 hover: transition-shadow duration-300 z-0">
                  Be part of our mission
                </div>
                {}
                <div className="flex-col p-5 w-auto">
                  <div className="flex gap-5 justify-around pb-5 flex-auto w-full">
                    <img src={news1} alt="" className="w-auto h-auto" />
                    <img src={news2} alt="" className="w-[400px] h-auto" />
                    <img src={news3} alt="" className="w-auto h-auto" />
                  </div>
                  <div>
                    The Siena Park Cat Community is a group that cares for the
                    welfare of stray cats in Siena Park Residences. The group
                    advocates for responsible pet ownership by reducing the
                    stray cat population and finding loving, permanent homes for
                    these cats.
                    <p className="font-semibold">
                      Join us and be part of the change!
                    </p>
                  </div>
                  <div className="flex justify-end">
                    <Link
                      to="/aboutus"
                      className="pl-5 pr-5 p-2 bg-yellow-600 active:bg-yellow-500 text-white rounded-2xl"
                    >
                      More info!
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cat Community Adoption Section */}
        <div className="flex p-10 pl-0 pr-0">
          <div className="flex justify-center p-10 gap-10">
            <div className="w-13"></div>
            <div className="bg-yellow-600 w-50 p-4 text-white rounded-tr-4xl rounded-tl-4xl absolute top-374 left-33 hover: transition-shadow duration-300 z-0">
              Adopt a cat
            </div>
            <div className="justify-center w-270 rounded-br-4xl rounded-bl-4xl rounded-tr-4xl shadow-2xl hover:shadow-xl transition-shadow duration-300 p-5">
              <div className="w-full h-45">
                {/* Cat Images */}
                {/* Cat Images */}
                <div className="flex justify-around gap-3 overflow-hidden">
                  {catImages.slice(0, 6).map((img, index) => (
                    <img
                      key={index}
                      src={img.url}
                      alt={`Cat ${index}`}
                      className={`w-[160px] h-[160px] rounded-[10px] object-cover cursor-pointer ${
                        selectedImage === img.url
                          ? "opacity-100 border-2 border-[#DC8801]"
                          : "opacity-100 hover:border-1s border-[#DC8801]"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex justify-end">
                <Link
                  to={"/catadoption"}
                  className="pl-5 pr-5 p-2 bg-yellow-600 text-white rounded-2xl active:bg-yellow-500"
                >
                  More info
                </Link>
              </div>
            </div>
            <div></div>
          </div>
        </div>
        <WhiskerMeterGuide />
        <Footer />
      </div>
    </div>
  );
};

export default Home;
