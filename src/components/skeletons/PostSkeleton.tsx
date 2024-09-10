import { Dot } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

const PostSkeleton = () => {
  return (
    <div className="flex flex-col relative rounded-md bg-muted/30 p-2 max-w-[750px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="font-onest ml-2">
            <div className="flex ">
              <Skeleton className="h-6 w-[120px]" />
              <div className="flex ">
                <Dot className="text-muted" />
                <Skeleton className="h-5 w-10" />
              </div>
            </div>
            <Skeleton className="h-4 w-10 mt-1" />
          </div>
        </div>
      </div>

      <div className="px-4 pt-4">
        <Skeleton className="h-7 w-full" />
        <Skeleton className="h-7 w-[70%] mt-2" />
        <div className="w-full h-[440px] pt-4">
          <Skeleton className="w-full h-full rounded-md" />
        </div>
      </div>
      <div className="px-4 pt-5 flex items-center">
        <Skeleton className="w-[60px] h-[42px]" />
        <Skeleton className="w-[60px] h-[42px] ml-2" />
      </div>
    </div>
  );
};

export default PostSkeleton;
