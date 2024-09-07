import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useUserContext } from "@/context/authContext";
import { useAddToHomescreenPrompt } from "@/lib/pwa";
import { useIsPWAInstalled } from "@/lib/utils";
import {
  Bug,
  Info,
  MonitorDown,
  Settings,
  ShoppingCart,
  UserCog,
} from "lucide-react";
import { Link } from "react-router-dom";

const Other = () => {
  const { user: currentUser } = useUserContext();
  const [promptable, promptToInstall, isInstalled] = useAddToHomescreenPrompt();

  return (
    <Card className="border-0 md:border">
      <CardHeader className="p-4 md:p-6">
        <CardTitle>Other</CardTitle>
        <CardDescription className="text-sm md:text-base">
          Other menu options.
        </CardDescription>
        <Separator className="!my-4" />
      </CardHeader>
      <CardContent className="p-2 md:p-6 md:pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 max-w-4xl">
          {currentUser.isAadmin && (
            <Link
              to="/admin"
              className="w-full flex items-center justify-center p-4 md:p-6 rounded-xl border gap-2 transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <UserCog />
              Admin options
            </Link>
          )}
          <Link
            to="/ask-question"
            className="w-full flex items-center justify-center p-4 md:p-6 rounded-xl border gap-2 transition-colors hover:bg-accent hover:text-accent-foreground"
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
              className="lucide lucide-message-circle-question"
            >
              <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <path d="M12 17h.01" />
            </svg>
            Ask question
          </Link>
          <Link
            to="/orders"
            className="w-full flex items-center justify-center p-4 md:p-6 rounded-xl border gap-2 transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <ShoppingCart />
            Orders
          </Link>
          <Link
            to="/settings"
            className="w-full flex items-center justify-center p-4 md:p-6 rounded-xl border gap-2 transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <Settings />
            Settings
          </Link>
          <Link
            to="/feedback"
            className="w-full flex items-center justify-center p-4 md:p-6 rounded-xl border gap-2 transition-colors hover:bg-accent hover:text-accent-foreground"
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
              className="lucide lucide-message-circle-more"
            >
              <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
              <path d="M8 12h.01" />
              <path d="M12 12h.01" />
              <path d="M16 12h.01" />
            </svg>
            Feedback
          </Link>
          <Link
            to="/report-issu"
            className="w-full flex items-center justify-center p-4 md:p-6 rounded-xl border gap-2 transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <Bug />
            Report an issu
          </Link>

          <Button
            className={`w-full flex items-center justify-center p-4 md:p-6 rounded-xl border gap-2 h-fit ${
              useIsPWAInstalled() && "hidden"
            }`}
            variant="ghost"
            onClick={promptToInstall}
            disabled={!promptable || isInstalled}
          >
            <MonitorDown />
            Install app
          </Button>
          <Link
            to="/about"
            className="w-full flex items-center justify-center p-4 md:p-6 rounded-xl border gap-2 transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <Info />
            About us
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default Other;
