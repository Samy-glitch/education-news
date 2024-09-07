import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/shared/ui/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { buttonVariants } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import {
  useSignInAccountMutation,
  useSignInWithGoogleMutation,
} from "@/lib/react-query/queriesAndMutations";
import { checkIfEmailExists } from "@/functions/firebaseInputCheck";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";

const SignInForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { mutateAsync: signInAccount, isLoading: isSignInLoading } =
    useSignInAccountMutation();
  const signInWithGoogleMutation = useSignInWithGoogleMutation();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [queryParameters] = useSearchParams();

  useEffect(() => {
    const emailParam = queryParameters.get("e");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [queryParameters]);

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
        navigate("/home");
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
              window.location.href = "/sign-up";
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
            navigate("/home");
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
  return (
    <>
      <Link
        to="/sign-up"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute right-4 top-4 md:right-8 md:top-8"
        )}
      >
        Create account
      </Link>

      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Login to an existing account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email and password to login your account
            </p>
          </div>
          <div className={cn("grid gap-6")}>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-2">
                <div className="grid gap-2">
                  <Label className="sr-only" htmlFor="email">
                    Email
                  </Label>
                  <Input
                    id="email"
                    placeholder="Email"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    disabled={isLoading}
                  />
                  <div className="relative">
                    <Label className="sr-only" htmlFor="password">
                      Password
                    </Label>
                    <Input
                      id="password"
                      placeholder="Password"
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
                      {!showPassword ? (
                        <EyeOpenIcon className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <EyeClosedIcon className="h-4 w-4 text-muted-foreground" />
                      )}
                    </a>
                  </div>
                </div>
                <Button disabled={isLoading || isSignInLoading}>
                  {(isLoading || isSignInLoading) && (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Login
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
              disabled={isLoading}
              variant="ghost"
              onClick={() => navigate("/home")}
            >
              Go to home page
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
export default SignInForm;
