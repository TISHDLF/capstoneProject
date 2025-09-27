import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useSession } from "../context/SessionContext";

const NotificationBell = () => {
  const { user, notifications = [], fetchNotifications } = useSession(); // Default to empty array
  const [isOpen, setIsOpen] = useState(false);

  const menuRef = useRef(null);

  useEffect(() => {
    if (user?.user_id) {
      fetchNotifications(user.user_id);
    }
  }, [user]);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const markAsRead = async (id) => {
    try {
      await axios.patch(
        `http://localhost:5000/user/notifications/mark_read/${id}`
      );
      await fetchNotifications(user.user_id);
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/user/notifications/delete/${id}`
      );
      await fetchNotifications(user.user_id);
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={menuRef} className="relative">
      {/* Bell Button */}
      <button onClick={toggleDropdown} className="relative">
        <div className="relative flex items-center justify-center w-[40px] p-[8px] h-auto bg-[#FFFFFF] rounded-[10px] drop-shadow-lg active:scale-100 active:border-2 border-[#DC8801]">
          <img
            className="max-w-full max-h-full object-contain"
            src="/src/assets/icons/notification-bell.png"
            alt="notification bell"
          />
        </div>
        {Array.isArray(notifications) &&
          notifications.some((n) => !n.is_read) && (
            <div className="absolute -top-2 -left-3 bg-[#DC8801] w-[20px] h-[23px] rounded-full flex items-center justify-center">
              <span className="text-[#FFF] text-xs font-medium">
                {notifications.filter((n) => !n.is_read).length}
              </span>
            </div>
          )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className={
            "absolute top-8 right-8 bg-white border border-[#DC8801] rounded-[10px] rounded-tr-[0px] w-[300px] z-50 shadow-lg  max-h-[400px] overflow-y-scroll"
          }
        >
          {!Array.isArray(notifications) || notifications.length === 0 ? (
            <p className="p-3 text-[#2F2F2F] text-sm">No notifications</p>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.notification_id}
                className={`p-3 border-b border-gray-200 flex flex-col gap-1 ${
                  notif.is_read ? "" : "bg-[#FFFCF6]"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-sm text-[#2F2F2F]">{notif.message}</p>
                    <span className="text-xs text-gray-400 block mt-1">
                      {new Date(notif.created_at).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 ml-2">
                    {!notif.is_read && (
                      <button
                        onClick={() => markAsRead(notif.notification_id)}
                        className="w-[20px] h-[20px] rounded-[15px] p-1 hover:bg-[#b6b6b6]"
                      >
                        <img
                          src="/src/assets/icons/mark_as_read.png"
                          alt="mark as read"
                        />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notif.notification_id)}
                      className="w-[21px] h-[21px] p-[2px] rounded-[12px] hover:bg-[#cdcdcd]"
                    >
                      <img
                        src="/src/assets/icons/trash-bin.png"
                        alt="delete notification"
                      />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
