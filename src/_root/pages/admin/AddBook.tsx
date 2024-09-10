import { useCallback, useEffect, useRef, useState } from "react";
import imageCompression from "browser-image-compression";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Info, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUploadImages } from "@/lib/react-query/queriesAndMutations";
import { Icons } from "@/components/shared/ui/icons";
import { toast } from "@/components/ui/use-toast";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useUserContext } from "@/context/authContext";
import { DiscardDialog } from "@/components/shared/Dialogs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import YearSelect from "@/components/ui/YearSelect";

const MIN_DIMENSION = 240;
const MAX_WIDTH = 1024;

const AddBook = () => {
  const nameRef = useRef<HTMLTextAreaElement | null>(null);
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null);
  const tagsRef = useRef<HTMLTextAreaElement | null>(null);
  const [name, setName] = useState<string>("");
  const [tags, setTags] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [writer, setWriter] = useState<string>("");
  const [link, setLink] = useState<string>("");
  const [isFree, setIsFree] = useState<boolean>(true);
  const [price, setPrice] = useState<number>(0);
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [bookClass, setBookClass] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [availability, setAvailability] = useState<string>("onStock");
  const [localImages, setLocalImages] = useState<Blob[]>([]);
  const [error, setError] = useState<string>("");
  const [cancelPreview, setCancelPreview] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const { mutate, isLoading: isUploading, isError, data } = useUploadImages();
  const { user: currentUser } = useUserContext();

  useEffect(() => {
    if (nameRef.current) {
      nameRef.current.style.height = "auto";
      nameRef.current.style.height = nameRef.current.scrollHeight + "px";
    }
  }, [name]);

  useEffect(() => {
    if (descriptionRef.current) {
      descriptionRef.current.style.height = "auto";
      descriptionRef.current.style.height =
        descriptionRef.current.scrollHeight + "px";
    }
  }, [description]);

  useEffect(() => {
    if (tagsRef.current) {
      tagsRef.current.style.height = "auto";
      tagsRef.current.style.height = tagsRef.current.scrollHeight + "px";
    }
  }, [tags]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const compressedFilesPromises = acceptedFiles.map(async (file) => {
      try {
        const imageUrl = await getImageUrl(file);
        const isValid = await validateImageDimensions(imageUrl);

        if (!isValid) {
          setError(
            `Image must be at least ${MIN_DIMENSION} x ${MIN_DIMENSION} pixels.`
          );
          return null;
        }

        const compressedFile = await compressImage(file);
        return compressedFile;
      } catch (error) {
        console.error(error);
        setError(
          "An error occurred while processing the image. Please try again."
        );
        return null;
      }
    });

    const compressedFiles = await Promise.all(compressedFilesPromises);
    const validFiles = compressedFiles.filter(
      (file) => file !== null
    ) as Blob[];

    setLocalImages((prevImages) => [...prevImages, ...validFiles]); // Add new images to the state
    setError(""); // Clear any previous errors
  }, []);

  const getImageUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result?.toString() || "");
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const validateImageDimensions = (imageUrl: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const imageElement = new Image();
      imageElement.src = imageUrl;
      imageElement.onload = () => {
        const { naturalWidth, naturalHeight } = imageElement;
        resolve(
          naturalWidth >= MIN_DIMENSION && naturalHeight >= MIN_DIMENSION
        );
      };
      imageElement.onerror = () => resolve(false);
    });
  };

  const loadImage = (imageUrl: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const imageElement = new Image();
      imageElement.src = imageUrl;
      imageElement.onload = () => resolve(imageElement);
      imageElement.onerror = reject;
    });
  };

  const compressImage = async (file: File): Promise<Blob> => {
    const imageUrl = await getImageUrl(file);
    const imageElement = await loadImage(imageUrl);

    const options = {
      maxWidthOrHeight:
        imageElement.naturalWidth > MAX_WIDTH
          ? MAX_WIDTH
          : imageElement.naturalWidth,
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      return compressedFile as Blob;
    } catch (error) {
      throw new Error("Image compression failed.");
    }
  };

  const handleRemoveImage = (index: number) => {
    setLocalImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    multiple: true,
    maxFiles: 10,
  });

  const handleCancel = () => {
    if (name || description || localImages?.[0] || link || writer) {
      setCancelPreview(true);
    } else {
      navigate(`/admin/`);
    }
  };

  const handleSubmit = () => {
    if (!isLoading) {
      setIsLoading(true);
      if (!name) {
        setIsLoading(false);
        toast({
          variant: "destructive",
          title: "Please fill the title",
        });
        return;
      } else if (!description) {
        setIsLoading(false);
        toast({
          variant: "destructive",
          title: "Please fill the content",
        });
        return;
      } else if (!writer) {
        setIsLoading(false);
        toast({
          variant: "destructive",
          title: "Please add book writer name",
        });
        return;
      } else if (!bookClass) {
        setIsLoading(false);
        toast({
          variant: "destructive",
          title: "Please select book class",
        });
        return;
      } else if (!type) {
        setIsLoading(false);
        toast({
          variant: "destructive",
          title: "Please select a type",
        });
        return;
      } else if (localImages?.length === 0) {
        setIsLoading(false);
        toast({
          variant: "destructive",
          title: "Please upload atlist one image.",
        });
      } else if (!currentUser.uid) {
        console.log("user not found!");
        setIsLoading(false);
        toast({
          variant: "destructive",
          title: "Somthing went wrong!",
          description: "Please try again later.",
        });
        return;
      } else {
        mutate({ imageBlobs: localImages, folderPath: "images/book/" });
      }
    }
  };

  const uploadDataTodb = async () => {
    try {
      const imagePath = data?.map((item) => item.path);
      const imageUrl = data?.map((item) => item.url);

      await addDoc(collection(db, "books"), {
        likes: [],
        name: name,
        by: writer,
        link: link,
        type: type,
        tags: tags,
        price: price,
        isFree: isFree,
        class: bookClass,
        date: new Date(),
        year: selectedYear,
        description: description,
        images: imageUrl || [],
        image: imageUrl?.[0] || "",
        imagesPath: imagePath || [],
        uploadedBy: currentUser.uid,
      });

      toast({
        title: "Book Uploded!",
      });

      navigate("/admin?t=Book%20Uploded");
    } catch (err: any) {
      console.log(err.message);
      setIsLoading(false);
      console.log("User not found!");

      toast({
        variant: "destructive",
        title: "Something went wrong!",
        description: "Please try again later.",
      });
    }
  };

  useEffect(() => {
    if (isError) {
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Somthing went wrong!",
        description: "Please try again later.",
      });
    }
    if (data) {
      uploadDataTodb();
    }
  }, [isError, data]);

  return (
    <div>
      <DiscardDialog
        open={cancelPreview}
        onOpenChange={setCancelPreview}
        discardFunction={() => navigate("/admin")}
      />
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Add Book</h2>
        <p className="text-muted-foreground text-sm md:text-base">
          Include a book or guide on the page.
        </p>
        <Separator className="!my-4" />
      </div>
      <div className="w-full flex flex-col mt-2 gap-4">
        <form className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="book-title"
              className="block text-lg font-semibold mb-2"
            >
              Name
            </label>
            <textarea
              id="book-title"
              className="w-full p-2 bg-muted/60 rounded resize-none outline-none"
              placeholder="Type book title here..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              rows={2}
              ref={nameRef}
            />
          </div>
          <div>
            <label
              htmlFor="book-description"
              className="block text-lg font-semibold mb-2"
            >
              Description
            </label>
            <textarea
              id="book-description"
              className="w-full p-2 bg-muted/60 rounded resize-none outline-none"
              placeholder="Type book description here..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              ref={descriptionRef}
            />
          </div>
          <div>
            <label
              htmlFor="book-link"
              className="block text-lg font-semibold mb-2"
            >
              Writer
            </label>
            <input
              id="book-link"
              className="w-full h-16 p-2 pb-8 bg-muted/60 rounded resize-none outline-none"
              placeholder="Type book writer name here..."
              value={writer}
              onChange={(e) => setWriter(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="book-link"
              className="block text-lg font-semibold mb-2"
            >
              Link
            </label>
            <p className="text-sm text-muted-foreground mb-2">
              <Info className="inline mr-1 w-4" />
              Book link for online reading. (optional)
            </p>
            <input
              id="book-link"
              className="w-full h-16 p-2 pb-8 bg-muted/60 rounded resize-none outline-none"
              placeholder="Type book link here..."
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
            <div className="flex items-center space-x-2 mt-2">
              <Checkbox
                id="terms"
                checked={isFree}
                onCheckedChange={() => setIsFree(!isFree)}
              />
              <label
                htmlFor="terms"
                className="text-sm font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Free for online reading
              </label>
            </div>
          </div>
          <div>
            <label
              htmlFor="book-tags"
              className="block text-lg font-semibold mb-2"
            >
              Tags
            </label>
            <p className="text-sm text-muted-foreground mb-2">
              <Info className="inline mr-1 w-4" />
              No need to use hashes (#), just write about the book. Example:
              Exam notice Exam routine
            </p>
            <textarea
              id="book-tags"
              className="w-full p-2 bg-muted/60 rounded resize-none outline-none"
              placeholder="Write tags here..."
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              rows={3}
              ref={tagsRef}
            />
          </div>
          <Separator className="mt-4" />
          <div className="flex gap-4 lg:items-center flex-col lg:flex-row">
            <div>
              <Label className="text-lg font-semibold" htmlFor="book-price">
                Book price
              </Label>
              <Input
                id="book-price"
                type="number"
                className="lg:w-[180px] mt-2"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </div>
            <div>
              <span className="block text-lg font-semibold mb-2">
                Book Class
              </span>
              <Select
                value={bookClass}
                onValueChange={(value) => setBookClass(value)}
              >
                <SelectTrigger className="lg:w-[180px]">
                  <SelectValue placeholder="Select a Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="c6">Class 6</SelectItem>
                    <SelectItem value="c7">Class 7</SelectItem>
                    <SelectItem value="c8">Class 8</SelectItem>
                    <SelectItem value="c9">Class 9</SelectItem>
                    <SelectItem value="c10">Class 10</SelectItem>
                    <SelectItem value="c11">Class 11</SelectItem>
                    <SelectItem value="c12">Class 12</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <span className="block text-lg font-semibold mb-2">
                Book type
              </span>
              <Select value={type} onValueChange={(value) => setType(value)}>
                <SelectTrigger className="lg:w-[180px]">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="book">Book</SelectItem>
                    <SelectItem value="guide">Guide</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <span className="block text-lg font-semibold mb-2">
                Book Availability
              </span>
              <Select
                value={availability}
                onValueChange={(value) => setAvailability(value)}
                defaultValue="onStock"
              >
                <SelectTrigger className="lg:w-[180px]">
                  <SelectValue placeholder="Select Availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="onStock">On Stock</SelectItem>
                    <SelectItem value="outStock">Out of Stock</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <span className="block text-lg font-semibold mb-2">
                Book Year
              </span>
              <YearSelect
                className="lg:w-[180px]"
                selectedYear={selectedYear}
                setSelectedYear={setSelectedYear}
              />
            </div>
          </div>
        </form>
        <div>
          <span className="block text-lg font-semibold mb-2">Image</span>
          <p className="text-sm text-muted-foreground mb-2">
            <Info className="inline mr-1 w-4" />
            The first image will be the book cover image. Maximum of 10 image.
            Aspect-ratio: 0.71 : 1
          </p>
          <div className="flex flex-col lg:flex-row">
            <div className="flex flex-col md:w-[240px]">
              <div
                {...getRootProps()}
                className={`border-dashed border-2 p-6 rounded-lg cursor-pointer mb-2 outline-none flex flex-col items-center justify-center gap-8 py-8 w-full md:w-[230px] aspect-[0.71/1] ${
                  isDragActive ? "border-blue-500" : "border-gray-300"
                }`}
              >
                <input {...getInputProps()} />
                <svg
                  width="1em"
                  height="1em"
                  viewBox="0 0 48 48"
                  preserveAspectRatio="xMidYMid meet"
                  fill="none"
                  role="presentation"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-9 w-9 flex-shrink-0 lg:h-6 lg:w-6 text-muted-foreground"
                >
                  <path
                    d="M44 24a2 2 0 1 0-4 0h4ZM24 8a2 2 0 1 0 0-4v4Zm15 32H9v4h30v-4ZM8 39V9H4v30h4Zm32-15v15h4V24h-4ZM9 8h15V4H9v4Zm0 32a1 1 0 0 1-1-1H4a5 5 0 0 0 5 5v-4Zm30 4a5 5 0 0 0 5-5h-4a1 1 0 0 1-1 1v4ZM8 9a1 1 0 0 1 1-1V4a5 5 0 0 0-5 5h4Z"
                    data-follow-fill="currentColor"
                    fill="currentColor"
                  ></path>
                  <path
                    strokeWidth="4"
                    d="m6 35 10.693-9.802a2 2 0 0 1 2.653-.044L32 36m-4-5 4.773-4.773a2 2 0 0 1 2.615-.186L42 31M30 12h12m-6-6v12"
                    data-follow-stroke="currentColor"
                    stroke="currentColor"
                  ></path>
                </svg>
                {isDragActive ? (
                  <p className="text-center text-sm text-muted-foreground">
                    Drop the files here ...
                  </p>
                ) : (
                  <p className="text-center text-sm text-muted-foreground">
                    Drag 'n' drop some files here, or click to select files.
                  </p>
                )}
              </div>
              {error && <p className="text-red font-bold">{error}</p>}
            </div>
            {localImages.length > 0 && (
              <div className="flex flex-wrap gap-4 lg:ml-4 admin-image-calc">
                {localImages.map((imageBlob, index) => (
                  <div
                    key={index}
                    className="relative w-full md:w-[240px] rounded-md"
                  >
                    <img
                      src={URL.createObjectURL(imageBlob)}
                      className="w-full h-full absolute top-0 left-0 object-cover"
                    />
                    <Button
                      className="w-fit rounded-full absolute top-2 right-2 p-2"
                      variant="secondary"
                      onClick={(e) => {
                        e.preventDefault();
                        handleRemoveImage(index);
                      }}
                    >
                      <X className="w-5" />
                    </Button>
                    {index === 0 && (
                      <div className="absolute top-0 left-[72px] p-2 rounded-b-lg bg-muted/80 text-sm">
                        Book Cover
                      </div>
                    )}
                    <div className="pt-[140%]"></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="w-full flex justify-end gap-2">
          <Button
            variant="secondary"
            onClick={(e) => {
              e.preventDefault();
              handleCancel();
            }}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            disabled={isLoading}
          >
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isLoading ? "Loading..." : isUploading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddBook;
