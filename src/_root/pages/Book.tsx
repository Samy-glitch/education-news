import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetBook, useLikeBook } from "@/lib/react-query/queriesAndMutations";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Copy, Minus, Plus, QrCode } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";
import { useUserContext } from "@/context/authContext";
import { IBook } from "@/types";
import { LoginDialog, QRCodeDialog } from "@/components/shared/Dialogs";
import { formatNumber } from "@/lib/utils";

const Book = () => {
  const { id } = useParams();
  const { mutate: likeOrUnlikeBook } = useLikeBook();
  const { user } = useUserContext();
  const { data, error, isLoading } = useGetBook(id || "");

  const [book, setBook] = useState<IBook | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [bookPrice, setBookPrice] = useState<number>(0);
  const [isFixedDivVisible, setIsFixedDivVisible] = useState<boolean>(true);
  const [qrCodeDialog, setQrCodeDialog] = useState<boolean>(false);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [bookLikes, setBookLikes] = useState<number>(0);
  const [privewImage, setPrivewImage] = useState<string>("");
  const [isLoginDilog, setIsLoginDilog] = useState<boolean>(false);

  const buyButtonRef1 = useRef<HTMLDivElement | null>(null);
  const buyButtonRef2 = useRef<HTMLDivElement | null>(null);
  const likeButtonRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (data) {
      setBook(data);
      setBookPrice(Number(data.price));
      setPrivewImage(data.images?.[0]);
      setBookLikes(data.likes ? data.likes.length : 0);
      if (user?.uid && data.likes) {
        setHasLiked(data.likes.includes(user.uid));
      }
    }
    if (error) {
      console.log(error);
    }
  }, [data, error, user?.uid]);

  const handleLikeToggle = (bookId: string) => {
    if (!bookId || !user?.uid) {
      setIsLoginDilog(true);
      return;
    }
    const newHasLiked = !hasLiked;
    const updatedLikes = newHasLiked ? bookLikes + 1 : bookLikes - 1;
    if (newHasLiked) {
      likeButtonRef.current?.classList.add("likePulse");
    } else {
      likeButtonRef.current?.classList.remove("likePulse");
    }
    setBookLikes(updatedLikes);
    setHasLiked(newHasLiked);
    likeOrUnlikeBook({ bookId, userId: user.uid, hasLiked: newHasLiked });
  };

  useEffect(() => {
    const mainScrollDiv = document.getElementById("scrollDiv");

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFixedDivVisible(!entry.isIntersecting);
      },
      { threshold: 1 }
    );

    const handleScroll = () => {
      if (buyButtonRef1.current) {
        observer.observe(buyButtonRef1.current);
      }
    };
    mainScrollDiv?.addEventListener("scroll", handleScroll);

    handleScroll();

    return () => {
      mainScrollDiv?.removeEventListener("scroll", handleScroll);
      if (buyButtonRef1.current) {
        observer.unobserve(buyButtonRef1.current);
      }
    };
  }, []);

  const addQuantity = () => {
    setQuantity(quantity + 1);
    setBookPrice(bookPrice + Number(data.price));
  };

  const minusQuantity = () => {
    if (quantity !== 1) {
      setQuantity(quantity - 1);
      setBookPrice(bookPrice - Number(data.price));
    }
  };

  const link = window.location.origin + "/book/" + id;
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

  if (isLoading)
    return (
      <div className="flex flex-col xl:flex-row mt-4 md:mt">
        <div className="w-full xl:w-[75%]">
          <div className="flex flex-col md:flex-row">
            <div className="pt-2 w-full md:w-[45%]">
              <div className="relative">
                <div className="relative w-full md:pl-[15%]">
                  <div className="h-full left-0 absolute top-0 w-[12%]"></div>
                  <div className="rounded-md overflow-hidden relative">
                    <div className="h-full left-0 absolute top-0 w-full">
                      <div
                        dir="ltr"
                        className="h-full overflow-hidden relative w-full"
                      >
                        <Skeleton className="h-full w-full" />
                        <div className="h-full left-0 absolute top-0 w-full"></div>
                      </div>
                    </div>
                    <div className="w-full pt-[140%]"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-2 md:pl-6 w-full md:w-[55%]">
              <div className="mt-4">
                <Skeleton className="mr-3 h-12 w-28" />
              </div>
              <div className="flex gap-2 mt-2">
                <Skeleton className="h-[22px] w-12" />
                <Skeleton className="h-[22px] w-10" />
              </div>
              <div className="mt-4">
                <Skeleton className="h-5 w-[318px]" />
              </div>
              <Separator className="my-4" />
              <div className="mt-4">
                <div className="pb-2">
                  <div className="flex items-center flex-wrap">
                    <Skeleton className="inline-block h-[81px] w-[58px] mb-2 mr-2" />
                    <Skeleton className="inline-block h-[81px] w-[58px] mb-2 mr-2" />
                    <Skeleton className="inline-block h-[81px] w-[58px] mb-2 mr-2" />
                    <Skeleton className="inline-block h-[81px] w-[58px] mb-2 mr-2" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Separator className="my-8" />
        </div>
        <div className="w-full xl:w-[25%]">
          <div className="pt-2 pb-[31px] xl:pl-6 sticky top-[72px] z-20">
            <Card className="book-card">
              <CardContent className="flex flex-col">
                <div className="py-6">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-5 w-[90%] mt-[6px]" />
                </div>
                <Separator className="mb-4" />
                <div className="mb-3">
                  <Skeleton className="h-5 w-full mb-2" />
                  <Skeleton className="h-5 w-[20%]" />
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <Skeleton className="h-[20px] w-[20px]" />
                  <Skeleton className="h-[20px] w-28" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-[20px] w-[20px]" />
                  <Skeleton className="h-[20px] w-[150px]" />
                </div>
                <div className="ml-6 mt-2 flex flex-col gap-[6px]">
                  <Skeleton className="h-4" />
                  <Skeleton className="h-4" />
                  <Skeleton className="h-4" />
                  <Skeleton className="h-4" />
                  <Skeleton className="h-4 w-[60%]" />
                </div>
                <Separator className="my-4" />
                <div className="mb-2">
                  <Skeleton className="h-6 w-20" />
                </div>
                <div className="mb-4 flex items-center gap-5">
                  <Skeleton className="h-9 w-9" />
                  <Skeleton className="h-8 w-4" />
                  <Skeleton className="h-9 w-9" />
                </div>
                <div className="flex flex-col gap-3">
                  <Skeleton className="h-9" />
                  <Skeleton className="h-9" />
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-14" />
                <Skeleton className="h-9 w-14" />
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    );
  if (error || !book)
    return (
      <div className="h-[50vh] w-full flex items-center justify-center">
        <p className="text-muted-foreground">Error loading book!</p>
      </div>
    );

  return (
    <div className="flex flex-col xl:flex-row mt-4 md:mt">
      <LoginDialog open={isLoginDilog} onOpenChange={setIsLoginDilog} />
      <div className="w-full xl:w-[75%]">
        <div className="flex flex-col md:flex-row">
          <div className="pt-2 w-full md:w-[45%]">
            <div className="relative">
              <div className="relative w-full md:pl-[15%]">
                <div className="h-full left-0 absolute top-0 w-[12%]"></div>
                <div className="rounded-md overflow-hidden relative">
                  <div className="h-full left-0 absolute top-0 w-full">
                    <div
                      dir="ltr"
                      className="h-full overflow-hidden relative text-center w-full"
                    >
                      <img
                        src={privewImage}
                        className="max-h-full max-w-full w-full h-full object-cover"
                      />
                      <div className="h-full left-0 absolute top-0 w-full"></div>
                    </div>
                  </div>
                  <div className="w-full pt-[140%]"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-2 md:pl-6 w-full md:w-[55%]">
            <div className="mt-4">
              <div className="inline-block text-[24px] font-bold line leading-none mr-3">
                <span className="text-[40px]">{book?.price}৳</span>
              </div>
            </div>
            <div className="flex gap-2 mt-2">
              <Badge>{book?.type}</Badge>
              <Badge variant="outline">{book?.class}</Badge>
            </div>
            <div className="mt-4">
              <h1 className="inline text-[15px] font-bold leading-[19px] m-0 align-middle">
                {book?.name}
              </h1>
            </div>
            <Separator className="my-4" />
            <div className="mt-4">
              <div className="pb-2">
                <div className="flex items-center flex-wrap">
                  {book?.images.map((image) => (
                    <div
                      key={image}
                      className={`rounded-md cursor-pointer inline-block h-[90px] w-[68px] relative mb-2 mr-2 ${
                        privewImage === image && "border-2 border-foreground"
                      }`}
                      onClick={() => {
                        if (privewImage !== image) {
                          setPrivewImage(image);
                        }
                      }}
                    >
                      <img
                        src={image}
                        className="rounded-md h-[81px] w-[58px] absolute left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%] object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-3 line-clamp-3">
                  {book?.description}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Separator className="my-8" />
      </div>
      <div className="w-full xl:w-[25%]">
        <div className="pt-2 pb-[31px] xl:pl-6 sticky top-[72px] z-20">
          <Card className="book-card">
            <CardHeader>
              <CardTitle>{bookPrice}৳</CardTitle>
              <CardDescription>{book?.name}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col">
              <Separator className="mb-4" />

              <div className="flex items-center gap-2 mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-truck"
                >
                  <path d="M13.4 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.4" />
                  <path d="M2 6h4" />
                  <path d="M2 10h4" />
                  <path d="M2 14h4" />
                  <path d="M2 18h4" />
                  <path d="M21.378 5.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z" />
                </svg>
                <span className="font-semibold">
                  By: {book.by || "Unknown"}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-truck"
                >
                  <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
                  <path d="M15 18H9" />
                  <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
                  <circle cx="17" cy="18" r="2" />
                  <circle cx="7" cy="18" r="2" />
                </svg>
                <span className="font-semibold">
                  Shipping: {book?.shipping || 0}৳
                </span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-shield-check"
                >
                  <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
                <span className="font-semibold">Security & Privacy</span>
              </div>
              <div className="ml-6">
                <span className="text-sm text-muted-foreground line-clamp-6">
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Animi dicta placeat sunt hic libero deleniti quis quidem
                  eveniet architecto, dignissimos, incidunt quia natus expedita
                  voluptatum. Officiis nesciunt illum repellendus
                  necessitatibus.
                </span>
              </div>
              <Separator className="my-4" />
              <div className="font-semibold mb-2">Quantity</div>
              <div className="mb-4 flex items-center gap-6">
                <Button
                  variant="outline"
                  size="icon"
                  disabled={quantity === 1}
                  onClick={minusQuantity}
                  className="disabled:cursor-not-allowed"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span>{quantity}</span>
                <Button variant="outline" size="icon" onClick={addQuantity}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div
                className="flex flex-col gap-3"
                ref={buyButtonRef1}
                id="bookBuyDiv"
              >
                <Button>Buy now</Button>
                <Button variant="secondary" disabled={!book?.link} asChild>
                  <Link to={book?.link || ""} target="_blank">
                    Read online
                  </Link>
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button
                variant="outline"
                className="max-w-[150px] gap-2 justify-start"
                onClick={() => handleLikeToggle(id || "")}
              >
                <div ref={likeButtonRef}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill={hasLiked ? "red" : "none"}
                    stroke={hasLiked ? "none" : "currentColor"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-heart"
                  >
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                </div>
                <span>{formatNumber(bookLikes)}</span>
              </Button>

              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-share-2"
                    >
                      <circle cx="18" cy="5" r="3" />
                      <circle cx="6" cy="12" r="3" />
                      <circle cx="18" cy="19" r="3" />
                      <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
                      <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
                    </svg>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuItem onClick={() => copylink()}>
                    <Copy className="mr-2 h-4 w-4" />
                    <span>Copy Link</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setQrCodeDialog(true)}>
                    <QrCode className="mr-2 h-4 w-4" />
                    <span>QR Code</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-circle-alert"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" x2="12" y1="8" y2="12" />
                  <line x1="12" x2="12.01" y1="16" y2="16" />
                </svg>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      <div
        className={`md:hidden flex items-center fixed bottom-0 p-2 gap-2 -translate-y-[57px] left-0 w-full h-14 border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-40 transition-transform ${
          !isFixedDivVisible && "translate-y-[0px]"
        }`}
        ref={buyButtonRef2}
      >
        {book?.link && (
          <Button variant="secondary" className="w-full" asChild>
            <Link to={book.link} target="_blank">
              Read online
            </Link>
          </Button>
        )}
        <Button className="w-full">Buy now</Button>
      </div>
      <QRCodeDialog
        open={qrCodeDialog}
        onOpenChange={setQrCodeDialog}
        link={link}
      />
    </div>
  );
};

export default Book;
