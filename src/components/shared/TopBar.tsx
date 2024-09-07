import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useUserContext } from "@/context/authContext";
import { BellIcon, SearchIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getInitials } from "@/lib/utils";
import { Input } from "../ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const TopBar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useUserContext();
  const [search, setSearch] = useState<string>("");
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (screen.width < 525) {
      navigate("/search?q=");
      return;
    }

    if (isSearchOpen && search.trim() !== "") {
      navigate(`/search?q=${search}`);
      setIsSearchOpen(false);
      setSearch("");
    } else {
      setSearch("");
      setIsSearchOpen(!isSearchOpen);
    }
  };

  return (
    <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b bg-background px-4 md:px-6 overflow-hidden">
      <Link
        to="/home"
        className={`flex items-center md:gap-2 h-14 ${
          isSearchOpen && "max-cs:w-0"
        }`}
      >
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
      </Link>
      <div className="flex items-center gap-2">
        <form
          className={`flex items-center rounded-full ${
            isSearchOpen ? "border" : ""
          }`}
          onSubmit={handleSearch}
        >
          <Input
            placeholder="Search..."
            className={`border-0 transition-all w-0 md:w-auto md:min-w-[350px] ${
              !isSearchOpen &&
              "translate-x-[100%] pointer-events-none opacity-0"
            }`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full min-w-[36px]"
            type="submit"
          >
            <SearchIcon className="h-5 w-5" />
          </Button>
        </form>
        <Sheet>
          <SheetTrigger>
            <div className="rounded-full min-w-[36px] w-9 h-9 flex items-center justify-center transition-colors hover:bg-muted">
              <BellIcon className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </div>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Notifications</SheetTitle>
              <SheetDescription>No new notifications.</SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>

        <div className="md:hidden">
          {isAuthenticated ? (
            <Link to={`/profile/${user.id}`}>
              <Avatar className="h-8 w-8 overflow-hidden rounded-full border">
                <AvatarImage
                  src={user.imageUrl}
                  alt="Avatar"
                  className="object-cover"
                />
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              </Avatar>
            </Link>
          ) : (
            <Button
              onClick={() => {
                navigate("/sign-up");
              }}
            >
              <p>{localStorage.getItem("oldUser") ? "Sign In" : "Sign Up"}</p>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;
