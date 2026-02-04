import { useEffect, useState } from "react";
import { getMyNotifications, clearMyNotifications } from "../api/notification.api";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await getMyNotifications();
      setNotifications(res.data?.data || []);
    } catch (error) {
      console.error("Notifications fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const id = setInterval(fetchNotifications, 60 * 1000); // refresh every 1 min
    return () => clearInterval(id);
  }, []);

  return {
    notifications,
    loading,
    refresh: fetchNotifications,
    clearAll: async () => {
      try {
        await clearMyNotifications();
        setNotifications([]);
      } catch (error) {
        console.error("Notifications clear error:", error);
      }
    }
  };
};

