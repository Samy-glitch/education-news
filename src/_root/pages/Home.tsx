import PostCard from "@/components/shared/PostCard";
import { useGetRecentPosts } from "@/lib/react-query/queriesAndMutations";
import { Separator } from "@/components/ui/separator";
import PostSkeleton from "@/components/skeletons/PostSkeleton";

const Home = () => {
  const { data: posts, isLoading, isError: error } = useGetRecentPosts();

  if (error) {
    return (
      <div className="h-[50vh] w-full flex items-center justify-center">
        <p className="text-muted-foreground">
          No Post found. Please check your internet connection.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Home</h2>
        <p className="text-muted-foreground text-sm md:text-base">
          Home feeds.
        </p>
        <Separator className="!my-4" />
      </div>
      {isLoading || !posts ? (
        <div className="box-border mt-4 flex flex-col gap-4">
          <PostSkeleton />
          <PostSkeleton />
        </div>
      ) : (
        <div className="box-border mt-4 flex flex-col gap-4">
          {posts?.map((post) => (
            <PostCard post={post} key={post.id} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
