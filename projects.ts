import { prisma } from "./db";
import type { Project, ProjectStatus } from "./types";

function serialize(project: {
  id: string;
  title: string;
  client: string;
  description: string;
  status: string;
  team: string[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}): Project {
  return {
    ...project,
    status: project.status as ProjectStatus,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
  };
}

export async function getProjects(): Promise<Project[]> {
  const projects = await prisma.project.findMany({
    orderBy: { updatedAt: "desc" },
  });
  return projects.map(serialize);
}

export async function getProject(id: string): Promise<Project | null> {
  const project = await prisma.project.findUnique({ where: { id } });
  return project ? serialize(project) : null;
}

export async function createProject(
  input: Omit<Project, "id" | "createdAt" | "updatedAt">
): Promise<Project> {
  const project = await prisma.project.create({
    data: {
      title: input.title,
      client: input.client,
      description: input.description,
      status: input.status,
      team: input.team,
      tags: input.tags,
    },
  });
  return serialize(project);
}

export async function updateProject(
  id: string,
  input: Partial<Omit<Project, "id" | "createdAt">>
): Promise<Project | null> {
  try {
    const project = await prisma.project.update({
      where: { id },
      data: {
        ...(input.title !== undefined && { title: input.title }),
        ...(input.client !== undefined && { client: input.client }),
        ...(input.description !== undefined && { description: input.description }),
        ...(input.status !== undefined && { status: input.status }),
        ...(input.team !== undefined && { team: input.team }),
        ...(input.tags !== undefined && { tags: input.tags }),
      },
    });
    return serialize(project);
  } catch {
    return null;
  }
}

export async function deleteProject(id: string): Promise<boolean> {
  try {
    await prisma.project.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}
