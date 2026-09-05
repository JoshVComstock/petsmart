import { ProductGridSkeleton, Skeleton } from "@/components/ui/Skeleton";

/** Esqueleto con la misma geometría que /productos, para que no salte. */

const Loading = () => (
  <>
    <div className="bg-surface px-4 py-10 md:px-8 md:py-16 lg:px-[72px]">
      <div className="mx-auto max-w-[1296px]">
        <Skeleton className="h-5 w-28 rounded-md" />
        <Skeleton className="mt-4 h-11 w-80 rounded-md" />
        <Skeleton className="mt-4 h-5 w-96 rounded-md" />
      </div>
    </div>

    <div className="bg-white px-4 py-12 md:px-8 lg:px-[72px]">
      <div className="mx-auto flex max-w-[1296px] flex-col gap-10 lg:flex-row">
        <div className="hidden w-[306px] shrink-0 flex-col gap-4 lg:flex">
          {Array.from({ length: 8 }, (_, index) => (
            <Skeleton key={index} className="h-6 w-full rounded-md" />
          ))}
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-6 flex items-center justify-between">
            <Skeleton className="h-5 w-48 rounded-md" />
            <Skeleton className="h-10 w-44 rounded-[20px]" />
          </div>
          <ProductGridSkeleton count={9} />
        </div>
      </div>
    </div>
  </>
);

export default Loading;
