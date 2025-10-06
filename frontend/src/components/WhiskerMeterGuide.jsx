import React from "react";
import meterPhoto from "../assets/paw2.png";
import cat_list from "../assets/icons/paws.png";

const WhiskerMeterGuide = () => {
  return (
    <>
      {/* Desktop Version - Hidden on mobile */}
      <div className="hidden md:block w-70 h-145 bg-amber-0 rounded-3xl shadow-lg absolute right-1 top-250">
        <header className="flex items-center justify-center bg-yellow-600 p-4 rounded-t-3xl">
          <div>
            <img src={meterPhoto} alt="Meter" className="w-12 h-12 mr-2" />
          </div>
          <div>
            <p className="font-semibold">Whisker Meter Guideline</p>
            <p className="text-xs">
              Track your progress in the SPR Cat Community
            </p>
          </div>
        </header>
        <main className="p-4 flex flex-col align">
          <h3 className="mb-4">How the WhiskerMeter Works:</h3>
          {/* 1*/}
          <div className="flex">
            <div className="bg-yellow-500 rounded-full p-2 w-14 h-8 flex items-center justify-center mr-2">
              <p>1</p>
            </div>
            <div className="flex flex-col">
              <p className="font-bold">Create your profile</p>
              <p className="text-xs">
                Sign up or log in to your account in the cat community portal to
                activate your WhiskerMeter.
              </p>
            </div>
          </div>
          {/* 2 */}
          <div className="flex">
            <div className="bg-yellow-500 rounded-full p-2 w-8 h-8 flex items-center justify-center mr-2">
              <p>2</p>
            </div>
            <div className="flex flex-col">
              <p className="font-bold">Start engaging with the community</p>
              <div>
                <p className="text-xs pt-3">You can do this through:</p>
                <ul className="pt-2 pb-4 flex flex-col gap-4">
                  <li className="flex">
                    <img src={cat_list} alt="paw" className="w-8 h-8 mr-2" />
                    <p className="text-xs text-nowrap">
                      Donating money,food,etc..
                    </p>
                  </li>
                  <li className="flex">
                    <img src={cat_list} alt="paw" className="w-8 h-8 mr-2" />
                    <p className="text-xs">
                      Becoming feeder and reporting your progress.
                    </p>
                  </li>
                  <li className="flex">
                    <img src={cat_list} alt="paw" className="w-8 h-8 mr-2" />
                    <p className="text-xs">
                      Adopting cats from the SPR Cat Community.
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {/* 3*/}
          <div className="flex">
            <div className="bg-yellow-500 rounded-full p-2 w-14 h-8 flex items-center justify-center mr-2">
              <p>3</p>
            </div>
            <div className="flex flex-col">
              <p className="font-bold">Earn WhiskerPoints</p>
              <p className="text-xs">
                Each verified activity adds to your total WhiskerPoints.
              </p>
            </div>
          </div>
          {/* 4*/}
          <div className="flex justify-around items-center">
            <div className="bg-yellow-500 rounded-full p-2 w-14 h-8 flex items-center justify-center mr-2">
              <p>4</p>
            </div>
            <div className="flex flex-col">
              <p className="font-bold">Climb the WhiskerMeter</p>
              <p className="text-xs">
                As your points grow, you'll unlock new WhiskerMeter tiers that
                is visible on your profile.
              </p>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Version - Shown only on mobile */}
      <div className="md:hidden w-full px-4 mb-8">
        <div className="bg-amber-0 rounded-3xl shadow-lg overflow-hidden">
          <header className="flex items-center bg-yellow-600 p-4">
            <div className="flex-shrink-0">
              <img src={meterPhoto} alt="Meter" className="w-10 h-10" />
            </div>
            <div className="ml-3">
              <p className="font-semibold text-sm text-white">
                Whisker Meter Guideline
              </p>
              <p className="text-xs text-white/90">
                Track your progress in the SPR Cat Community
              </p>
            </div>
          </header>

          <main className="p-4 space-y-4">
            <h3 className="font-bold text-base mb-3">
              How the WhiskerMeter Works:
            </h3>

            {/* Step 1 */}
            <div className="flex gap-3">
              <div className="bg-yellow-500 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                <p className="text-sm font-semibold">1</p>
              </div>
              <div>
                <p className="font-bold text-sm">Create your profile</p>
                <p className="text-xs text-gray-700 mt-1">
                  Sign up or log in to your account in the cat community portal
                  to activate your WhiskerMeter.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-3">
              <div className="bg-yellow-500 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                <p className="text-sm font-semibold">2</p>
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm">
                  Start engaging with the community
                </p>
                <p className="text-xs text-gray-700 mt-2">
                  You can do this through:
                </p>
                <ul className="mt-2 space-y-2">
                  <li className="flex gap-2 items-start">
                    <img
                      src={cat_list}
                      alt="paw"
                      className="w-6 h-6 flex-shrink-0"
                    />
                    <p className="text-xs text-gray-700">
                      Donating money, food, etc.
                    </p>
                  </li>
                  <li className="flex gap-2 items-start">
                    <img
                      src={cat_list}
                      alt="paw"
                      className="w-6 h-6 flex-shrink-0"
                    />
                    <p className="text-xs text-gray-700">
                      Becoming feeder and reporting your progress.
                    </p>
                  </li>
                  <li className="flex gap-2 items-start">
                    <img
                      src={cat_list}
                      alt="paw"
                      className="w-6 h-6 flex-shrink-0"
                    />
                    <p className="text-xs text-gray-700">
                      Adopting cats from the SPR Cat Community.
                    </p>
                  </li>
                </ul>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-3">
              <div className="bg-yellow-500 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                <p className="text-sm font-semibold">3</p>
              </div>
              <div>
                <p className="font-bold text-sm">Earn WhiskerPoints</p>
                <p className="text-xs text-gray-700 mt-1">
                  Each verified activity adds to your total WhiskerPoints.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-3">
              <div className="bg-yellow-500 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                <p className="text-sm font-semibold">4</p>
              </div>
              <div>
                <p className="font-bold text-sm">Climb the WhiskerMeter</p>
                <p className="text-xs text-gray-700 mt-1">
                  As your points grow, you'll unlock new WhiskerMeter tiers that
                  are visible on your profile.
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default WhiskerMeterGuide;
