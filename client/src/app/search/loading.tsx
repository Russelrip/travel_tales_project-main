import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="container py-10">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Search Travel Posts</CardTitle>
          <CardDescription>Find posts by country or username</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-10 w-full animate-pulse rounded-md bg-muted"></div>
          <div className="h-6 w-48 animate-pulse rounded-md bg-muted"></div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <div className="h-8 w-64 animate-pulse rounded-md bg-muted"></div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 animate-pulse rounded-full bg-muted"></div>
                  <div className="space-y-1">
                    <div className="h-4 w-24 animate-pulse rounded-md bg-muted"></div>
                    <div className="h-3 w-16 animate-pulse rounded-md bg-muted"></div>
                  </div>
                </div>
                <div className="mt-2 h-6 w-full animate-pulse rounded-md bg-muted"></div>
                <div className="mt-1 h-4 w-3/4 animate-pulse rounded-md bg-muted"></div>
              </CardHeader>
              <CardContent>
                <div className="h-16 w-full animate-pulse rounded-md bg-muted"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
