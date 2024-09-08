import { useCallback, useEffect, useRef, useState } from "react";
import imageCompression from "browser-image-compression";
import { useDropzone } from "react-dropzone";
import { TagsInput } from "react-tag-input-component";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import TipTap from "@/components/tiptap/TiptapMain";
import { CornerDownLeft, Info, X } from "lucide-react";
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

const AskQuestion = () => {
  const titleRef = useRef<HTMLTextAreaElement | null>(null);
  const tagsRef = useRef<HTMLTextAreaElement | null>(null);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
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
      navigate(`/other`);
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
        mutate({ imageBlobs: localImages, folderPath: "images/qna/" });
      } else {
        uploadDataTodb();
      }
    }
  };

  const uploadDataTodb = async () => {
    try {
      const imagePath = data?.map((item) => item.path);
      const imageUrl = data?.map((item) => item.url);

      await addDoc(collection(db, "qna"), {
        title: title,
        description: description,
        content: content,
        image: imageUrl?.[0] || "",
        images: imageUrl || [],
        imagesPath: imagePath || [],
        tags: tags,
        isAnswered: false,
        likes: [],
        date: new Date(),
        uploadedBy: currentUser.id,
      });

      toast({
        title: "Question Posted!",
      });

      navigate("/other");
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
        discardFunction={() => navigate("/other")}
      />
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Ask Question</h2>
        <p className="text-muted-foreground text-sm md:text-base">
          Type your question in the form.
        </p>
        <Separator className="!my-4" />
      </div>
      <div className="w-full flex flex-col mt-2 gap-4">
        <form className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="question-title"
              className="block text-lg font-semibold mb-2"
            >
              Question
            </label>
            <textarea
              id="question-title"
              className="w-full p-2 bg-muted/60 rounded resize-none outline-none"
              placeholder="Type question here..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              rows={2}
              ref={titleRef}
            />
          </div>
          <div>
            <span className="block text-lg font-semibold mb-2">
              Description
            </span>
            <p className="text-sm text-muted-foreground mb-2">
              <Info className="inline mr-1 w-4" />
              To write math, use the dollar symbol ($). Example: $x = 5$
            </p>
            <TipTap
              setContent={setContent}
              setDescription={setDescription}
              placeholder="Type question description hear..."
            />
          </div>
          <div>
            <div className="block text-lg font-semibold mb-2">Tags</div>
            <p className="text-sm text-muted-foreground mb-2">
              <Info className="inline mr-1 w-4" />
              Press enter <CornerDownLeft className="w-[14px] inline-block" />{" "}
              to separate tags.
            </p>
            <TagsInput
              placeHolder="Write tags here..."
              value={tags}
              onChange={setTags}
            />
          </div>
        </form>
        <Separator className="my-4" />
        <div>
          <span className="block text-lg font-semibold mb-2">Image</span>
          <div className="flex flex-col lg:flex-row">
            {localImages.length === 0 ? (
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
            ) : (
              <div className="flex flex-wrap gap-4 lg:ml-4">
                {localImages.map((imageBlob, index) => (
                  <div
                    key={index}
                    className="relative w-full md:max-w-[400px] rounded-md"
                  >
                    <img
                      src={URL.createObjectURL(imageBlob)}
                      className="w-full h-full top-0 left-0 object-contain"
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
            {isLoading ? "Loading..." : isUploading ? "Uploading..." : "Post"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AskQuestion;
