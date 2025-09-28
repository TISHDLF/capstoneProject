import React, { useEffect, useState, useRef } from "react";
import { useSession } from "../context/SessionContext";

const NotificationBell = () => {
  const {
    user,
    notifications = [],
    fetchNotifications,
    markNotificationAsRead,
    deleteNotification,
    getUnreadCount,
    markAllNotificationsAsRead,
  } = useSession();

  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (user?.user_id) {
      fetchNotifications(user.user_id);
    }
  }, [user?.user_id, fetchNotifications]);

  const toggleDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      // The context will handle updating the local state
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      await deleteNotification(id);
      // The context will handle updating the local state
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

    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen]);

  const unreadCount = getUnreadCount();

  return (
    <div ref={menuRef} className="relative inline-block">
      {/* Bell Button */}
      <button
        onClick={toggleDropdown}
        className="relative focus:outline-none focus:ring-2 focus:ring-[#DC8801] focus:ring-opacity-50 rounded-[10px]"
        type="button"
        aria-label="Toggle notifications"
        aria-expanded={isOpen}
      >
        <div className="relative flex items-center justify-center w-[40px] p-[8px] h-auto bg-[#FFFFFF] rounded-[10px] drop-shadow-lg hover:bg-gray-50 transition-colors duration-150 border border-transparent hover:border-[#DC8801]">
          <img
            className="max-w-full max-h-full object-contain pointer-events-none"
            src="/src/assets/icons/notification-bell.png"
            alt="notification bell"
          />
        </div>
        {unreadCount > 0 && (
          <div className="absolute -top-2 -left-3 bg-[#DC8801] w-[20px] h-[23px] rounded-full flex items-center justify-center pointer-events-none">
            <span className="text-[#FFF] text-xs font-medium">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          </div>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="absolute top-full right-0 mt-2 bg-white border border-[#DC8801] rounded-[10px] w-[320px] z-[9999] shadow-lg max-h-[400px] overflow-y-auto transition-all duration-200 opacity-100 scale-100"
          onClick={(e) => e.stopPropagation()}
        >
          {!Array.isArray(notifications) || notifications.length === 0 ? (
            <div className="p-4 text-center">
              <p className="text-[#2F2F2F] text-sm">No notifications</p>
              <p className="text-gray-400 text-xs mt-1">
                We'll notify you when there's something new!
              </p>
            </div>
          ) : (
            <>
              {/* Header with actions */}
              {unreadCount > 0 && (
                <div className="p-3 border-b border-gray-200 bg-gray-50">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      user?.user_id && markAllNotificationsAsRead(user.user_id);
                    }}
                    className="text-xs text-[#DC8801] hover:text-[#b6761a] font-medium transition-colors"
                  >
                    Mark all as read
                  </button>
                </div>
              )}

              {/* Notifications List */}
              {notifications.map((notif) => (
                <div
                  key={notif.notification_id}
                  className={`p-3 border-b border-gray-200 flex flex-col gap-1 transition-colors ${
                    notif.is_read ? "bg-white" : "bg-[#FFFCF6]"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 pr-2">
                      <p
                        className={`text-sm ${
                          notif.is_read
                            ? "text-gray-600"
                            : "text-[#2F2F2F] font-medium"
                        }`}
                      >
                        {notif.message}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-400">
                          {new Date(notif.created_at).toLocaleString()}
                        </span>
                        {notif.type && (
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              notif.type === "donation_approved"
                                ? "bg-green-100 text-green-600"
                                : notif.type === "donation_rejected"
                                ? "bg-red-100 text-red-600"
                                : notif.type === "donation_submitted"
                                ? "bg-blue-100 text-blue-600"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {notif.type.replace("_", " ")}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 ml-2">
                      {!notif.is_read && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsRead(notif.notification_id);
                          }}
                          className="w-[20px] h-[20px] rounded-[15px] p-1 hover:bg-[#b6b6b6] transition-colors"
                          title="Mark as read"
                        >
                          <img
                            src="/src/assets/icons/mark_as_read.png"
                            alt="mark as read"
                            className="w-full h-full object-contain pointer-events-none"
                          />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNotification(notif.notification_id);
                        }}
                        className="w-[21px] h-[21px] p-[2px] rounded-[12px] hover:bg-[#cdcdcd] transition-colors"
                        title="Delete notification"
                      >
                        <img
                          src="/src/assets/icons/trash-bin.png"
                          alt="delete notification"
                          className="w-full h-full object-contain pointer-events-none"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
