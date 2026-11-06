import { prisma } from "./db";
import type { ContactMessage, LeadStatus } from "./types";

const LEAD_STATUSES: LeadStatus[] = ["new", "contacted", "qualified", "won", "lost"];

function serialize(message: {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  status: string;
  notes: string;
  createdAt: Date;
}): ContactMessage {
  return {
    ...message,
    status: (LEAD_STATUSES.includes(message.status as LeadStatus)
      ? message.status
      : "new") as LeadStatus,
    createdAt: message.createdAt.toISOString(),
  };
}

export async function saveMessage(
  input: Omit<ContactMessage, "id" | "createdAt" | "read" | "status" | "notes">
): Promise<ContactMessage> {
  const message = await prisma.contactMessage.create({ data: input });
  return serialize(message);
}

export async function getMessages(): Promise<ContactMessage[]> {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });
  return messages.map(serialize);
}

export async function updateMessage(
  id: string,
  data: { read?: boolean; status?: LeadStatus; notes?: string }
): Promise<ContactMessage | null> {
  try {
    const message = await prisma.contactMessage.update({
      where: { id },
      data,
    });
    return serialize(message);
  } catch {
    return null;
  }
}

export async function setMessageRead(
  id: string,
  read: boolean
): Promise<ContactMessage | null> {
  return updateMessage(id, { read });
}

export async function deleteMessage(id: string): Promise<boolean> {
  try {
    await prisma.contactMessage.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}
