// // import React, { createContext, useContext, useState, useEffect } from "react";
// // import axios from "axios";
// // import { useSession } from "./SessionContext.jsx";

// // const WhiskerMeterContext = createContext();
// // export const useWhiskerMeter = () => useContext(WhiskerMeterContext);

// // export const WhiskerMeterProvider = ({ children }) => {
// //   const { user: actualUser, loading: sessionLoading } = useSession();
// //   const [points, setPoints] = useState(0);
// //   const [pointsLoading, setPointsLoading] = useState(true);

// //   useEffect(() => {
// //     if (sessionLoading) return;

// //     if (!actualUser) {
// //       setPoints(0);
// //       console.log("User logged out, resetting points to 0");
// //       return;
// //     }

// //     const fetchPoints = async () => {
// //       try {
// //         const res = await axios.get(
// //           `http://localhost:5000/whisker/api/whiskermeter/${actualUser.user_id}`,
// //           { withCredentials: true }
// //         );
// //         setPoints(res.data.points);
// //         console.log('Show points: ', res.data.points)

// //         } catch (err) {
// //                 console.error("Failed to fetch whiskermeter:", err);
// //         }
// //         finally {
// //             setPointsLoading(false);
// //         }
// //     };

// //     fetchPoints();
// //   }, [actualUser, sessionLoading]);

// //   const resetWhiskerMeter = () => setPoints(0);

// //   return (
// //     <WhiskerMeterContext.Provider value={{ points, setPoints, resetWhiskerMeter, pointsLoading  }}>
// //       {children}
// //     </WhiskerMeterContext.Provider>
// //   );
// // };


// // context/WhiskerMeterContext.jsx

// import React, { createContext, useContext, useState, useEffect } from "react";
// import axios from "axios";
// import { useSession } from "./SessionContext.jsx";

// const WhiskerMeterContext = createContext();
// export const useWhiskerMeter = () => useContext(WhiskerMeterContext);

// export const WhiskerMeterProvider = ({ children }) => {
//   const { user: actualUser, loading: sessionLoading } = useSession();
//   const [points, setPoints] = useState(null);
//   const [pointsLoading, setPointsLoading] = useState(true);

//   useEffect(() => {
//     const fetchPoints = async () => {
//       if (sessionLoading) return;

//       if (!actualUser || !actualUser.user_id) {
//         console.log("User not logged in, resetting points to 0");
//         setPoints(0);
//         setPointsLoading(false);
//         return;
//       }

//       try {
//         setPointsLoading(true);
//         const res = await axios.get(
//           `http://localhost:5000/whisker/api/whiskermeter/${actualUser.user_id}`,
//           { withCredentials: true }
//         );
//         setPoints(res.data.points);
//         console.log("WhiskerMeter points loaded:", res.data.points);
//       } catch (err) {
//         console.error("Failed to fetch whiskermeter:", err);
//         setPoints(0);
//       } finally {
//         setPointsLoading(false);
//       }
//     };

//     fetchPoints();
//   }, [actualUser?.user_id, sessionLoading]);

//   const resetWhiskerMeter = () => {
//     setPoints(0);
//   };

//   return (
//     <WhiskerMeterContext.Provider
//       value={{
//         points,
//         setPoints,
//         resetWhiskerMeter,
//         pointsLoading,
//       }}
//     >
//       {children}
//     </WhiskerMeterContext.Provider>
//   );
// };


import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "./SessionContext.jsx";

const WhiskerMeterContext = createContext();
export const useWhiskerMeter = () => useContext(WhiskerMeterContext);

export const WhiskerMeterProvider = ({ children }) => {
  const { user: actualUser, loading: sessionLoading } = useSession();
  const [points, setPoints] = useState(0); // Initialize as 0 instead of null for consistency
  const [pointsLoading, setPointsLoading] = useState(true);

  useEffect(() => {
    console.log("WhiskerMeterContext - sessionLoading:", sessionLoading, "actualUser:", actualUser);

    if (sessionLoading) {
      // Wait for session to finish loading
      return;
    }

    const fetchPoints = async () => {
      if (!actualUser || !actualUser.user_id) {
        console.log("User not logged in or missing user_id, resetting points to 0");
        setPoints(0);
        setPointsLoading(false);
        return;
      }

      try {
        setPointsLoading(true);
        const res = await axios.get(
          `http://localhost:5000/whisker/api/whiskermeter/${actualUser.user_id}`,
          { withCredentials: true }
        );
        setPoints(res.data.points || 0); // Fallback to 0 if points are undefined
        console.log("WhiskerMeter points loaded:", res.data.points);
      } catch (err) {
        console.error("Failed to fetch whiskermeter:", err);
        setPoints(0);
      } finally {
        setPointsLoading(false);
      }
    };

    fetchPoints();
  }, [actualUser?.user_id, sessionLoading]);

  const resetWhiskerMeter = () => {
    console.log("Resetting whisker meter to 0");
    setPoints(0);
  };

  return (
    <WhiskerMeterContext.Provider
      value={{ points, setPoints, resetWhiskerMeter, pointsLoading, }}
    >
      {children}
    </WhiskerMeterContext.Provider>
  );
};