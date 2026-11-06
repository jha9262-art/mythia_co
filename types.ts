export type ProjectStatus = "planning" | "in-progress" | "review" | "completed";

export interface Project {
  id: string;
  title: string;
  client: string;
  description: string;
  status: ProjectStatus;
  team: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export type LeadStatus = "new" | "contacted" | "qualified" | "won" | "lost";

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  status: LeadStatus;
  notes: string;
  createdAt: string;
}

export interface Visitor {
  id: string;
  path: string;
  referrer: string | null;
  ip: string | null;
  userAgent: string | null;
  createdAt: string;
}
