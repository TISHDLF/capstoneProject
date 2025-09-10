import React from "react";
import pic from "../assets/SampleNewsPic.png";
import { Link } from "react-router-dom";

const catcommunitynews = "/catcommunitynews";

const CardNews = () => {
  return (
    <div className="p-10">
      <div className=" rounded-2xl p-4 shadow-2xl hover:shadow-xl transition-shadow duration-300 h-130 w-110 ">
        <div className="flex-col">
          <div className="">
            <img src={pic} alt="" className="w-350" />
            <p className="text-xl font-bold text-left p-2">
              MissionTNVR: A Success Story
            </p>
            <p className="text-left pt-4">
              We’re excited to share that our TNVR
              (Trap-Neuter-Vaccinate-Return) program was a success last night. 6
              community cats are now neutered, vaccinated, and...
            </p>
            <div className="flex justify-end pt-10">
              <Link
                pathname="home"
                to="/catcommunitynews"
                className="bg-lime-500 p-5 pt-2 pb-2 rounded-2xl text-amber-50 hover:bg-lime-600 font-bold "
              >
                View More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardNews;
