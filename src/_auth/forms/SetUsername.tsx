import { useState } from "react";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/shared/ui/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { checkIfUsernameExists } from "@/functions/firebaseInputCheck";
import { auth, db } from "@/lib/firebase/config";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const SetUsername = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");

  onAuthStateChanged(auth, async (currentAccount) => {
    if (currentAccount) {
      const docRef = doc(db, "users", currentAccount.uid);
      const currentUser = await getDoc(docRef);

      if (currentUser.exists()) {
        if (currentUser.data().userName !== "") {
          navigate("/");
        }
      }
    } else navigate("/sign-up");
  });

  const validateUserName = (name: string) => {
    return String(name)
      .toLowerCase()
      .match(/^[a-zA-Z0-9_]+$/);
  };

  function setLoadingTimer() {
    setIsLoading(true);
    setTimeout(() => {
      if (!auth.currentUser) {
        return toast({
          title: "Taking longer than expected.",
          description:
            "Please chplease check your internet connection or try again later.",
          action: (
            <ToastAction altText="Report issue">Report issue</ToastAction>
          ),
        });
      }
    }, 20000);
  }

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);
    const isUsernameTaken = await checkIfUsernameExists(username);

    if (!username) {
      setIsLoading(false);
      return toast({
        variant: "destructive",
        title: "Please enter your username.",
      });
    } else if (username.length < 2) {
      setIsLoading(false);
      return toast({
        variant: "destructive",
        title: "Username must be at least 2 character long.",
      });
    } else if (!validateUserName(username)) {
      setIsLoading(false);
      return toast({
        variant: "destructive",
        title: "Your userName is not valid.",
        description:
          "Only characters A-Z, a-z, numbers and '_' are  acceptable.",
      });
    } else if (isUsernameTaken) {
      setIsLoading(false);
      return toast({
        variant: "destructive",
        title: "Username is already taken.",
      });
    } else {
      setLoadingTimer();
      onAuthStateChanged(auth, async (currentAccount) => {
        const userDocRef = doc(db, "users", currentAccount?.uid || "");
        await updateDoc(userDocRef, {
          userName: `@${username.toLocaleLowerCase()}`,
        }).then(() => {
          navigate("/");
        });
      });
    }
  }
  return (
    <div className="lg:p-8">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create an account
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your userName below to create your account
          </p>
        </div>
        <div className={cn("grid gap-6")}>
          <form onSubmit={onSubmit}>
            <div className="grid space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="username">UserName</Label>
                <Input
                  id="username"
                  placeholder="@username"
                  type="text"
                  autoCapitalize="none"
                  autoComplete="username"
                  autoCorrect="off"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                  disabled={isLoading}
                />
                <p className="text-sm text-muted-foreground">
                  This is your public display name.
                </p>
              </div>
              <Button disabled={isLoading} className="w-fit">
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create account
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default SetUsername;
