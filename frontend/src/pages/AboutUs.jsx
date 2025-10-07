import React from "react";
import { Link } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";
import SideNavigation from "../components/SideNavigation";
import HeadVolunteerSideBar from "../components/HeadVolunteerSideBar";
import Footer from "../components/Footer";
import CatBot from "../components/CatBot";
import WhiskerMeter from "../components/WhiskerMeter";
import { useWhiskerMeter } from "../context/WhiskerMeterContext";
import { useSession } from "../context/SessionContext";

const handleGoBack = () => {
  window.history.back();
};

const AboutUs = () => {
  const { user } = useSession();
  const { points } = useWhiskerMeter();

  return (
    <div className="flex flex-col min-h-screen pb-10">
      <CatBot />
      <NavigationBar />
      <WhiskerMeter user={{ points }} />

      <div className="grid grid-cols-1 md:grid-cols-[80%_20%] h-full">
        <div className="flex flex-col p-4 md:pl-50 md:p-10">
          <div className="relative flex flex-col items-center justify-center w-full bg-white p-6 md:p-10 gap-5 rounded-[25px] shadow-md">
            <Link
              onClick={handleGoBack}
              className="absolute left-0 top-0 md:left-0 md:top-0 flex items-center gap-2 p-2 pr-3 rounded-xl bg-[#DC8801] hover:bg-[#eea32e] active:bg-[#DC8801]"
            >
              <img
                src="src/assets/icons/arrow.png"
                alt="arrow"
                className="w-5 h-5 md:w-6 md:h-6 object-contain"
              />
              <span className="font-bold text-white text-sm md:text-base">
                Back
              </span>
            </Link>

            <h1 className="font-bold text-xl md:text-3xl text-center pt-3">
              About Siena Park Residences Cat Community
            </h1>

            <p className="text-justify text-sm md:text-base text-gray-700">
              The Siena Park Cat Community is a dedicated group focused on the
              welfare of stray cats in Siena Park Residences. Supported by DMCI
              Homes, the group advocates for responsible pet ownership through a
              shared vision of reducing the stray cat population and finding
              forever homes for these cats.
            </p>

            <h2 className="font-bold text-lg md:text-2xl text-[#DC8801] border-b-2 border-[#DC8801] w-full pb-1">
              Community Pillars
            </h2>

            <div className="flex flex-col gap-6 w-full pb-20">
              {[
                {
                  title: "Humane Advocacy for Stray Cats",
                  desc: "Advocating for the humane treatment of stray and community cats, the group promotes empathy, compassion, and responsible actions toward animals living within the residential environment.",
                },
                {
                  title: "Implementation of Trap-Neuter-Release (TNVR) Program",
                  desc: "At the core of the community's initiatives is the TNVR program that focuses on humanely controlling the stray cat popuilation, reducing nuisance behaviors of feral cats and improve overall public health.",
                },
                {
                  title: "Rescue, Rehabilitation, and Rehoming",
                  desc: "The community rescues injured, sick, or abandoned cats, providing necessary care and support. Efforts are made to rehabilitate these cats and place them in foster homes or secure permanent adoptions.",
                },
                {
                  title: "Sustained Community Engagement",
                  desc: "Encouraging active involvement from residents, volunteers, and supperters though regular feeding, care giving, and monitoring work are done to ensuring the safety and well-being of the cats.",
                },
              ].map((pillar, i) => (
                <div key={i} className="flex flex-col">
                  <span className="font-bold text-sm md:text-base">
                    {pillar.title}
                  </span>
                  <p className="text-justify text-sm md:text-base text-gray-700">
                    {pillar.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {user?.role === "head_volunteer" ? (
          <HeadVolunteerSideBar />
        ) : (
          <SideNavigation />
        )}
      </div>

      <Footer />
    </div>
  );
};

export default AboutUs;
