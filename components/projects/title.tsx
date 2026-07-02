/**
 * @file components/projects/title.tsx
 * @description Heading component displayed at the top of each project dashboard.
 */

import * as React from "react"

interface ProjectTitleProps {
  projectName: string;
  Icon: React.ComponentType<{ className?: string }>;
}

/**
 * ProjectTitle Component
 * Renders the main page header name, icon, and dynamic descriptive subtitle.
 */
export function ProjectTitle({ projectName, Icon }: ProjectTitleProps) {
  return (
    <div className="flex flex-col gap-1.5 mb-6">
      <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-foreground">
        <Icon className="h-6 w-6 text-primary" />
        {projectName}
      </h1>
      <p className="text-sm text-muted-foreground">
        Manage the directory of {projectName.toLowerCase()}, edit records, and configure settings.
      </p>
    </div>
  )
}
