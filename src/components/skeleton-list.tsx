import { Skeleton } from "./ui/skeleton"

const SkeletonList = () => {
  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex justify-evenly items-center gap-4 my-4 w-full">
        <Skeleton className="w-64 h-10" />
        <Skeleton className="w-40 h-10" />
      </div>


      <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-8">
        <Skeleton className="w-full h-32" />
        <Skeleton className="w-full" />
        <Skeleton className="w-full" />
        <Skeleton className="w-full h-32" />
        <Skeleton className="w-full" />
        <Skeleton className="w-full" />
      </div>
    </div>
  )
}
export default SkeletonList