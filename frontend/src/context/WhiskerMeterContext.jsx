// context/WhiskerMeterContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "./SessionContext.jsx";

const WhiskerMeterContext = createContext();
export const useWhiskerMeter = () => useContext(WhiskerMeterContext);

export const WhiskerMeterProvider = ({ children }) => {
  const { user: actualUser, loading: sessionLoading } = useSession();
  const [points, setPoints] = useState(0);
  const [badge, setBadge] = useState(""); // 🆕 Track badge
  const [pointsLoading, setPointsLoading] = useState(true);

  useEffect(() => {
    console.log(
      "WhiskerMeterContext - sessionLoading:",
      sessionLoading,
      "actualUser:",
      actualUser
    );

    if (sessionLoading) return;

    const fetchWhiskerMeter = async () => {
      if (!actualUser || !actualUser.user_id) {
        console.log(
          "User not logged in or missing user_id, resetting points/badge"
        );
        setPoints(0);
        setBadge(""); // reset badge
        setPointsLoading(false);
        return;
      }

      try {
        setPointsLoading(true);
        const res = await axios.get(
          `http://localhost:5000/whisker/api/whiskermeter/${actualUser.user_id}`,
          { withCredentials: true }
        );

        setPoints(res.data.points || 0);
        setBadge(res.data.badge || ""); // 🆕 store badge
        console.log("WhiskerMeter loaded:", res.data);
      } catch (err) {
        console.error("Failed to fetch whiskermeter:", err);
        setPoints(0);
        setBadge("");
      } finally {
        setPointsLoading(false);
      }
    };

    fetchWhiskerMeter();
  }, [actualUser?.user_id, sessionLoading]);

  const resetWhiskerMeter = () => {
    console.log("Resetting whisker meter to 0 + empty badge");
    setPoints(0);
    setBadge("");
  };

  return (
    <WhiskerMeterContext.Provider
      value={{
        points,
        badge, // 🆕 expose badge
        setPoints,
        setBadge, // optional, in case you want to update manually
        resetWhiskerMeter,
        pointsLoading,
      }}
    >
      {children}
    </WhiskerMeterContext.Provider>
  );
};
