import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const Search = () => {
  const [searchValue, setSearchValue] = useState("");
  const [queryParameters] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParam = queryParameters.get("q");
    if (searchParam) {
      setSearchValue(searchParam);
    }
  }, [queryParameters]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    navigate(`/search?q=${searchValue}`);
  }

  return (
    <div>
      <div
        className={`flex flex-col items-center gap-12 transition-transform ${
          queryParameters.get("q")?.trim() === "" &&
          "h-[60vh] translate-y-[20vh]"
        }`}
      >
        <Link
          className={`flex items-center gap-1.5 ${
            queryParameters.get("q")?.trim() !== "" && "hidden"
          }`}
          to="/home"
        >
          <svg
            className="h-16 w-16"
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
        </Link>
        <div className="w-full flex flex-col items-center">
          <form
            className="w-full flex justify-center gap-2 md:gap-4"
            onSubmit={handleSubmit}
          >
            <div className="flex relative min-h-[44px] border rounded-[24px] w-full max-w-[584px]">
              <div className="flex flex-1 pt-[5px] pr-2 pl-[14px]">
                <div className="flex items-center pr-[13px] -mt-[5px] h-[46px]">
                  <SearchIcon className="w-5 m-auto" />
                </div>
                <div className="flex flex-wrap flex-1 mt-[6px]">
                  <p className="sr-only">Search</p>
                  <input
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck="false"
                    placeholder="Search..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="search-input"
                    maxLength={2048}
                  />
                </div>
              </div>
            </div>
            <Button type="submit" className="search-button">
              Search
            </Button>
          </form>
          <p
            className={`w-full max-w-[670px] mt-1 text-muted-foreground text-xs md:text-base ${
              queryParameters.get("q")?.trim() !== "" && "hidden"
            }`}
          >
            Search for news, books, or Q&As quickly and easily.
          </p>
        </div>
      </div>
      {queryParameters.get("q")?.trim() !== "" && (
        <div className="w-full mt-4 md:mt-8">
          <h3 className="text-base md:text-xl">
            Showing results for{" "}
            <span className="font-bold">{queryParameters.get("q")}:</span>
          </h3>
        </div>
      )}
    </div>
  );
};

export default Search;
