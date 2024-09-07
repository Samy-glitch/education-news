import { useState } from "react";
import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/shared/ui/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

import { buttonVariants } from "@/components/ui/button";

const CreateAccountForm = () => {
  // const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [repeatPassword, setRepeatPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState<boolean>(false);
  const [form, setForm] = useState<string>("email");

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };
  const validateUserName = (name: string) => {
    return String(name)
      .toLowerCase()
      .match(/^[a-zA-Z0-9_]+$/);
  };

  function setLoadingTimer() {
    setIsLoading(true);
    setTimeout(() => {
      return toast({
        title: "Taking longer than expected.",
        description:
          "Please chplease check your internet connection or try again later.",
        action: <ToastAction altText="Report issue">Report issue</ToastAction>,
      });
    }, 10000);
  }

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    // setIsLoading(true);

    if (form === "email") {
      if (!validateEmail(email)) {
        return toast({
          variant: "destructive",
          title: "Please enter a valid email address.",
        });
      } else setForm("name");
    } else if (form === "name") {
      if (!name || !username) {
        return toast({
          variant: "destructive",
          title: "Please fill in both fields.",
        });
      }
      if (name.length < 2) {
        return toast({
          variant: "destructive",
          title: "Name must be at least 2 character long.",
        });
      } else if (username.length < 2) {
        return toast({
          variant: "destructive",
          title: "Username must be at least 2 character long.",
        });
      } else if (!validateUserName(username)) {
        return toast({
          variant: "destructive",
          title: "Your userName is not valid.",
          description:
            "Only characters A-Z, a-z, numbers and '_' are  acceptable.",
        });
      } else setForm("password");
    } else if (form === "password") {
      if (!password || !repeatPassword) {
        return toast({
          variant: "destructive",
          title: "Please fill in both fields",
        });
      } else if (password.length < 8) {
        return toast({
          variant: "destructive",
          title: "Password must be at least 8 character long.",
        });
      } else if (password !== repeatPassword) {
        return toast({
          variant: "destructive",
          title: "Password are not same.",
        });
      }
    }
    if (!email || !name || !username || !password) {
      return toast({
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        action: (
          <ToastAction
            altText="Try again"
            onClick={() => window.location.reload()}
          >
            Try again
          </ToastAction>
        ),
      });
    } else {
      setLoadingTimer();
      console.log({
        name,
        username,
        email,
        password,
      });
    }
  }
  return (
    <>
      <Link
        to="/sign-in"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute right-4 top-4 md:right-8 md:top-8"
        )}
      >
        Login
      </Link>

      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Create an account
            </h1>
            <p className="text-sm text-muted-foreground">
              {form === "email"
                ? "Enter your email below to create your account"
                : form === "name"
                ? "Enter your Name below to create your account"
                : form === "password"
                ? "Enter your Password below to create your account"
                : ""}
            </p>
          </div>
          <div className={cn("grid gap-6")}>
            <form onSubmit={onSubmit}>
              <div className="grid gap-2">
                <div className={`grid gap-1 ${form !== "email" && "hidden"}`}>
                  <Label className="sr-only" htmlFor="email">
                    Email
                  </Label>
                  <Input
                    id="email"
                    placeholder="name@example.com"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className={`grid gap-2 ${form !== "name" && "hidden"}`}>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="display name"
                    type="name"
                    autoCapitalize="none"
                    autoComplete="name"
                    autoCorrect="off"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isLoading}
                  />
                  <Label htmlFor="username">UserName</Label>
                  <Input
                    id="username"
                    placeholder="@username"
                    type="text"
                    autoCapitalize="none"
                    autoComplete="username"
                    autoCorrect="off"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isLoading}
                  />
                  <p className="text-sm text-muted-foreground">
                    This is your public display name.
                  </p>
                </div>
                <div
                  className={`grid gap-2 ${form !== "password" && "hidden"}`}
                >
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      placeholder="********"
                      type={!showPassword ? "password" : "text"}
                      autoCapitalize="none"
                      autoComplete="password"
                      autoCorrect="off"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                    />
                    <a
                      className={`absolute translate-x-0 -translate-y-2/4 z-50 right-0 px-2 top-2/4 bg-transparent border-none outline-none ${
                        isLoading ? "cursor-not-allowed" : "cursor-pointer"
                      }`}
                      onClick={() =>
                        showPassword
                          ? setShowPassword(false)
                          : setShowPassword(true)
                      }
                    >
                      <img
                        src={
                          !showPassword
                            ? "/assets/icons/eye.svg"
                            : "/assets/icons/eye-slash.svg"
                        }
                        alt=""
                        height={20}
                        width={20}
                      />
                    </a>
                  </div>
                  <Label htmlFor="repeatPassword">RepeatPassword</Label>
                  <div className="relative">
                    <Input
                      id="repeatPassword"
                      placeholder="********"
                      type={!showRepeatPassword ? "password" : "text"}
                      autoCapitalize="none"
                      autoComplete="repeatPassword"
                      autoCorrect="off"
                      value={repeatPassword}
                      onChange={(e) => setRepeatPassword(e.target.value)}
                      disabled={isLoading}
                    />
                    <a
                      className={`absolute translate-x-0 -translate-y-2/4 z-50 right-0 px-2 top-2/4 bg-transparent border-none outline-none ${
                        isLoading ? "cursor-not-allowed" : "cursor-pointer"
                      }`}
                      onClick={() =>
                        showRepeatPassword
                          ? setShowRepeatPassword(false)
                          : setShowRepeatPassword(true)
                      }
                    >
                      <img
                        src={
                          !showRepeatPassword
                            ? "/assets/icons/eye.svg"
                            : "/assets/icons/eye-slash.svg"
                        }
                        alt=""
                        height={20}
                        width={20}
                      />
                    </a>
                  </div>
                </div>
                <Button disabled={isLoading}>
                  {isLoading && (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {form === "email"
                    ? "Sign Up with Email"
                    : form === "name"
                    ? "Next"
                    : form === "password"
                    ? "Create account"
                    : ""}
                </Button>
              </div>
            </form>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                setIsLoading(true);
                setLoadingTimer();
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Icons.google className="mr-2 h-4 w-4" />
              )}{" "}
              Google
            </Button>
          </div>
          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <Link
              to="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              to="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </>
  );
};
export default CreateAccountForm;
