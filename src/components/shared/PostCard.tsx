import { useUserContext } from "@/context/authContext";
import { useGetUserById } from "@/lib/react-query/queriesAndMutations";
import { multiFormatDateString } from "@/lib/utils";
import { IUploder } from "@/types";
import { Edit } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const PostCard = ({ post }: any) => {
  const { user } = useUserContext();
  const [uploader, setUploder] = useState<IUploder | null>(null);

  if (!post.uploadedBy) return;

  const { data /* error, isLoading */ } = useGetUserById(post.uploadedBy);

  useEffect(() => {
    if (data) {
      setUploder(data);
    }
  }, [data]);

  return (
    <div className="post-card">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${uploader?.uid}`}>
            <img
              src={
                uploader?.photoURL || "/assets/icons/profile-placeholder.svg"
              }
              alt="creator"
              className="rounded-full w-12 lg:h-12"
            />
          </Link>
          <div className="flex flex-col">
            <p className="base-medium lg:body-bold text-light-1">
              {uploader?.displayName}
            </p>
            <div className="flex-center gap-2 text-light-3">
              <p className="subtle-semibold lg:small-regular">
                {multiFormatDateString(post.$createdAt)}
              </p>
            </div>
          </div>
        </div>

        <Link
          to={`/update-post/${post.$id}`}
          className={`${user.id !== post.uploadedBy && "hidden"}`}
        >
          <Edit className="h-5 w-5" />
        </Link>
      </div>

      <Link to={`/posts/${post.$id}`}>
        <div className="small-medium lg:base-medium py-5">
          <p>{post.description}</p>
          {post.tag && (
            <ul className="flex gap-1 mt-2">
              {post.tags.map((tag: string) => (
                <li key={tag} className="text-light-3">
                  #{tag}
                </li>
              ))}
            </ul>
          )}
        </div>

        <img
          src={post.image || "public/assets/icons/profile-placeholder.svg"}
          alt="post image"
          className="post-card_img"
        />
      </Link>

      {/* <PostStats post={post} userId={user.id} /> */}
    </div>
  );
};
