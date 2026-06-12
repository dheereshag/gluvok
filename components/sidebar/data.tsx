import { LifeBuoy, Send } from "lucide-react"
import { PROJECTS } from "@/lib/projects"

export const SIDEBAR_DATA = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: <LifeBuoy />,
    },
    {
      title: "Feedback",
      url: "#",
      icon: <Send />,
    },
  ],
  navMain: PROJECTS.map((project) => {
    const Icon = project.icon
    return {
      title: project.name,
      url: `/projects/${project.slug}`,
      icon: <Icon />,
    }
  }),
}
