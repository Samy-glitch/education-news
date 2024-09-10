import CustomCursor from "@/components/shared/CustomCursor";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/authContext";
import { getInitials } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Landing = () => {
  const { user, isAuthenticated } = useUserContext();
  const [isCursorHover, setIsCursorHover] = useState<boolean>(false);
  const navigate = useNavigate();

  return (
    <div className="w-full bg-white text-gray-900 flex flex-col overflow-y-scroll hidden-scrpllbar">
      <CustomCursor isCursorHover={isCursorHover} />
      <div className="min-h-screen">
        <header className="flex w-full flex-col gap-3 p-3 md:h-16 md:flex-row md:items-center lg:px-4 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="w-full flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="flex items-center cursor-default">
                <svg
                  className="h-4 w-4 mr-2 md:h-6 md:w-6"
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
                <span className="text-sm md:text-lg font-semibold tracking-tighter">
                  Education News
                </span>
              </div>
            </div>
            <div className="ml-auto flex items-center gap-2 sm:gap-4">
              {isAuthenticated && (
                <Link
                  to={`/profile/${user.uid}`}
                  onMouseEnter={() => setIsCursorHover(true)}
                  onMouseLeave={() => setIsCursorHover(false)}
                >
                  <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                    <AvatarImage
                      src={user.photoURL}
                      alt="Avatar"
                      className="object-cover"
                    />
                    <AvatarFallback>
                      {getInitials(user.displayName)}
                    </AvatarFallback>
                  </Avatar>
                </Link>
              )}
            </div>
          </div>
        </header>
        <div className="h-full flex items-center justify-center md:flex-1 md:block md:h-auto">
          <div className="relative mb-4 flex  items-center justify-center py-[26vh] pt-[18vh] text-gray-900 sm:pt-[26vh]">
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
              <div className="relative mb-72 size-full w-full sm:mb-0 h-full">
                <img
                  className="pointer-events-none absolute inset-0 -translate-x-2 select-none h-full w-full text-transparent sm:translate-x-0"
                  src="/assets/images/landing-background.svg"
                />
              </div>
            </div>
            <div className="relative flex w-full flex-col items-center gap-6 px-6 text-center cursor-default">
              <div className="flex w-full flex-col items-center gap-1.5">
                <svg
                  className="h-24 w-24"
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
                <h2 className="text-4xl font-semibold tracking-tighter sm:text-5xl [@media(max-width:480px)]:text-[2rem]">
                  Education News
                </h2>
                <p>Your Source for Educational Updates & Resources.</p>
              </div>
              <div className="mt-24">
                <div className="w-fit flex items-center gap-8">
                  <Button
                    className="arrow-button bg-white hover:bg-gray-50 border p-6 rounded-full transition-colors flex gap-2 w-fit text-black-text"
                    onClick={() => {
                      if (isAuthenticated) {
                        navigate("/home");
                      } else {
                        navigate("/sign-up");
                      }
                    }}
                    onMouseEnter={() => setIsCursorHover(true)}
                    onMouseLeave={() => setIsCursorHover(false)}
                  >
                    {isAuthenticated ? "Home" : "Sign In"}
                    <ChevronRight className="arrow" />
                  </Button>
                  {!isAuthenticated && (
                    <Link
                      to="/home"
                      className="hover-underline text-black-text"
                      onMouseEnter={() => setIsCursorHover(true)}
                      onMouseLeave={() => setIsCursorHover(false)}
                    >
                      Home
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="min-h-[100vh]"></div> */}
    </div>
  );
};

export default Landing;
