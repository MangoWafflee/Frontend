import { useEffect } from "react";

const useNotification = () => {
    useEffect(() => {
        if (!("Notification" in window)) {
            console.error("This browser does not support desktop notification");
        } else if (Notification.permission !== "granted") {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    console.log("Notification permission granted.");
                }
            });
        }
    }, []);

    const notify = (title, options) => {
        if (Notification.permission === "granted") {
            new Notification(title, options);
        }
    };

    return notify;
};

export default useNotification;