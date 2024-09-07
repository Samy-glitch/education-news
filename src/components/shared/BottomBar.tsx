import { sidebarLinks } from "@/constants";
import { Link, useLocation } from "react-router-dom";

const BottomBar = () => {
  const { pathname } = useLocation();

  return (
    <section className="bottom-bar">
      {sidebarLinks.map((link) => {
        const isActive = pathname === link.route;
        return (
          <Link
            to={link.route}
            key={link.label}
            aria-label={link.label}
            className={`${
              isActive && "bg-nav-1 rounded-md"
            } flex-center flex-col gap-1 p-2 transition`}
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
          </Link>
        );
      })}
    </section>
  );
};

export default BottomBar;
