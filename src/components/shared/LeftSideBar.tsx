import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useUserContext } from "@/context/authContext";
import { sidebarLinks } from "@/constants";
import { INavLink } from "@/types";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getInitials } from "@/lib/utils";

const LeftSideBar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user: currentUser, isAuthenticated } = useUserContext();

  const createRipple = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    const target = e.currentTarget;
    const ripple = target.querySelector(".ripple");

    if (ripple) {
      ripple.remove();
    }

    const circle = document.createElement("div");
    const diameter = Math.max(target.clientWidth, target.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - target.offsetLeft - radius}px`;
    circle.style.top = `${e.clientY - target.offsetTop - radius}px`;
    circle.classList.add("ripple");

    target.appendChild(circle);
  };

  return (
    <aside className="fixed left-0 top-14 bottom-0 z-50 hidden md:flex w-60 flex-col border-r bg-primary-foreground p-4">
      <nav className="flex flex-col gap-2">
        {sidebarLinks.map((link: INavLink) => {
          const isActive = pathname === link.route;
          return (
            <NavLink
              to={link.route}
              key={link.label}
              aria-label={link.label}
              className={`nav-button ${isActive ? "bg-nav-1" : ""}`}
              onClick={createRipple}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-foreground"
              >
                <path fill="inherit" d={link.svg}></path>
              </svg>
              {link.label}
            </NavLink>
          );
        })}
      </nav>
      <div className="mt-auto">
        {isAuthenticated ? (
          <Link
            to={`/profile/${currentUser.id}`}
            className={`flex gap-3 items-center transition-colors hover:bg-nav-2 p-2 rounded-lg ${
              pathname === `/profile/${currentUser.id}` ? "bg-nav-1" : ""
            } ripple-button`}
            onClick={createRipple}
          >
            <Avatar className="h-10 w-10 overflow-hidden rounded-full border">
              <AvatarImage
                src={currentUser.imageUrl}
                alt="Avatar"
                className="object-cover"
              />
              <AvatarFallback>{getInitials(currentUser.name)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col font-onest">
              <p className="text-sm line-clamp-1 text-ellipsis break-anywhere overflow-hidden whitespace-normal">
                {currentUser.name}
              </p>
              {currentUser.username && (
                <p className="text-[12px] text-light-3 line-clamp-1 text-ellipsis break-anywhere overflow-hidden whitespace-normal">
                  {currentUser.username}
                </p>
              )}
            </div>
          </Link>
        ) : (
          <Button
            className="w-full h-10"
            onClick={() => {
              const route = localStorage.getItem("oldUser")
                ? "/sign-in"
                : "/sign-up";
              navigate(route);
            }}
          >
            <p>{localStorage.getItem("oldUser") ? "Sign In" : "Sign Up"}</p>
          </Button>
        )}
      </div>
    </aside>
  );
};

export default LeftSideBar;
