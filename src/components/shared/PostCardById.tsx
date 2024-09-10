import { IPost, IUser } from "@/types";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { checkIsSaved, getInitials, timeAgo } from "@/lib/utils";
import {
  useGetPostById,
  useGetUserById,
  useSavePost,
} from "@/lib/react-query/queriesAndMutations";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BookmarkFilledIcon,
  BookmarkIcon,
  DotsVerticalIcon,
  Pencil2Icon,
} from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import { useUserContext } from "@/context/authContext";
import { AlertCircle, Copy, Dot, Forward } from "lucide-react";
import { toast } from "../ui/use-toast";
import { Badge } from "../ui/badge";
import { PostStats } from "./PostStats";
import PostSkeleton from "../skeletons/PostSkeleton";

const PostCardById = ({ postId }: { postId: string }) => {
  const { user } = useUserContext();
  const [uploader, setUploader] = useState<IUser | null>(null);
  const [saves, setSaves] = useState<string[]>([]);
  const { data: postData, isLoading: isPostLoading } = useGetPostById(postId);
  const [post, setPost] = useState<IPost | null>(null);

  useEffect(() => {
    if (postData) {
      setPost(postData);
    }
  }, [postData]);

  const { data: uploaderData } = useGetUserById(post?.uploadedBy || "");
  const { data: currentUserData } = useGetUserById(user?.uid || "");
  const { mutate: savePost } = useSavePost();

  useEffect(() => {
    if (uploaderData) setUploader(uploaderData);
    if (currentUserData) setSaves(currentUserData.savedPosts);
  }, [uploaderData, currentUserData]);

  if (!post || isPostLoading) {
    return <PostSkeleton />;
  }

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();

    if (!user || !user.uid) {
      toast({ description: "Please log in to save posts." });
      return;
    }

    const hasSaved = saves.includes(postId);
    const newSaves = hasSaved
      ? saves.filter((id) => id !== postId)
      : [...saves, postId];

    setSaves(newSaves);
    savePost(
      { userId: user.uid, postsArray: newSaves },
      {
        onError: () => {
          setSaves(
            hasSaved ? [...saves, postId] : saves.filter((id) => id !== postId)
          );
        },
      }
    );
  };

  const link = window.location.origin + "/post/" + postId;

  const copylink = async () => {
    try {
      await navigator.clipboard.writeText(link);
      toast({
        description: "Link copied to clipboard.",
      });
    } catch (err) {
      console.error("Failed to copy: ", err);
      toast({
        description: "Failed to copy the link.",
      });
    }
  };

  return (
    <div className="flex flex-col relative md:rounded-md transition-colors border-t first:border-t-0 md:first:border-t md:border hover:border-transparent md:hover:bg-muted/40 p-2 max-w-[750px]">
      <div className="flex items-center justify-between">
        <Link to={`/profile/${uploader?.uid}`} className="flex items-center">
          <Avatar className="h-8 w-8 overflow-hidden rounded-full border">
            <AvatarImage src={uploader?.photoURL} alt="Avatar" />
            <AvatarFallback>
              {getInitials(String(uploader?.displayName))}
            </AvatarFallback>
          </Avatar>
          <div className="font-onest ml-2">
            <div className="flex text-sm md:text-base">
              <span>{uploader?.displayName}</span>
              <div className="flex text-muted-foreground text-sm">
                <Dot />
                <span>{timeAgo(post.date)}</span>
              </div>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground">
              {uploader?.userName}
            </p>
          </div>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              <DotsVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {uploader?.uid === user.uid && (
              <DropdownMenuItem>
                <Pencil2Icon className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={handleSave}>
              {checkIsSaved(saves, postId) ? (
                <>
                  <BookmarkFilledIcon className="mr-2 h-4 w-4" />
                  <span>Saved</span>
                </>
              ) : (
                <>
                  <BookmarkIcon className="mr-2 h-4 w-4" />
                  <span>Save</span>
                </>
              )}
            </DropdownMenuItem>
            {uploader?.uid !== user.uid && (
              <DropdownMenuItem>
                <AlertCircle className="mr-2 h-4 w-4" />
                <span>Report</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Forward className="mr-2 h-4 w-4" />
                <span>Share</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem onClick={copylink}>
                    <Copy className="mr-2 h-4 w-4" />
                    <span>Copy Link</span>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="px-4 pt-4">
        <Link to={`/post/${postId}`}>
          <h1 className="text-base md:text-xl">{post.title}</h1>
          <div className="flex flex-wrap gap-2 mt-2">
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
          {post.image && (
            <div className="w-full pt-4">
              <img src={post.image} className="w-full h-full rounded-md" />
            </div>
          )}
        </Link>
      </div>
      <PostStats post={post} userId={user.uid} />
    </div>
  );
};

export default PostCardById;
