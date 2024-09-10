import { Skeleton } from "../ui/skeleton";

const BookSkeleton = () => {
  return (
    <div className="w-[45%] md:w-[25%] lg:w-[20%] xl:w-[15%] 2xl:w-[10%] px-2 float-left overflow-visible mb-6 mr-4 relative">
      <div className="overflow-hidden relative rounded-md shadow-md transition-all duration-300">
        <div className="w-full pb-[140%] relative">
          <Skeleton className="h-full w-full absolute rounded-md" />
        </div>
      </div>
      <div className="flex flex-col gap-1 mt-1">
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-[80%] h-4" />
      </div>
      <Skeleton className="absolute -top-2 right-0 w-[67px] h-[22px] rounded-md shadow-md" />
      <Skeleton className="absolute top-[18px] -right-4 w-[56px] h-[22px] rounded-md shadow-md" />
      <div className="book-element-bg" />
    </div>
  );
};

export default BookSkeleton;
