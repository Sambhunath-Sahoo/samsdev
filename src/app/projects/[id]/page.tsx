import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

// Project data
const projects = {
  "1": {
    id: "1",
    title: "E-Commerce Platform",
    description: "A full-stack e-commerce platform with payment integration, inventory management, and real-time order tracking.",
    image: "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    tags: ["Next.js", "TypeScript", "Stripe", "PostgreSQL", "Tailwind CSS"],
    demoUrl: "https://demo-ecommerce.vercel.app",
    githubUrl: "https://github.com/yourusername/ecommerce",
  },
  "2": {
    id: "2",
    title: "Task Management App",
    description: "Collaborative task management application with real-time updates, team workspaces, and advanced filtering.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    tags: ["React", "Node.js", "Socket.io", "MongoDB", "Redux"],
    demoUrl: "https://demo-taskapp.vercel.app",
    githubUrl: "https://github.com/yourusername/taskmanager",
  },
  "3": {
    id: "3",
    title: "Weather Dashboard",
    description: "Beautiful weather dashboard with location-based forecasts, interactive maps, and detailed weather analytics.",
    image: "https://images.unsplash.com/photo-1592210454359-9043f067919b?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    tags: ["React", "TypeScript", "OpenWeather API", "Chart.js"],
    demoUrl: "https://demo-weather.vercel.app",
    githubUrl: "https://github.com/yourusername/weather",
  },
  "4": {
    id: "4",
    title: "AI Chat Application",
    description: "Real-time chat application powered by AI with smart replies, sentiment analysis, and conversation history.",
    image: "https://images.unsplash.com/photo-1587560699334-cc4ff634909a?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    tags: ["Next.js", "OpenAI", "Prisma", "WebSocket", "Tailwind CSS"],
    demoUrl: "https://demo-aichat.vercel.app",
    githubUrl: "https://github.com/yourusername/aichat",
  },
  "5": {
    id: "5",
    title: "Portfolio CMS",
    description: "Content management system for portfolios with drag-and-drop builder, SEO optimization, and analytics dashboard.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    tags: ["Next.js", "Sanity CMS", "TypeScript", "Vercel"],
    demoUrl: "https://demo-cms.vercel.app",
    githubUrl: "https://github.com/yourusername/portfolio-cms",
  },
  "6": {
    id: "6",
    title: "Fitness Tracker",
    description: "Track workouts, nutrition, and progress with detailed analytics and personalized recommendations.",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    tags: ["React Native", "Firebase", "Redux", "Chart.js"],
    demoUrl: "https://demo-fitness.vercel.app",
    githubUrl: "https://github.com/yourusername/fitness-tracker",
  },
}

type ProjectPageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params
  const project = projects[id as keyof typeof projects]

  if (!project) {
    return (
      <div className="container max-w-7xl mx-auto px-6 md:px-8 lg:px-12 py-24 text-center">
        <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
        <Link href="/#projects">
          <Button>Back to Projects</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="container max-w-5xl mx-auto px-6 md:px-8 lg:px-12 py-12">
        {/* Back Button */}
        <Link href="/#projects" className="inline-block mb-8">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Button>
        </Link>


        {/* Video Section */}
        <div className="mb-8">
          <div className="relative aspect-video w-full overflow-hidden rounded-xl border bg-muted shadow-lg">
            <iframe
              src={project.videoUrl}
              title={`${project.title} Demo`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          </div>
        </div>

        {/* Project Content */}
        <div className="space-y-6 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold">{project.title}</h1>
          <p className="text-lg text-muted-foreground">
            {project.description}
          </p>
        </div>

      </div>
    </div>
  )
}

export async function generateStaticParams() {
  return Object.keys(projects).map((id) => ({
    id: id,
  }))
}
