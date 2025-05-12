import { Card, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="container py-10">
      <div className="mb-8">
        <div className="flex items-center space-x-4">
          <div className="h-20 w-20 animate-pulse rounded-full bg-muted"></div>
          <div className="space-y-2">
            <div className="h-6 w-32 animate-pulse rounded-md bg-muted"></div>
            <div className="h-4 w-48 animate-pulse rounded-md bg-muted"></div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="h-6 w-full animate-pulse rounded-md bg-muted"></div>
              <div className="mt-2 h-4 w-3/4 animate-pulse rounded-md bg-muted"></div>
            </CardHeader>
            <div className="p-6">
              <div className="h-20 w-full animate-pulse rounded-md bg-muted"></div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
