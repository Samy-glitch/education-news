import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { useUserContext } from "@/context/authContext";
import {
  useGetPostsByUser,
  useGetUserById,
  useSignOutAccountMutation,
} from "@/lib/react-query/queriesAndMutations";
import { formatDate, getInitials } from "@/lib/utils";
import {
  AlertCircle,
  Copy,
  Forward,
  LogOut,
  QrCode,
  Settings2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { QRCodeDialog } from "@/components/shared/Dialogs";
import PostCard from "@/components/shared/PostCard";
import PostSkeleton from "@/components/skeletons/PostSkeleton";
import { IUser } from "@/types";
import PostCardById from "@/components/shared/PostCardById";

const Profile = () => {
  const { id } = useParams();
  const { data, error, isLoading } = useGetUserById(id || "");
  const {
    data: posts,
    isLoading: isPostsLoading,
    isError: isPostsError,
  } = useGetPostsByUser(id || "");
  const { user: currentUser } = useUserContext();
  const { mutate: signOut, isSuccess } = useSignOutAccountMutation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) {
      navigate("/sign-in");
    }
  }, [isSuccess]);

  const [user, setUser] = useState<IUser | null>(null);
  const [profilePrivew, setProfilePrivew] = useState(false);
  const [qrCodeDialog, setQrCodeDialog] = useState(false);
  const [logOutDialog, setLogOutDialog] = useState(false);

  useEffect(() => {
    if (data) {
      setUser(data);
    }
    if (error) {
      console.log(error);
    }
  }, [data]);

  const link = window.location.origin + "/profile/" + id;
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

  const TabValue = () => {
    if (currentUser.uid !== id) {
      return "posts";
    } else {
      return undefined;
    }
  };

  return (
    <div className="grid gap-6">
      <div className="border-0">
        <div className="p-4">
          <div className="flex md:items-center flex-col md:flex-row justify-between">
            <div className="flex items-center gap-4 md:gap-6 font-onest">
              <a
                onClick={() => setProfilePrivew(true)}
                className="cursor-pointer hover:opacity-80 transition-opacity relative"
              >
                <Avatar className="h-20 w-20 overflow-hidden rounded-full border">
                  <AvatarImage src={user?.photoURL} alt="Avatar" />
                  <AvatarFallback>
                    {getInitials(user?.displayName || "")}
                  </AvatarFallback>
                </Avatar>
              </a>
              <div className="grid gap-1.5">
                {isLoading ? (
                  <>
                    <Skeleton className="h-6 w-[180px] md:w-[250px]" />
                    <Skeleton className="h-4 w-[100px]" />
                  </>
                ) : (
                  <>
                    <div className="text-xl font-semibold">
                      {user?.displayName}
                    </div>
                    <div className="text-base text-muted-foreground">
                      {user?.displayName}
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0 ml-auto md:ml-0">
              {currentUser.uid === id && (
                <Button
                  className="w-fit"
                  onClick={() => navigate(`/edit-profile/${currentUser.uid}`)}
                  variant="outline"
                >
                  Edit Profile
                </Button>
              )}
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="fill-foreground px-2 outline-none"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="inherit"
                    >
                      <path d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z" />
                    </svg>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuGroup>
                    {currentUser.uid === id && (
                      <DropdownMenuItem onClick={() => navigate("/settings")}>
                        <Settings2 className="mr-2 h-4 w-4" />
                        <span>Preferences</span>
                      </DropdownMenuItem>
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
                          <DropdownMenuItem
                            onClick={() => setQrCodeDialog(true)}
                          >
                            <QrCode className="mr-2 h-4 w-4" />
                            <span>QR Code</span>
                          </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                    {currentUser.uid !== id && (
                      <DropdownMenuItem>
                        <AlertCircle className="mr-2 h-4 w-4" />
                        <span>Report</span>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuGroup>
                  {currentUser.uid === id && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setLogOutDialog(true)}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        <div>
          {isLoading ? (
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Skeleton className="h-6 w-[120px]" />
                <Skeleton className="h-5 w-[180px]" />
              </div>
              <div className="grid gap-2">
                <Skeleton className="h-6 w-[120px]" />
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Skeleton className="h-5 w-[50px]" />
                  <Skeleton className="h-5 w-[50px]" />
                </div>
              </div>
              <div className="grid gap-2">
                <Skeleton className="h-6 w-[120px]" />
                <Skeleton className="h-5 w-[180px]" />
              </div>
            </div>
          ) : (
            <div className="grid gap-4">
              {currentUser.badges && currentUser.badges.length > 0 && (
                <>
                  <div className="grid gap-2">
                    <h3 className="text-lg font-semibold">Badges</h3>
                    <div className="flex gap-2">
                      {currentUser.badges.map((badge) => (
                        <Badge className="cursor-default" key={badge}>
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
              {user?.bio && (
                <>
                  <div className="grid gap-2">
                    <h3 className="text-lg font-semibold">About</h3>
                    <p className="text-muted-foreground line-clamp-6">
                      {user.bio}
                    </p>
                  </div>
                </>
              )}
              <div className="grid gap-2">
                <h3 className="text-lg font-semibold">Joined</h3>
                <div className="text-muted-foreground">
                  {formatDate(user?.date)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Separator className="hidden md:block" />
      <div className="border-0">
        <div className="p-4">
          <Tabs defaultValue="posts" className="w-full" value={TabValue()}>
            <TabsList className="mb-2 md:mb-4">
              <TabsTrigger value="posts">Posts</TabsTrigger>
              {currentUser.uid === id && (
                <TabsTrigger value="saved">Saved Posts</TabsTrigger>
              )}
            </TabsList>
            <Separator className="md:hidden my-2" />
            <TabsContent value="posts">
              <div className="flex flex-col gap-4">
                {isPostsLoading || isPostsError ? (
                  <>
                    <PostSkeleton />
                    <PostSkeleton />
                  </>
                ) : posts && posts.length > 0 ? (
                  posts.map((post) => <PostCard post={post} key={post.id} />)
                ) : (
                  <div className="h-[20vh] w-full flex items-center justify-center">
                    <p className="text-muted-foreground">No posts yet.</p>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="saved">
              <div className="flex flex-col gap-4">
                {user?.savedPosts && user.savedPosts.length > 0 ? (
                  user.savedPosts.map((postId) => (
                    <PostCardById key={postId} postId={postId} />
                  ))
                ) : (
                  <div className="h-[20vh] w-full flex items-center justify-center">
                    <p className="text-muted-foreground">No posts saved.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <QRCodeDialog
        open={qrCodeDialog}
        onOpenChange={setQrCodeDialog}
        link={link}
      />
      <Dialog open={logOutDialog} onOpenChange={setLogOutDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Log Out</DialogTitle>
            <DialogDescription>Do you want to log out?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                variant="secondary"
                className="mt-4 md:mt-0"
              >
                Close
              </Button>
            </DialogClose>
            <Button onClick={() => signOut()}>Log out</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={profilePrivew} onOpenChange={setProfilePrivew}>
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <DialogContent className="sm:max-w-[425px] bg-transparent border-0">
          <div>
            <img
              src={user?.photoURL}
              alt={user?.displayName}
              width={400}
              height={400}
              className="rounded-full object-cover"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
