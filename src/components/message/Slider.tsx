import { SearchIcon, UserPlus2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";

const Slider = () => {
  const [search, setSearch] = useState<string>("");
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  return (
    <div className="flex flex-col flex-[2] xl:flex-[1] md:border-r relative">
      <div className="absolute bottom-6 right-6 p-4 rounded-full cursor-pointer transition-colors bg-muted/60 hover:bg-muted">
        <UserPlus2 />
      </div>
      <div className="p-4 border-b bg-primary-foreground/80 flex items-center justify-between relative min-h-[61px]">
        <span
          className={`text-lg font-bold transition-transform  ${
            isSearchOpen && "-translate-x-[100%] pointer-events-none opacity-0"
          }`}
        >
          Last messaged
        </span>
        <div
          className={`flex items-center rounded-full w-[90%] absolute right-4 top-3 ${
            isSearchOpen ? "border" : ""
          }`}
        >
          <Input
            placeholder="Search..."
            className={`border-0 transition-all w-full ${
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
            aria-label="Search"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <SearchIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-muted-foreground text-sm text-center">
          You haven't messaged anyone yeat.
        </p>
      </div>
    </div>
  );
};

export default Slider;
