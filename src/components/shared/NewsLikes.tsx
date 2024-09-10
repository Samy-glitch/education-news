import { useLikeNews } from "@/lib/react-query/queriesAndMutations";
import { checkIsLiked, cn, formatNumber } from "@/lib/utils";
import { INews } from "@/types";
import { Heart } from "lucide-react";
import React, { useRef, useState } from "react";
import { ClassNameValue } from "tailwind-merge";
import { toast } from "../ui/use-toast";

type NewsProps = {
  news: INews;
  newsId: string;
  userId: string;
  className?: ClassNameValue;
};

const NewsLikes = ({ news, newsId, userId, className }: NewsProps) => {
  const likesList = news.likes;

  const { mutate: likeNews } = useLikeNews();

  const [likes, setLikes] = useState(likesList);
  const likeButtonRef = useRef<SVGSVGElement | null>(null);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();

    if (!userId) {
      toast({ description: "Please log in to like news." });
      return;
    }
    let newLikes = [...likes];
    const hasLiked = newLikes.includes(userId);

    if (hasLiked) {
      likeButtonRef.current?.classList.remove("likePulse");
      newLikes = newLikes.filter((id) => id !== userId);
    } else {
      likeButtonRef.current?.classList.add("likePulse");
      newLikes.push(userId);
    }

    setLikes(newLikes);
    likeNews({ newsId: newsId, likesArray: newLikes });
  };

  return (
    <div
      className={cn(
        "flex items-center gap-1 md:gap-2 pt-1 pr-1 md:pr-4",
        className
      )}
    >
      <Heart
        ref={likeButtonRef}
        className="h-4 w-4 md:h-6 md:w-6 cursor-pointer"
        onClick={handleLike}
        fill={checkIsLiked(likes, userId) ? "red" : "none"}
        stroke={checkIsLiked(likes, userId) ? "none" : "currentColor"}
      />
      <span>{formatNumber(likes.length)}</span>
    </div>
  );
};

export default NewsLikes;
