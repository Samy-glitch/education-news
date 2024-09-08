import { useCallback, useEffect, useRef, useState } from "react";
import imageCompression from "browser-image-compression";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import TipTap from "@/components/tiptap/TiptapMain";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
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

const MIN_DIMENSION = 240;
const MAX_WIDTH = 1024;

const AddNews = () => {
  const titleRef = useRef<HTMLTextAreaElement | null>(null);
  const tagsRef = useRef<HTMLTextAreaElement | null>(null);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [tags, setTags] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [localImages, setLocalImages] = useState<Blob[]>([]);
  const [error, setError] = useState<string>("");
  const [cancelPreview, setCancelPreview] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const { mutate, isLoading: isUploading, isError, data } = useUploadImages();
  const { user: currentUser } = useUserContext();

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.height = "auto";
      titleRef.current.style.height = titleRef.current.scrollHeight + "px";
    }
  }, [title]);

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
    if (title || content || localImages?.[0]) {
      setCancelPreview(true);
    } else {
      navigate(`/admin/`);
    }
  };

  const handleSubmit = () => {
    if (!isLoading) {
      setIsLoading(true);
      if (!title) {
        setIsLoading(false);
        toast({
          variant: "destructive",
          title: "Please fill the title",
        });
        return;
      } else if (!content) {
        setIsLoading(false);
        toast({
          variant: "destructive",
          title: "Please fill the content",
        });
        return;
      } else if (!type) {
        setIsLoading(false);
        toast({
          variant: "destructive",
          title: "Please select a type",
        });
        return;
      } else if (!currentUser.id) {
        console.log("user not found!");
        setIsLoading(false);
        toast({
          variant: "destructive",
          title: "Somthing went wrong!",
          description: "Please try again later.",
        });
        return;
      } else if (localImages?.[0]) {
        mutate({ imageBlobs: localImages, folderPath: "images/news/" });
      } else {
        uploadDataTodb();
      }
    }
  };

  const uploadDataTodb = async () => {
    try {
      const imagePath = data?.map((item) => item.path);
      const imageUrl = data?.map((item) => item.url);

      await addDoc(collection(db, "news"), {
        title: title,
        description: description,
        content: content,
        image: imageUrl?.[0] || "",
        images: imageUrl || [],
        imagesPath: imagePath || [],
        type: type,
        tags: tags,
        likes: [],
        date: new Date(),
        uploadedBy: currentUser.id,
      });

      toast({
        title: "news Uploded!",
      });

      navigate("/admin");
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
        <h2 className="text-2xl font-bold tracking-tight">Add News</h2>
        <p className="text-muted-foreground text-sm md:text-base">
          The title, content and type are all important, but the image is
          optional.
        </p>
        <Separator className="!my-4" />
      </div>
      <div className="w-full flex flex-col mt-2 gap-4">
        <form className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="news-title"
              className="block text-lg font-semibold mb-2"
            >
              Title
            </label>
            <textarea
              id="news-title"
              className="w-full p-2 bg-muted/60 rounded resize-none outline-none"
              placeholder="Type news title here..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              rows={2}
              ref={titleRef}
            />
          </div>
          <div>
            <span className="block text-lg font-semibold mb-2">Content</span>
            <p className="text-sm text-muted-foreground mb-2">
              <Info className="inline mr-1 w-4" />
              To write math, use the dollar symbol ($). Example: $x = 5$
            </p>
            <TipTap
              setContent={setContent}
              setDescription={setDescription}
              placeholder="Type news content hear..."
            />
          </div>
          <div>
            <label
              htmlFor="news-tags"
              className="block text-lg font-semibold mb-2"
            >
              Tags
            </label>
            <p className="text-sm text-muted-foreground mb-2">
              <Info className="inline mr-1 w-4" />
              No need to use hashes (#), just write about the news. Example:
              Exam notice Exam routine
            </p>
            <textarea
              id="news-tags"
              className="w-full p-2 bg-muted/60 rounded resize-none outline-none"
              placeholder="Write tags here..."
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              rows={3}
              ref={tagsRef}
            />
          </div>
          <div>
            <span className="block text-lg font-semibold mb-2">News type</span>
            <Select value={type} onValueChange={(value) => setType(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Types</SelectLabel>
                  <SelectItem value="board">Board</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </form>
        <Separator className="my-4" />
        <div>
          <span className="block text-lg font-semibold mb-2">Image</span>
          <p className="text-sm text-muted-foreground mb-2">
            <Info className="inline mr-1 w-4" />
            The first image will be the news cover image. Maximum of 10 image.
          </p>
          <div className="flex flex-col lg:flex-row">
            <div className="flex flex-col md:w-[240px]">
              <div
                {...getRootProps()}
                className={`border-dashed border-2 p-6 rounded-lg cursor-pointer mb-2 outline-none flex flex-col items-center justify-center gap-8 py-8 w-full md:w-[230px] aspect-square ${
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
                      className="w-full h-full absolute top-0 left-0 object-contain"
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
                        News Cover
                      </div>
                    )}
                    <div className="pt-[100%]"></div>
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

export default AddNews;
