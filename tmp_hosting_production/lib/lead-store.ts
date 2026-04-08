import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { isSupabaseConfigured, supabaseInsert, supabaseSelect } from "./supabase-rest";

const dataDir = path.join(process.cwd(), "data");
const leadsFile = path.join(dataDir, "leads.json");

export type LeadRecord = {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  email: string;
  eventType: string;
  date: string;
  location: string;
  guests: string;
  budget: string;
  message: string;
};

type LeadRow = {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  email: string;
  event_type: string;
  event_date: string;
  location: string;
  guests: string;
  budget: string;
  message: string;
};

async function ensureLeadsFile() {
  await mkdir(dataDir, { recursive: true });

  try {
    await readFile(leadsFile, "utf8");
  } catch {
    await writeFile(leadsFile, "[]", "utf8");
  }
}

async function readLeads(): Promise<LeadRecord[]> {
  await ensureLeadsFile();
  const raw = await readFile(leadsFile, "utf8");
  return JSON.parse(raw) as LeadRecord[];
}

async function writeLeads(leads: LeadRecord[]) {
  await ensureLeadsFile();
  await writeFile(leadsFile, JSON.stringify(leads, null, 2), "utf8");
}

function rowToLead(row: LeadRow): LeadRecord {
  return {
    id: row.id,
    createdAt: row.created_at,
    name: row.name,
    phone: row.phone,
    email: row.email,
    eventType: row.event_type,
    date: row.event_date,
    location: row.location,
    guests: row.guests,
    budget: row.budget,
    message: row.message,
  };
}

export async function saveLead(lead: Omit<LeadRecord, "id" | "createdAt">) {
  if (isSupabaseConfigured()) {
    const inserted = await supabaseInsert<LeadRow>("leads", {
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      event_type: lead.eventType,
      event_date: lead.date,
      location: lead.location,
      guests: lead.guests,
      budget: lead.budget,
      message: lead.message,
    });

    return rowToLead(inserted[0]);
  }

  const leads = await readLeads();
  const nextLead: LeadRecord = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...lead,
  };

  leads.unshift(nextLead);
  await writeLeads(leads);
  return nextLead;
}

export async function getLeads() {
  if (isSupabaseConfigured()) {
    const rows = await supabaseSelect<LeadRow>("leads", {
      select: "*",
      order: "created_at.desc",
    });
    return rows.map(rowToLead);
  }

  return readLeads();
}

type LeadStatsOptions = {
  startDate?: string;
  endDate?: string;
};

export async function getLeadStats(options?: LeadStatsOptions) {
  const leads = await getLeads();
  const filtered = leads.filter((lead) => {
    const dateKey = lead.createdAt.slice(0, 10);

    if (options?.startDate && dateKey < options.startDate) {
      return false;
    }

    if (options?.endDate && dateKey > options.endDate) {
      return false;
    }

    return true;
  });

  return {
    total: filtered.length,
    recent: filtered.slice(0, 5),
  };
}
