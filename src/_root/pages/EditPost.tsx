import { useEffect, useRef, useState } from "react";
import { TagsInput } from "react-tag-input-component";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CornerDownLeft, Info } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetPostById } from "@/lib/react-query/queriesAndMutations";
import { Icons } from "@/components/shared/ui/icons";
import { toast } from "@/components/ui/use-toast";
import { useUserContext } from "@/context/authContext";
import { DeleteDialog, DiscardDialog } from "@/components/shared/Dialogs";
import { IPost } from "@/types";
import Latex from "react-latex-next";

const EditPost = () => {
  const titleRef = useRef<HTMLTextAreaElement | null>(null);
  const tagsRef = useRef<HTMLTextAreaElement | null>(null);
  const [title, setTitle] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [image, setImage] = useState<string>("");
  const [cancelPreview, setCancelPreview] = useState<boolean>(false);
  const [deletePreview, setDeletePreview] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const { id } = useParams();

  const { user: currentUser } = useUserContext();
  const { data, error } = useGetPostById(id || "");
  const [post, setPost] = useState<IPost | null>(null);

  useEffect(() => {
    if (data) {
      if (!currentUser.isAadmin) {
        if (data.uploadedBy !== currentUser.uid) {
          console.log(currentUser.isAadmin);
          navigate("/home");
          return;
        }
      }
      setPost(data);
      setTitle(data.title);
      setImage(data.image);
      setTags(data.tags);
    }
    if (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Somthing went wrong!",
        description: "Please try again later.",
      });
    }
  }, [data, error]);

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

  const handleCancel = () => {
    if (title) {
      setCancelPreview(true);
    } else {
      navigate(`/home`);
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
        uploadDataTodb();
      }
    }
  };

  const uploadDataTodb = async () => {
    try {
      /* mutateCreatePost({
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
        uploadedBy: currentUser.uid,
      }); */
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

  return (
    <div>
      <DiscardDialog
        open={cancelPreview}
        onOpenChange={setCancelPreview}
        discardFunction={() => navigate("/other")}
      />
      <DeleteDialog
        open={deletePreview}
        onOpenChange={setDeletePreview}
        collection="posts"
        docId={id || ""}
        deleteType="Post"
        onSuccess={() => {
          navigate("/other");
          toast({
            title: "Post deleted successfully",
          });
        }}
      />
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Edit Post</h2>
        <p className="text-muted-foreground text-sm md:text-base">
          Type your Post in the form.
        </p>
        <Separator className="!my-4" />
      </div>
      <div className="w-full flex flex-col mt-2 gap-4">
        <form className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="post-title"
              className="block text-lg font-semibold mb-2"
            >
              Post Title
            </label>
            <textarea
              id="post-title"
              className="w-full p-2 bg-muted/60 rounded resize-none outline-none"
              placeholder="Type post here..."
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
            <div className="p-2 rounded-md bg-muted/60 tiptap-content w-full min-h-[112px]">
              {post?.content && <Latex>{post?.content}</Latex>}
            </div>
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
        {image && (
          <div>
            <span className="block text-lg font-semibold mb-2">Image</span>
            <div className="flex flex-col lg:flex-row">
              <div className="flex flex-wrap gap-4 lg:ml-4">
                <div className="relative w-full md:max-w-[400px] rounded-md">
                  <img
                    src={image}
                    className="w-full h-full top-0 left-0 object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
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
            variant="destructive"
            onClick={(e) => {
              e.preventDefault();
              setDeletePreview(true);
            }}
            disabled={isLoading}
          >
            Delete
          </Button>
          <Button
            variant="default"
            type="submit"
            onClick={(e) => {
              e.preventDefault();
            }}
            disabled
          >
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isLoading ? "Uploading..." : "Update"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditPost;
