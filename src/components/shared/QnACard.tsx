import { IQnA, IUploder } from "@/types";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getInitials, timeAgo } from "@/lib/utils";
import { useGetUserById } from "@/lib/react-query/queriesAndMutations";
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
import { DotsVerticalIcon, Pencil2Icon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import { useUserContext } from "@/context/authContext";
import { AlertCircle, Copy, Dot, Forward } from "lucide-react";
import { toast } from "../ui/use-toast";
import { QnAStats } from "./QnAStats";
import { Badge } from "../ui/badge";

const QnACard = ({ qna }: { qna: IQnA }) => {
  const { user } = useUserContext();
  const [uploader, setUploder] = useState<IUploder | null>(null);

  if (!qna.uploadedBy) return;

  const { data /* error, isLoading */ } = useGetUserById(qna.uploadedBy);

  useEffect(() => {
    if (data) {
      setUploder(data);
    }
  }, [data]);

  const link = window.location.origin + "/question/" + qna.id;

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
    <div className="flex flex-col relative rounded-md transition-colors border hover:border-transparent hover:bg-muted/40 p-2 max-w-[750px]">
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
                <span>{timeAgo(qna.date)}</span>
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
            {uploader?.uid === user.id ? (
              <>
                <DropdownMenuItem>
                  <Pencil2Icon className="mr-2 h-4 w-4" />
                  <span>Edit</span>
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuItem>
                  <AlertCircle className="mr-2 h-4 w-4" />
                  <span>Report</span>
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Forward className="mr-2 h-4 w-4" />
                <span>Share</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem onClick={() => copylink()}>
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
        <Link to={`/question/${qna.id}`}>
          <h1 className="text-base md:text-xl">{qna.title}</h1>
          <div className="flex flex-wrap gap-2 mt-2">
            {qna.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="rounded-md text-muted-foreground"
              >
                {tag}
              </Badge>
            ))}
          </div>
          {qna.image && (
            <div className="w-full pt-4">
              <img src={qna.image} className="w-full h-full rounded-md" />
            </div>
          )}
        </Link>
      </div>
      <QnAStats qna={qna} userId={user.id} />
    </div>
  );
};

export default QnACard;
