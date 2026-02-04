import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../hooks/useNotifications";

const NotificationBell = ({ variant = "light" }) => {
  const { notifications, clearAll } = useNotifications();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const unreadCount = notifications.length;

  const baseColor =
    variant === "dark"
      ? "bg-gray-800 hover:bg-gray-700 text-white"
      : "bg-gray-100 hover:bg-gray-200 text-gray-700";

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        className={`relative flex items-center justify-center w-9 h-9 rounded-full ${baseColor}`}
      >
        <span className="text-lg">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-40">
          <div className="px-3 py-2 border-b flex items-center justify-between bg-gray-50">
            <span className="text-sm font-semibold">Notifications</span>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <span className="text-xs text-gray-500">
                  {unreadCount} alert{unreadCount > 1 ? "s" : ""}
                </span>
              )}
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    clearAll();
                    setOpen(false);
                  }}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {unreadCount === 0 && (
              <div className="px-4 py-6 text-center text-sm text-gray-500">
                No notifications right now.
              </div>
            )}

            {notifications.map((n, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setOpen(false);
                  if (n.link) navigate(n.link);
                }}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
              >
                <p className="text-sm font-medium text-gray-800">
                  {n.title}
                </p>
                {n.message && (
                  <p className="mt-0.5 text-xs text-gray-500">
                    {n.message}
                  </p>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;

