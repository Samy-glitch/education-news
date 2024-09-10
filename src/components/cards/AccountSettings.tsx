import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUserContext } from "@/context/authContext";
import { formatDate, getInitials } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { Link } from "react-router-dom";

const AccountSettings = () => {
  const { user } = useUserContext();

  return (
    <Card className="border-0 md:border">
      <CardHeader className="p-4 md:p-6">
        <CardTitle>Account</CardTitle>
        <CardDescription className="text-sm md:text-base">
          Update your account settings.
        </CardDescription>
        <Separator className="!my-4" />
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          <div className="flex items-center">
            <Avatar className="h-32 w-32 overflow-hidden rounded-full border mb-4">
              <AvatarImage src={user.photoURL} alt="Avatar" />
              <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
            </Avatar>
          </div>

          <div className="grid gap-1">
            <h3 className="text-md font-semibold">Name</h3>
            <div className="text-muted-foreground font-onest text-sm">
              {user.displayName}
            </div>
            <h3 className="text-md font-semibold">UserName</h3>
            <div className="text-muted-foreground font-onest text-sm">
              {user.userName}
            </div>
            <h3 className="text-md font-semibold">Email</h3>
            <div className="text-muted-foreground font-onest text-sm">
              {user.email}
            </div>
            <h3 className="text-md font-semibold">Joined</h3>
            <div className="text-muted-foreground text-sm">
              {formatDate(user.date)}
            </div>
          </div>
          <h3 className="text-xl font-semibold mt-8 mb-2">Preferences</h3>
          <Separator className="mb-4" />
          <div className="flex flex-col gap-1">
            <Link to={`/edit-profile/${user.uid}`} className="relative">
              <p className="hover-underline-2">Edit Profile</p>
            </Link>
            <p className="hover-underline-2 cursor-pointer">Forget password?</p>
            <p className="text-red font-semibold hover-underline-red cursor-pointer">
              Delete account
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountSettings;
