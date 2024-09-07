import { Link, Outlet, useNavigate } from "react-router-dom";
import { Icons } from "@/components/shared/ui/icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserContext } from "@/context/authContext";
import { useState } from "react";
import { ToastAction } from "@/components/ui/toast";
import { checkIfEmailExists } from "@/functions/firebaseInputCheck";
import {
  useSignInAccountMutation,
  useSignInWithGoogleMutation,
} from "@/lib/react-query/queriesAndMutations";
import { useToast } from "@/components/ui/use-toast";

const AuthOnlyLayout = () => {
  const { isAuthenticated } = useUserContext();
  const [showSignIn, setshowSignIn] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const { mutateAsync: signInAccount, isLoading: isSignInLoading } =
    useSignInAccountMutation();
  const signInWithGoogleMutation = useSignInWithGoogleMutation();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const userCredential = await signInWithGoogleMutation.mutateAsync();
      const user = userCredential?.user;
      if (user) {
        setIsLoading(false);
        location.reload();
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Google Sign-In Error:", error);
      toast({
        variant: "destructive",
        title: "Google Sign-In failed.",
        description: "Something went wrong. Please try again.",
      });
    }
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setShowPassword(false);

    const isEmailTaken = await checkIfEmailExists(email);

    if (!email || !password) {
      setIsLoading(false);
      return toast({
        variant: "destructive",
        title: "Please fill in both fields",
      });
    } else if (!validateEmail(email)) {
      setIsLoading(false);
      return toast({
        variant: "destructive",
        title: "Please enter a valid email address",
      });
    } else if (password.length < 8) {
      setIsLoading(false);
      return toast({
        variant: "destructive",
        title: "Password must be at least 8 character long",
      });
    } else if (!isEmailTaken) {
      setIsLoading(false);
      return toast({
        title: "No account found with this email.",
        description: "Do you want to Sign Up?",
        action: (
          <ToastAction
            altText="Sign Up"
            onClick={() => {
              window.location.href = `/sign-up?e=${email}`;
            }}
          >
            Sign Up
          </ToastAction>
        ),
      });
    } else {
      signInAccount(
        { email, password },
        {
          onSuccess: () => {
            setIsLoading(false);
            location.reload();
          },
          onError: (error) => {
            console.error("Sign in failed:", error);
            setIsLoading(false);
            return toast({
              variant: "destructive",
              title: "Sign in failed.",
              description: "Please check your password.",
            });
          },
        }
      );
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <h1 className="md:text-4xl max-xsm:text-[16px] text-[20px] font-bold mt-8 md:mt-0 text-center">
          You need to login to access this page.
        </h1>
        <div className="w-fit my-4">
          <span className="text-muted-foreground text-sm md:text-base">
            <a
              className="text-foreground/80 font-bold underline cursor-pointer select-none"
              onClick={() => setshowSignIn(!showSignIn)}
            >
              Login
            </a>{" "}
            to your account or{" "}
            <Link
              className="text-foreground/80 font-bold underline cursor-pointer"
              to="sign-up"
            >
              Create account.
            </Link>
          </span>
        </div>
        <Card
          className={`max-w-[400px] w-full transition-all md:mt-10 ${
            !showSignIn &&
            "-translate-y-[20%] scale-50 opacity-0 pointer-events-none"
          }`}
        >
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Login to an account</CardTitle>
            <CardDescription>Enter your email below to login</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4" onSubmit={handleSubmit}>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={!showPassword ? "password" : "text"}
                    autoCapitalize="none"
                    autoComplete="password"
                    autoCorrect="off"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
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
              </div>
              <Button disabled={isLoading || isSignInLoading}>
                {(isLoading || isSignInLoading) && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Login
              </Button>

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
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setIsLoading(true);
                handleGoogleSignIn();
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
            <Button
              className="w-full"
              variant="ghost"
              onClick={() => navigate("/home")}
            >
              Go to home page
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return <Outlet />;
};

export default AuthOnlyLayout;
