import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "./SessionContext.jsx";

const WhiskerMeterContext = createContext();
export const useWhiskerMeter = () => useContext(WhiskerMeterContext);

export const WhiskerMeterProvider = ({ children }) => {
  const { user: actualUser, loading: sessionLoading } = useSession();
  const [points, setPoints] = useState(0);

  useEffect(() => {
    if (sessionLoading) return;

    if (!actualUser) {
      setPoints(0);
      console.log("👋 User logged out, resetting points to 0");
      return;
    }

    const fetchPoints = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/whiskermeter/${actualUser.user_id}`,
          { withCredentials: true }
        );
        setPoints(res.data.points);
      } catch (err) {
        console.error("❌ Failed to fetch whiskermeter:", err);
      }
    };

    fetchPoints();
  }, [actualUser, sessionLoading]);

  const resetWhiskerMeter = () => setPoints(0);

  return (
    <WhiskerMeterContext.Provider
      value={{ points, setPoints, resetWhiskerMeter }}
    >
      {children}
    </WhiskerMeterContext.Provider>
  );
};
