import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  useGetUserById,
  useSignOutAccountMutation,
} from "@/lib/react-query/queriesAndMutations";
import { formatDate, getInitials } from "@/lib/utils";
import {
  AlertCircle,
  Copy,
  Forward,
  LogOut,
  MessageCircleIcon,
  QrCode,
  Settings2,
  ThumbsUpIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { QRCodeDialog } from "@/components/shared/Dialogs";

const Profile = () => {
  const { id } = useParams();
  const { data, error, isLoading } = useGetUserById(id || "");
  const { user: currentUser } = useUserContext();
  const { mutate: signOut, isSuccess } = useSignOutAccountMutation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) {
      navigate("/sign-in");
    }
  }, [isSuccess]);

  const [displayName, setDisplayName] = useState("");
  const [userName, setUserName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [date, setDate] = useState("");
  const [bio, setBio] = useState("");
  const [profilePrivew, setProfilePrivew] = useState(false);
  const [qrCodeDialog, setQrCodeDialog] = useState(false);
  const [logOutDialog, setLogOutDialog] = useState(false);

  useEffect(() => {
    if (data) {
      setDisplayName(data.displayName || "");
      setUserName(data.userName || "");
      setImageUrl(data.photoURL || "");
      setDate(data.date || "");
      setBio(data.bio || "");
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

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <div className="flex md:items-center flex-col md:flex-row justify-between">
            <div className="flex items-center gap-4 md:gap-6 font-onest">
              <a
                onClick={() => setProfilePrivew(true)}
                className="cursor-pointer hover:opacity-80 transition-opacity relative"
              >
                <Avatar className="h-20 w-20 overflow-hidden rounded-full border">
                  <AvatarImage src={imageUrl} alt="Avatar" />
                  <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
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
                    <div className="text-xl font-semibold">{displayName}</div>
                    <div className="text-base text-muted-foreground">
                      {userName}
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0 ml-auto md:ml-0">
              {currentUser.id === id && (
                <Button
                  className="w-fit"
                  onClick={() => navigate(`/edit-profile/${currentUser.id}`)}
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
                    {currentUser.id === id && (
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
                    {currentUser.id !== id && (
                      <DropdownMenuItem>
                        <AlertCircle className="mr-2 h-4 w-4" />
                        <span>Report</span>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuGroup>
                  {currentUser.id === id && (
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
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Skeleton className="h-6 w-[120px]" />
                <Skeleton className="h-5 w-[180px]" />
              </div>
              <Separator />
              <div className="grid gap-2">
                <Skeleton className="h-6 w-[120px]" />
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Skeleton className="h-5 w-[50px]" />
                  <Skeleton className="h-5 w-[50px]" />
                </div>
              </div>
              <Separator />
              <div className="grid gap-2">
                <Skeleton className="h-6 w-[120px]" />
                <Skeleton className="h-5 w-[180px]" />
              </div>
            </div>
          ) : (
            <div className="grid gap-4">
              {currentUser.badges && (
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
                  <Separator />
                </>
              )}
              {bio && (
                <>
                  <div className="grid gap-2">
                    <h3 className="text-lg font-semibold">About</h3>
                    <p className="text-muted-foreground line-clamp-6">{bio}</p>
                  </div>
                  <Separator />
                </>
              )}
              <div className="grid gap-2">
                <h3 className="text-lg font-semibold">Joined</h3>
                <div className="text-muted-foreground">{formatDate(date)}</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <Card>
        {isLoading ? (
          <CardHeader>
            <CardTitle className="mb-8">
              <Skeleton className="h-8 w-[70px]" />
            </CardTitle>
            <div className="grid gap-4">
              <div className="flex items-start gap-4">
                <Skeleton className="h-10 w-10 overflow-hidden rounded-full" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <Skeleton className="h-6 w-[250px] md:w-[300px]" />
                      <div className="mt-2 flex gap-2">
                        <Skeleton className="h-5 w-[50px]" />
                        <Skeleton className="h-5 w-[80px]" />
                        <Skeleton className="h-5 w-[70px]" />
                      </div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <Skeleton className="h-4 w-[250px]" />
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Skeleton className="h-10 w-10 overflow-hidden rounded-full" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <Skeleton className="h-6 w-[280px] md:w-[350px]" />
                      <div className="mt-2 flex gap-2">
                        <Skeleton className="h-5 w-[70px]" />
                        <Skeleton className="h-5 w-[50px]" />
                        <Skeleton className="h-5 w-[80px]" />
                      </div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
        ) : (
          <CardHeader>
            <Tabs defaultValue="qa" className="w-full">
              <TabsList className="border-b">
                <TabsTrigger value="qa">Q&A</TabsTrigger>
                {currentUser.id === id && (
                  <TabsTrigger value="saved">Saved Q&A</TabsTrigger>
                )}
              </TabsList>
              <TabsContent value="qa">
                <div className="grid gap-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10 overflow-hidden rounded-full border">
                      <AvatarImage
                        src="/assets/icons/profile-placeholder.svg"
                        alt="Avatar"
                      />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">
                            How to implement a custom pagination component in
                            React?
                          </h3>
                          <div className="mt-2 flex gap-2">
                            <Badge variant="outline">react</Badge>
                            <Badge variant="outline">pagination</Badge>
                            <Badge variant="outline">frontend</Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <ThumbsUpIcon className="h-4 w-4" />
                          <span>42</span>
                          <MessageCircleIcon className="h-4 w-4" />
                          <span>12</span>
                        </div>
                      </div>
                      <div className="mt-2 text-muted-foreground">
                        Asked 2 hours ago by{" "}
                        <Link to="#" className="font-medium hover:underline">
                          John Doe
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10 overflow-hidden rounded-full border">
                      <AvatarImage
                        src="/assets/icons/profile-placeholder.svg"
                        alt="Avatar"
                      />
                      <AvatarFallback>SA</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">
                            Best practices for writing clean and maintainable
                            SQL queries
                          </h3>
                          <div className="mt-2 flex gap-2">
                            <Badge variant="outline">sql</Badge>
                            <Badge variant="outline">database</Badge>
                            <Badge variant="outline">performance</Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <ThumbsUpIcon className="h-4 w-4" />
                          <span>68</span>
                          <MessageCircleIcon className="h-4 w-4" />
                          <span>24</span>
                        </div>
                      </div>
                      <div className="mt-2 text-muted-foreground">
                        Asked 1 day ago by{" "}
                        <Link to="#" className="font-medium hover:underline">
                          Sarah Anderson
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="saved">
                <div className="grid gap-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10 overflow-hidden rounded-full border">
                      <AvatarImage
                        src="/assets/icons/profile-placeholder.svg"
                        alt="Avatar"
                      />
                      <AvatarFallback>MJ</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">
                            Optimizing React component performance with
                            memoization
                          </h3>
                          <div className="mt-2 flex gap-2">
                            <Badge variant="outline">react</Badge>
                            <Badge variant="outline">performance</Badge>
                            <Badge variant="outline">optimization</Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <ThumbsUpIcon className="h-4 w-4" />
                          <span>92</span>
                          <MessageCircleIcon className="h-4 w-4" />
                          <span>18</span>
                        </div>
                      </div>
                      <div className="mt-2 text-muted-foreground">
                        Asked 3 days ago by{" "}
                        <Link to="#" className="font-medium hover:underline">
                          Michael Johnson
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10 overflow-hidden rounded-full border">
                      <AvatarImage
                        src="/assets/icons/profile-placeholder.svg"
                        alt="Avatar"
                      />
                      <AvatarFallback>EW</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">
                            Implementing a real-time chat application with
                            WebSockets
                          </h3>
                          <div className="mt-2 flex gap-2">
                            <Badge variant="outline">websockets</Badge>
                            <Badge variant="outline">chat</Badge>
                            <Badge variant="outline">real-time</Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <ThumbsUpIcon className="h-4 w-4" />
                          <span>74</span>
                          <MessageCircleIcon className="h-4 w-4" />
                          <span>32</span>
                        </div>
                      </div>
                      <div className="mt-2 text-muted-foreground">
                        Asked 1 week ago by{" "}
                        <Link to="#" className="font-medium hover:underline">
                          Emily Wilson
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardHeader>
        )}
      </Card>
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
              src={imageUrl}
              alt={displayName}
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
