import Loader from "@/components/shared/Loader";
import { PostCard } from "@/components/shared/PostCard";
import { useGetRecentPosts } from "@/lib/react-query/queriesAndMutations";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangleIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Home = () => {
  const {
    data: posts,
    isLoading: isPostLoading,
    // isError: isErrorPosts,
  } = useGetRecentPosts();

  return (
    <div className="flex flex-col">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Home</h2>
        <p className="text-muted-foreground text-sm md:text-base">
          Home feeds.
        </p>
        <Separator className="!my-4" />
      </div>
      <Alert variant="destructive" className="mb-4">
        <AlertTriangleIcon className="h-4 w-4" />
        <AlertTitle>Under Development</AlertTitle>
        <AlertDescription>
          The page is currently under development. We appreciate your patience.
        </AlertDescription>
      </Alert>
      <div className="home-container">
        <div className="home-posts">
          {isPostLoading && !posts ? (
            <Loader />
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full">
              {posts?.docs.map((post) => (
                <PostCard post={post.data()} key={post.id} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
