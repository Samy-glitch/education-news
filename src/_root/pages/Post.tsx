import { useGetPostById } from "@/lib/react-query/queriesAndMutations";
import Latex from "react-latex-next";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatTimestamp } from "@/lib/utils";
import { IPost } from "@/types";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Zoom from "react-medium-image-zoom";
import { useUserContext } from "@/context/authContext";
import { PostStats } from "@/components/shared/PostStats";

const Question = () => {
  const { id } = useParams();
  const { user } = useUserContext();
  const { data, error, isLoading } = useGetPostById(id || "");

  const [post, setPost] = useState<IPost | null>(null);

  useEffect(() => {
    if (data) {
      setPost(data);
    }
    if (error) {
      console.log(error);
    }
  }, [data, error]);

  if (isLoading || !post || !id) {
    return (
      <div className="h-[50vh] w-full flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="space-y-0.5 relative">
        <h2 className="text-2xl font-bold tracking-tight">{post.title}</h2>
        <div className="flex flex-wrap gap-2 py-1">
          {post.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="rounded-md text-muted-foreground"
            >
              {tag}
            </Badge>
          ))}
        </div>
        <div className="text-muted-foreground text-sm md:text-base">
          {formatTimestamp(post.date)}
        </div>
        <Separator className="!my-4" />
      </div>
      <div className="w-full h-full px-4 tiptap-content">
        <Latex>{post.content}</Latex>
      </div>
      <Separator className="!my-4" />
      <div className="flex flex-col">
        {post.images.length > 0 &&
          post.images.map((image) => (
            <div className="md:max-w-[600px] rounded-md" key={image}>
              <Zoom>
                <img src={image} className="w-full h-full" />
              </Zoom>
            </div>
          ))}
      </div>
      <PostStats post={post} userId={user.uid} className="px-0" />
    </div>
  );
};

export default Question;
