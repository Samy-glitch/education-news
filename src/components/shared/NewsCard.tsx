import { useUserContext } from "@/context/authContext";
import { INewses } from "@/types";
import { Link } from "react-router-dom";
import NewsStats from "./NewsStats";
import { Badge } from "../ui/badge";
import { timeAgo } from "@/lib/utils";

export const NewsCard = ({ news }: { news: INewses }) => {
  const { user } = useUserContext();
  return (
    <Link
      to={`/news-details/${news.id}`}
      key={news.id}
      className="news-bg-group"
    >
      <img
        src={news.image || "/assets/images/news-placeholder.png"}
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
                {news.title}
              </h3>
              <NewsStats
                news={news}
                userId={user.uid}
                className="absolute right-0 top-0 px-4 py-1 bg-muted/60 shadow rounded-md"
              />
            </div>
            <div className="mt-2 text-muted-foreground text-sm md:text-base">
              {news.type !== "board" ? (
                <Badge variant="outline" className="capitalize rounded-md">
                  {news.type}
                </Badge>
              ) : (
                <Badge variant="secondary" className="capitalize rounded-md">
                  {news.type}
                </Badge>
              )}{" "}
              {timeAgo(news.date)}{" "}
            </div>
          </div>
        </div>
        <div className="mt-2 text-muted-foreground line-clamp-2 text-sm">
          {news.description}
        </div>
      </div>
      <div className="news-bg" />
    </Link>
  );
};
