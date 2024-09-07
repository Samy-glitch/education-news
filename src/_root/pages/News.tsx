import NewsStats from "@/components/shared/NewsStats";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserContext } from "@/context/authContext";
import { useGetRecentNews } from "@/lib/react-query/queriesAndMutations";
import { timeAgo } from "@/lib/utils";
import { useState } from "react";
import { Link } from "react-router-dom";

const News = () => {
  const { user } = useUserContext();

  const [filter, setFilter] = useState("");

  const {
    data: news,
    isLoading: isNewsLoading,
    error,
  } = useGetRecentNews(filter);

  const skeletonItems = Array.from({ length: 5 }, (_, index) => ({
    id: index + 1,
  }));

  if (error) {
    return (
      <div className="h-[50vh] w-full flex items-center justify-center">
        <p className="text-muted-foreground">
          No news found. Please check your internet connection.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">News</h2>
        <p className="text-muted-foreground text-sm md:text-base">
          Read the latest articles and insights from our team.
        </p>
        <Separator className="!my-4" />
      </div>
      <div>
        <div className="w-full">
          <div className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground border-b mb-4">
            <button
              value="all"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              onClick={() => {
                if (filter !== "") {
                  setFilter("");
                }
              }}
              data-state={filter === "" && "active"}
            >
              All
            </button>
            <button
              value="board"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              onClick={() => {
                if (filter !== "board") {
                  setFilter("board");
                }
              }}
              data-state={filter === "board" && "active"}
            >
              Board
            </button>
            <button
              value="other"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              onClick={() => {
                if (filter !== "other") {
                  setFilter("other");
                }
              }}
              data-state={filter === "other" && "active"}
            >
              Other
            </button>
          </div>
          <div>
            <div className="grid gap-10 pt-4">
              {isNewsLoading || !news
                ? skeletonItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-4 overflow-visible relative pl-4 last:mb-4"
                    >
                      <Skeleton className="h-24 w-24 rounded-md object-cover shadow-md aspect-square" />
                      <div className="flex-1">
                        <Skeleton className="absolute right-0 top-0 w-32 h-8 bg-muted/60 shadow rounded-md" />
                      </div>
                      <div className="news-bg" />
                    </div>
                  ))
                : news?.map((doc) => (
                    <Link
                      to={`/news-details/${doc.id}`}
                      key={doc.id}
                      className="news-bg-group"
                    >
                      <img
                        src={
                          doc?.image || "/assets/images/news-placeholder.png"
                        }
                        alt="News cover"
                        width={100}
                        height={100}
                        className="h-24 w-24 rounded-md object-cover shadow-md"
                        style={{ aspectRatio: "100/100", objectFit: "cover" }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="w-full">
                            <div className="flex items-start justify-between">
                              <h3 className="text-base md:text-lg font-semibold truncate max-w-[150px] md:max-w-[420px] 2xl:max-w-[600px]">
                                {doc?.title}
                              </h3>
                              <NewsStats
                                news={doc}
                                userId={user.id}
                                className="absolute right-0 top-0 px-4 py-1 bg-muted/60 shadow rounded-md"
                              />
                            </div>
                            <div className="mt-2 text-muted-foreground text-sm md:text-base">
                              {doc.type !== "board" ? (
                                <Badge
                                  variant="outline"
                                  className="capitalize rounded-md"
                                >
                                  {doc?.type}
                                </Badge>
                              ) : (
                                <Badge
                                  variant="secondary"
                                  className="capitalize rounded-md"
                                >
                                  {doc?.type}
                                </Badge>
                              )}{" "}
                              {timeAgo(doc?.date)}{" "}
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 text-muted-foreground line-clamp-2 text-sm">
                          {doc?.description}
                        </div>
                      </div>
                      <div className="news-bg" />
                    </Link>
                  ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default News;
