import { type ClassValue, clsx } from "clsx";
import { Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

export function formatDateString(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString("en-US", options);

  const time = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${formattedDate} at ${time}`;
}

//
export const multiFormatDateString = (timestamp: string = ""): string => {
  const timestampNum = Math.round(new Date(timestamp).getTime() / 1000);
  const date: Date = new Date(timestampNum * 1000);
  const now: Date = new Date();

  const diff: number = now.getTime() - date.getTime();
  const diffInSeconds: number = diff / 1000;
  const diffInMinutes: number = diffInSeconds / 60;
  const diffInHours: number = diffInMinutes / 60;
  const diffInDays: number = diffInHours / 24;

  switch (true) {
    case Math.floor(diffInDays) >= 30:
      return formatDateString(timestamp);
    case Math.floor(diffInDays) === 1:
      return `${Math.floor(diffInDays)} day ago`;
    case Math.floor(diffInDays) > 1 && diffInDays < 30:
      return `${Math.floor(diffInDays)} days ago`;
    case Math.floor(diffInHours) >= 1:
      return `${Math.floor(diffInHours)} hours ago`;
    case Math.floor(diffInMinutes) >= 1:
      return `${Math.floor(diffInMinutes)} minutes ago`;
    default:
      return "Just now";
  }
};

export function timeAgo(timestamp: number | string | Timestamp): string {
  const now = new Date().getTime();
  let difference: number;

  if (typeof timestamp === "number") {
    difference = now - timestamp;
  } else if (typeof timestamp === "string") {
    difference = now - new Date(timestamp).getTime();
  } else if (timestamp instanceof Timestamp) {
    difference = now - timestamp.toDate().getTime();
  } else {
    return "unknown date";
  }

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;

  if (difference < minute) {
    return "just now";
  } else if (difference < hour) {
    const minutes = Math.floor(difference / minute);
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else if (difference < day) {
    const hours = Math.floor(difference / hour);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (difference < week) {
    const days = Math.floor(difference / day);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else {
    const nowDate = new Date(now);
    let timestampDate: Date;

    if (typeof timestamp === "number") {
      timestampDate = new Date(timestamp);
    } else if (typeof timestamp === "string") {
      timestampDate = new Date(timestamp);
    } else {
      timestampDate = timestamp.toDate();
    }

    const yearsDifference = nowDate.getFullYear() - timestampDate.getFullYear();
    const monthsDifference =
      nowDate.getMonth() - timestampDate.getMonth() + yearsDifference * 12;

    if (monthsDifference === 0) {
      const weeks = Math.floor(difference / week);
      return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
    } else if (monthsDifference < 12) {
      return `${monthsDifference} month${monthsDifference > 1 ? "s" : ""} ago`;
    } else {
      const years = Math.floor(monthsDifference / 12);
      return `${years} year${years > 1 ? "s" : ""} ago`;
    }
  }
}

export const formatTimestamp = (timestamp: number | Timestamp): string => {
  let date: Date;

  if (typeof timestamp === "number") {
    date = new Date(timestamp);
  } else if (timestamp instanceof Timestamp) {
    date = timestamp.toDate();
  } else {
    return "unknown date";
  }

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12;

  const formattedDate = `${month}/${day}/${year}`;
  const formattedTime = `${hours}:${minutes}:${seconds} ${ampm}`;

  return `${formattedDate} ${formattedTime}`;
};

export const formatNumber = (num: number): string => {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "m";
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
  }
  return num.toString();
};

export const formatDate = (input: number | string | Timestamp): string => {
  if (input instanceof Timestamp) {
    const date = input.toDate();
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } else if (typeof input === "number") {
    const date = new Date(input);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  return input;
};

export const getInitials = (name: string): string => {
  return name
    .trim()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("")
    .substring(0, 2);
};

export const checkIsLiked = (likeList: string[], userId: string) => {
  return likeList.includes(userId);
};

export const useOnScreen = (
  ref: React.RefObject<Element>,
  rootMargin: string = "0px",
  root: Element | null = null
) => {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        console.log("IntersectionObserver entry:", entry);
        setIntersecting(entry.isIntersecting);
      },
      {
        root,
        rootMargin,
      }
    );

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [ref, rootMargin, root]);

  return isIntersecting;
};

export const useIsPWAInstalled = (): boolean => {
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const checkInstallationStatus = () => {
      // Check if the app is running as a PWA
      const isStandalone = window.matchMedia(
        "(display-mode: standalone)"
      ).matches;
      const isNavigatorStandalone = (window.navigator as any).standalone;

      setIsInstalled(isStandalone || isNavigatorStandalone);
    };

    checkInstallationStatus();

    // Optionally listen for changes in display mode
    window.addEventListener("beforeinstallprompt", checkInstallationStatus);
    window.addEventListener("appinstalled", checkInstallationStatus);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        checkInstallationStatus
      );
      window.removeEventListener("appinstalled", checkInstallationStatus);
    };
  }, []);

  return isInstalled;
};
