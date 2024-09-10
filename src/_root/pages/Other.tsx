import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUserContext } from "@/context/authContext";
import PWAInstallButton from "@/components/shared/InstallPwaButton";
import { Bug, Info, Settings, ShoppingCart, UserCog } from "lucide-react";
import { Link } from "react-router-dom";

const Other = () => {
  const { user: currentUser } = useUserContext();

  return (
    <Card className="p-0 border-0 md:p-6 md:border">
      <CardHeader className="p-4 md:p-6">
        <CardTitle>Other</CardTitle>
        <CardDescription>Other menu options.</CardDescription>
      </CardHeader>
      <CardContent className="p-4 md:p-6 pt-0 md:mt-0 grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
        {currentUser.isAadmin && (
          <Link
            to="/admin"
            className="flex items-center justify-start w-full p-4 space-x-2 border transition-colors hover:bg-muted rounded-md"
          >
            <UserCog className="w-5 h-5" />
            <span>Admin options</span>
          </Link>
        )}
        <Link
          to="/create-post"
          className="flex items-center justify-start w-full p-4 space-x-2 border transition-colors hover:bg-muted rounded-md"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
          >
            <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" />
          </svg>
          <span>Create Post</span>
        </Link>
        <Link
          to="/orders"
          className="flex items-center justify-start w-full p-4 space-x-2 border transition-colors hover:bg-muted rounded-md"
        >
          <ShoppingCart className="w-5 h-5" />
          <span>Orders</span>
        </Link>
        <Link
          to="/settings"
          className="flex items-center justify-start w-full p-4 space-x-2 border transition-colors hover:bg-muted rounded-md"
        >
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </Link>
        <Link
          to="/feedback"
          className="flex items-center justify-start w-full p-4 space-x-2 border transition-colors hover:bg-muted rounded-md"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
          >
            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
            <path d="M8 12h.01" />
            <path d="M12 12h.01" />
            <path d="M16 12h.01" />
          </svg>
          <span>Feedback</span>
        </Link>
        <Link
          to="/report-issu"
          className="flex items-center justify-start w-full p-4 space-x-2 border transition-colors hover:bg-muted rounded-md"
        >
          <Bug className="w-5 h-5" />
          <span>Report an issu</span>
        </Link>
        <PWAInstallButton />
        <Link
          to="/about"
          className="flex items-center justify-start w-full p-4 space-x-2 border transition-colors hover:bg-muted rounded-md"
        >
          <Info className="w-5 h-5" />
          <span>About us</span>
        </Link>
      </CardContent>
    </Card>
  );
};

export default Other;
