import { useLikeQnA } from "@/lib/react-query/queriesAndMutations";
import { checkIsLiked, cn, formatNumber } from "@/lib/utils";
import { IQnA } from "@/types";
import { Heart, MessageCircleIcon } from "lucide-react";
import { useRef, useState } from "react";
import { ClassNameValue } from "tailwind-merge";

export const QnAStats = ({
  qna,
  userId,
  className,
}: {
  qna: IQnA;
  userId: string;
  className?: ClassNameValue;
}) => {
  const likesList = qna.likes;

  const { mutate: likeQna } = useLikeQnA();

  const [likes, setLikes] = useState(likesList);
  const likeButtonRef = useRef<SVGSVGElement | null>(null);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();

    if (userId) {
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
      likeQna({ qnaId: qna.id, likesArray: newLikes });
    }
  };
  return (
    <div className={cn("px-4 pt-5 flex items-center", className)}>
      <div
        className="flex items-center rounded-md border py-2 px-3 cursor-pointer transition-colors hover:bg-muted"
        onClick={handleLike}
      >
        <Heart
          ref={likeButtonRef}
          className="h-5 w-5 mr-2"
          fill={checkIsLiked(likes, userId) ? "red" : "none"}
          stroke={checkIsLiked(likes, userId) ? "none" : "currentColor"}
        />
        <span>{formatNumber(likes.length)}</span>
      </div>
      <div className="flex items-center rounded-md border ml-2 py-2 px-3 cursor-pointer transition-colors hover:bg-muted">
        <MessageCircleIcon className="h-5 w-5 mr-2" />
        <span>{formatNumber(0)}</span>
      </div>
    </div>
  );
};
