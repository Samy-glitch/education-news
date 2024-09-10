import { Skeleton } from "../ui/skeleton";

const NewsSkeleton = () => {
  return (
    <div className="flex items-start gap-4 overflow-visible relative pl-4 last:mb-4">
      <Skeleton className="h-24 w-24 rounded-md object-cover shadow-md aspect-square" />
      <div className="flex-1">
        <Skeleton className="absolute right-0 top-0 w-32 h-8 bg-muted/60 shadow rounded-md" />
      </div>
      <div className="news-bg" />
    </div>
  );
};

export default NewsSkeleton;
