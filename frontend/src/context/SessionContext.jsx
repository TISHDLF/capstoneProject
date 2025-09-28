import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const SessionContext = createContext();

export const useSession = () => useContext(SessionContext);

export const SessionProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  const refreshSession = async () => {
    try {
      const res = await axios.get("http://localhost:5000/user/api/session", {
        withCredentials: true,
      });
      setUser(res.data.user || null);
      console.log("Session loaded:", res.data.user);

      // Fetch notifications when session is loaded
      if (res.data.user?.user_id) {
        await fetchNotifications(res.data.user.user_id);
      }
    } catch (err) {
      console.error("No active session:", err);
      setUser(null);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async (userId) => {
    if (!userId) {
      console.warn("No user ID provided for fetching notifications");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/user/notifications/${userId}`,
        { withCredentials: true }
      );
      setNotifications(response.data || []);
      console.log("Notifications fetched:", response.data);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
      // Set to empty array instead of leaving undefined
      setNotifications([]);
    }
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      await axios.patch(
        `http://localhost:5000/user/notifications/mark_read/${notificationId}`,
        {},
        { withCredentials: true }
      );

      // Update local state
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.notification_id === notificationId
            ? { ...notif, is_read: true }
            : notif
        )
      );
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await axios.delete(
        `http://localhost:5000/user/notifications/delete/${notificationId}`,
        { withCredentials: true }
      );

      // Remove from local state
      setNotifications((prev) =>
        prev.filter((notif) => notif.notification_id !== notificationId)
      );
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  const markAllNotificationsAsRead = async (userId) => {
    if (!userId) return;

    try {
      await axios.patch(
        `http://localhost:5000/user/notifications/mark_all_read/${userId}`,
        {},
        { withCredentials: true }
      );

      // Update local state
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, is_read: true }))
      );
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
    }
  };

  const login = (userData) => {
    setUser(userData);
    // Fetch notifications for the newly logged in user
    if (userData?.user_id) {
      fetchNotifications(userData.user_id);
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/user/logout",
        {},
        { withCredentials: true }
      );
      console.log("Logged out successfully");
    } catch (err) {
      console.error("Logout failed:", err);
    }
    setUser(null);
    setNotifications([]); // Clear notifications on logout
  };

  // Get unread notification count
  const getUnreadCount = () => {
    return notifications.filter((notif) => !notif.is_read).length;
  };

  useEffect(() => {
    refreshSession();
  }, []);

  return (
    <SessionContext.Provider
      value={{
        user,
        setUser,
        login,
        loading,
        refreshSession,
        logout,
        notifications,
        fetchNotifications,
        markNotificationAsRead,
        deleteNotification,
        markAllNotificationsAsRead,
        getUnreadCount,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};
