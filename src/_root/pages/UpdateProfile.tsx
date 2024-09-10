import ImageUploader from "@/components/shared/imageUploader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUserContext } from "@/context/authContext";
import { auth, db } from "@/lib/firebase/config";
import { useGetUserById } from "@/lib/react-query/queriesAndMutations";
import { getInitials } from "@/lib/utils";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { Camera } from "lucide-react";
import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useUploadUserImage } from "@/lib/react-query/queriesAndMutations";
import { Icons } from "@/components/shared/ui/icons";
import { toast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { DiscardDialog } from "@/components/shared/Dialogs";

const UpdateProfile = () => {
  const { user: currentUser, isAuthenticated } = useUserContext();
  const uploadImageMutation = useUploadUserImage();
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, error } = useGetUserById(id || "");

  const [imageUrl, setImageUrl] = useState<Blob | string>("");
  const [oldDisplayName, setOldDisplayName] = useState("");
  const [oldBio, setOldBio] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [imagePreview, setImagePreview] = useState(false);
  const [cancelPreview, setCancelPreview] = useState(false);
  const [isImageChanged, setIsImageChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (data) {
      setOldDisplayName(data.displayName || "");
      setOldBio(data.bio || "");
      setDisplayName(data.displayName || "");
      setImageUrl(data.photoURL || "");
      setBio(data.bio || "");
    }
    if (error) {
      console.log(error);
    }
  }, [data, error]);

  const isDataChanged = () => {
    return isImageChanged || oldDisplayName !== displayName || oldBio !== bio;
  };

  const cancel = () => {
    if (!isDataChanged()) {
      navigate(`/profile/${id}`);
    } else {
      setCancelPreview(true);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    if (isDataChanged()) {
      try {
        if (isImageChanged && typeof imageUrl !== "string") {
          uploadImageMutation.mutate(
            {
              imageBlob: imageUrl,
              userId: id || "",
            },
            {
              onSuccess: async (downloadURL) => {
                try {
                  const user = auth.currentUser;
                  if (user) {
                    await updateProfile(user, {
                      displayName,
                      photoURL: downloadURL,
                    });
                    const userRef = doc(db, "users", id || "");
                    await updateDoc(userRef, {
                      displayName,
                      photoURL: downloadURL,
                      bio,
                    });
                    navigate(`/profile/${id}`);
                  }
                } catch (error) {
                  console.error(error);
                  toast({
                    variant: "destructive",
                    title: "Error!",
                    description:
                      "Something went wrong! Please try again later.",
                  });
                } finally {
                  setIsLoading(false);
                }
              },
              onError: (error) => {
                console.error(error);
                toast({
                  variant: "destructive",
                  title: "Error!",
                  description: "Image upload failed! Please try again.",
                });
                setIsLoading(false);
              },
            }
          );
        } else {
          const user = auth.currentUser;
          if (user) {
            await updateProfile(user, {
              displayName,
            });
            const userRef = doc(db, "users", id || "");
            await updateDoc(userRef, {
              displayName,
              bio,
            });
            navigate(`/profile/${id}`);
          }
        }
      } catch (error) {
        console.error(error);
        toast({
          variant: "destructive",
          title: "Error!",
          description: "Something went wrong! Please try again later.",
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      navigate(`/profile/${id}`);
    }
  };

  return (
    <>
      {isAuthenticated && currentUser?.uid === id ? (
        <div className="grid gap-6">
          <div>
            <div className="space-y-0.5">
              <h2 className="text-2xl font-bold tracking-tight">
                Edit Profile
              </h2>
              <p className="text-muted-foreground text-sm md:text-base">
                Manage your account name, bio and avatar preferences.
              </p>
              <Separator className="!my-4" />
            </div>
            <div className="p-1 md:p-6">
              <div>
                <div className="flex justify-between gap-4 md:gap-6 flex-col">
                  <div className="flex items-center justify-center md:justify-normal">
                    <a
                      onClick={() => setImagePreview(true)}
                      className="cursor-pointer opacity-80 hover:opacity-60 transition-opacity relative"
                    >
                      <Avatar className="h-32 w-32 overflow-hidden rounded-full border">
                        <AvatarImage
                          src={
                            typeof imageUrl === "string"
                              ? imageUrl
                              : URL.createObjectURL(imageUrl)
                          }
                          alt="Avatar"
                        />
                        <AvatarFallback>
                          {getInitials(displayName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute flex items-center justify-center w-full h-full top-0 left-0">
                        <Camera />
                      </div>
                    </a>
                  </div>
                  <form className="flex flex-col gap-4 w-full md:max-w-3xl">
                    <div>
                      <Label htmlFor="displayName">Name</Label>
                      <Input
                        className="font-onest"
                        type="text"
                        id="displayName"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                      />
                      <p className="text-sm text-muted-foreground">
                        Your public display name.
                      </p>
                    </div>

                    <div className="grid gap-1">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        className="font-onest"
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                      />
                      <p className="text-sm text-muted-foreground">
                        About you.
                      </p>
                    </div>
                  </form>
                </div>
              </div>
              <div className="flex gap-2 justify-end mt-6">
                <Button variant="secondary" onClick={cancel}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isLoading}>
                  {isLoading && (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  )}{" "}
                  Save
                </Button>
              </div>
            </div>
          </div>

          <Dialog open={imagePreview} onOpenChange={setImagePreview}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Avatar</DialogTitle>
              </DialogHeader>
              <ImageUploader
                setImageUrl={setImageUrl}
                setImagePreview={setImagePreview}
                setIsImageChanged={setIsImageChanged}
              />
            </DialogContent>
          </Dialog>

          <DiscardDialog
            open={cancelPreview}
            onOpenChange={setCancelPreview}
            discardFunction={() => navigate(`/profile/${id}`)}
          />
        </div>
      ) : (
        <Navigate to={`/profile/${id}`} />
      )}
    </>
  );
};

export default UpdateProfile;
