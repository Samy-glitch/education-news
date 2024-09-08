import QnACard from "@/components/shared/QnACard";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetQnA } from "@/lib/react-query/queriesAndMutations";
import { Dot } from "lucide-react";
const QandA = () => {
  const { data: qnas, isLoading, error } = useGetQnA();

  if (error) {
    return (
      <div className="h-[50vh] w-full flex items-center justify-center">
        <p className="text-muted-foreground">
          No Q&A found. Please check your internet connection.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Q&A</h2>
        <p className="text-muted-foreground text-sm md:text-base">
          Question and answers.
        </p>
        <Separator className="!my-4" />
      </div>
      {isLoading || !qnas ? (
        <div className="box-border mt-4 flex flex-col gap-4">
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
        </div>
      ) : (
        <div className="box-border mt-4 flex flex-col gap-4">
          {qnas?.map((qna) => (
            <QnACard qna={qna} key={qna.id} />
          ))}
        </div>
      )}
    </div>
  );
};

export default QandA;
