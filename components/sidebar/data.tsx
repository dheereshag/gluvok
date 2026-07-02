/**
 * @file components/sidebar/data.tsx
 * @description Static navigation configuration data for mapping user profiles and project routes in the sidebar.
 */

import { LifeBuoy, Send } from "lucide-react"
import { PROJECTS } from "@/lib/projects"

/**
 * SIDEBAR_DATA configuration
 * Structures secondary support links, default user avatars, and maps active registry projects to main menu items.
 */
export const SIDEBAR_DATA = {
  user: {
    name: "John Doe",
    email: "m@example.com",
    avatar: "/avatars/profile-default.jpg",
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
