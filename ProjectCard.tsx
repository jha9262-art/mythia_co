import type { Project, ProjectStatus } from "@/lib/types";

const statusStyles: Record<ProjectStatus, string> = {
  planning: "bg-slate-100 text-slate-700",
  "in-progress": "bg-blue-100 text-blue-700",
  review: "bg-amber-100 text-amber-700",
  completed: "bg-green-100 text-green-700",
};

const statusLabels: Record<ProjectStatus, string> = {
  planning: "Planning",
  "in-progress": "In Progress",
  review: "In Review",
  completed: "Completed",
};

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-lg font-semibold text-slate-900">{project.title}</h3>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${statusStyles[project.status]}`}
        >
          {statusLabels[project.status]}
        </span>
      </div>
      <p className="mt-1 text-sm text-slate-500">Client: {project.client}</p>
      <p className="mt-3 text-sm text-slate-600">{project.description}</p>
      {project.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-brand-50 px-2 py-1 text-xs text-brand-700"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
