import { prisma } from "./db";
import type { Visitor } from "./types";

export interface VisitorStats {
  totalVisits: number;
  uniqueVisitors: number;
  visitsToday: number;
  topPages: { path: string; count: number }[];
}

function serialize(visitor: {
  id: string;
  path: string;
  referrer: string | null;
  ip: string | null;
  userAgent: string | null;
  createdAt: Date;
}): Visitor {
  return { ...visitor, createdAt: visitor.createdAt.toISOString() };
}

export async function recordVisit(input: {
  path: string;
  referrer: string | null;
  ip: string | null;
  userAgent: string | null;
}): Promise<Visitor> {
  const visitor = await prisma.visitor.create({ data: input });
  return serialize(visitor);
}

export async function getVisitors(limit = 500): Promise<Visitor[]> {
  const visitors = await prisma.visitor.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return visitors.map(serialize);
}

export async function getVisitorStats(): Promise<VisitorStats> {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const [totalVisits, uniqueVisitors, visitsToday, pageGroups] = await Promise.all([
    prisma.visitor.count(),
    prisma.visitor.groupBy({ by: ["ip"], _count: true }),
    prisma.visitor.count({ where: { createdAt: { gte: startOfToday } } }),
    prisma.visitor.groupBy({ by: ["path"], _count: true, orderBy: { _count: { path: "desc" } }, take: 5 }),
  ]);

  return {
    totalVisits,
    uniqueVisitors: uniqueVisitors.length,
    visitsToday,
    topPages: pageGroups.map((g: { path: string; _count: number }) => ({
      path: g.path,
      count: g._count,
    })),
  };
}
