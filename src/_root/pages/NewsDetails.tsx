import NewsLikes from "@/components/shared/NewsLikes";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useUserContext } from "@/context/authContext";
import { useGetNewsById } from "@/lib/react-query/queriesAndMutations";
import { formatTimestamp } from "@/lib/utils";
import { INews } from "@/types";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Zoom from "react-medium-image-zoom";
import Latex from "react-latex-next";

const NewsDetails = () => {
  const { id } = useParams();
  const { user } = useUserContext();
  const { data, error, isLoading } = useGetNewsById(id || "");

  const [news, setNews] = useState<INews | null>(null);

  useEffect(() => {
    if (data) {
      setNews(data);
    }
    if (error) {
      console.log(error);
    }
  }, [data, error]);

  if (isLoading || !news || !id) {
    return (
      <div className="h-[50vh] w-full flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="space-y-0.5 relative">
        <h2 className="text-2xl font-bold tracking-tight">{news.title}</h2>
        <div className="text-muted-foreground text-sm md:text-base">
          Uploded on {formatTimestamp(news.date)}
          <Badge
            variant="secondary"
            className="capitalize rounded-md ml-2 md:ml-4"
          >
            {news.type}
          </Badge>
        </div>
        <Separator className="!my-4" />
        <NewsLikes
          news={news}
          newsId={id}
          userId={user.uid}
          className="absolute top-0 right-0 md:text-xl"
        />
      </div>
      <div className="w-full h-full tiptap-content">
        {news.content && <Latex>{news.content}</Latex>}
      </div>
      <div className="flex flex-col">
        {news.images.length > 0 &&
          news.images.map((image) => (
            <div className="md:max-w-[600px] rounded-md" key={image}>
              <Zoom>
                <img src={image} className="w-full h-full" />
              </Zoom>
            </div>
          ))}
      </div>
    </div>
  );
};

export default NewsDetails;
