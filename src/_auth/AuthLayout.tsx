import { useEffect, useRef, useState } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { gsap } from "gsap";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/config";

const AuthLayout = () => {
  const [isAuth, setIsAuth] = useState(false);
  const location = useLocation();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setIsAuth(true);
    } else {
      setIsAuth(false);
    }
  });

  const imageUrls = [
    "/assets/images/bg.jpg",
    "/assets/images/bg-2.jpg",
    "/assets/images/bg-3.jpg",
    "/assets/images/bg-4.jpg",
    "/assets/images/bg-2.jpg",
  ];
  const imageSrc = imageUrls[Math.floor(Math.random() * imageUrls.length)];
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imageRef.current) {
      gsap.fromTo(imageRef.current, { scale: 1.1 }, { scale: 1, duration: 2 });
    }
  }, []);

  return (
    <>
      {isAuth && location.pathname !== "/set-username" ? (
        <Navigate to="/" />
      ) : (
        <section className="container relative flex h-full flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
          <div className="absolute flex items-center left-4 top-5 md:right-8 md:top-8 lg:hidden">
            <svg
              className="mr-2 h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path
                fill="#1365fe"
                d="M276.43,279.97h173.42c25.39,0,46,20.61,46,46v123.49c0,25.39-20.61,46-46,46h-173.42v-215.49h0Z"
              />
              <path
                fill="#15a0fb"
                d="M125.7,135.75h169.91c22.08,0,40,17.92,40,40V455.45c0,22.08-17.92,40-40,40H125.7V135.75h0Z"
              />
              <rect
                fill="#17ddfe"
                x="16.15"
                y="16.55"
                width="159.83"
                height="478.33"
                rx="32"
                ry="32"
              />
            </svg>
            Education News
          </div>
          {/* dark:border-r */}
          <div className="relative hidden h-full flex-col bg-muted overflow-hidden p-10 text-white  lg:flex">
            <div className="absolute overflow-hidden -m-10 w-full h-full p-4 bg-background">
              <div className="overflow-hidden flex-1 h-full w-full rounded-md">
                <img
                  ref={imageRef}
                  src={imageSrc}
                  className="h-full w-full object-cover  opacity-80 bg-zinc-900"
                  onLoad={() => {
                    if (imageRef.current) {
                      gsap.fromTo(
                        imageRef.current,
                        { scale: 1.1 },
                        { scale: 1, duration: 2 }
                      );
                    }
                  }}
                />
              </div>
            </div>
            <div className="absolute inset-0 " />
            <div className="relative z-20 flex items-center text-lg font-medium">
              {" "}
              {/* bg-zinc-900 */}
              <svg
                className="mr-2 h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path
                  fill="#1365fe"
                  d="M276.43,279.97h173.42c25.39,0,46,20.61,46,46v123.49c0,25.39-20.61,46-46,46h-173.42v-215.49h0Z"
                />
                <path
                  fill="#15a0fb"
                  d="M125.7,135.75h169.91c22.08,0,40,17.92,40,40V455.45c0,22.08-17.92,40-40,40H125.7V135.75h0Z"
                />
                <rect
                  fill="#17ddfe"
                  x="16.15"
                  y="16.55"
                  width="159.83"
                  height="478.33"
                  rx="32"
                  ry="32"
                />
              </svg>
              Education News
            </div>
            <div className="relative z-20 mt-auto">
              <blockquote className="space-y-2">
                <p className="text-lg">
                  &ldquo;This library has saved me countless hours of work and
                  helped me deliver stunning designs to my clients faster than
                  ever before.&rdquo;
                </p>
                <footer className="text-sm">Sofia Davis</footer>
              </blockquote>
            </div>
          </div>
          <Outlet />
        </section>
      )}
    </>
  );
};

export default AuthLayout;
