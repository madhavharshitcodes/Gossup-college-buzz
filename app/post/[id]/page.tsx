import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import PostCard from "@/components/post-card"

interface PostPageProps {
  params: {
    id: string
  }
}

export default function PostPage({ params }: PostPageProps) {
  // In a real app, you would fetch the post data based on the ID
  const postData = {
    id: params.id,
    content: "Just saw two professors arguing in the parking lot about who deserves the last parking spot. Drama! 👀",
    timestamp: "5 hours ago",
    likes: 124,
    comments: 31,
    shares: 15,
  }

  return (
    <div className="container py-6">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/" className="flex items-center">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to feed
          </Link>
        </Button>
      </div>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Post Details</h1>
        <PostCard
          id={postData.id}
          content={postData.content}
          timestamp={postData.timestamp}
          likes={postData.likes}
          comments={postData.comments}
          shares={postData.shares}
        />
      </div>
    </div>
  )
}

