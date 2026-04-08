import type { CustomerCrmStatus } from "./customer-crm-store";
import type { ManualCustomerRecord } from "./customer-store";
import type { LeadRecord } from "./lead-store";

export type CustomerSummary = {
  id: string;
  name: string;
  phone: string;
  email: string;
  company: string;
  leadCount: number;
  lastContactAt: string;
  eventTypes: string[];
  latestEventDate: string;
  latestLocation: string;
  latestBudget: string;
  latestMessage: string;
  status: CustomerCrmStatus;
};

export type CustomerHistoryItem = {
  id: string;
  source: "lead" | "manual";
  createdAt: string;
  eventType: string;
  eventDate: string;
  location: string;
  budget: string;
  message: string;
  company: string;
};

export function customerKey(lead: LeadRecord) {
  const normalizedPhone = lead.phone.replace(/\s+/g, "");
  const normalizedEmail = lead.email.trim().toLowerCase();
  const normalizedName = lead.name.trim().toLowerCase();

  return normalizedPhone || normalizedEmail || normalizedName || lead.id;
}

export function manualCustomerKey(customer: ManualCustomerRecord) {
  const normalizedPhone = customer.phone.replace(/\s+/g, "");
  const normalizedEmail = customer.email.trim().toLowerCase();
  const normalizedName = customer.name.trim().toLowerCase();

  return normalizedPhone || normalizedEmail || normalizedName || customer.id;
}

export function buildCustomerSummaries(leads: LeadRecord[]) {
  const bucket = new Map<string, CustomerSummary>();

  for (const lead of leads) {
    const key = customerKey(lead);
    const existing = bucket.get(key);

    if (!existing) {
      bucket.set(key, {
        id: key,
        name: lead.name || "Khach chua dat ten",
        phone: lead.phone || "",
        email: lead.email || "",
        company: "",
        leadCount: 1,
        lastContactAt: lead.createdAt,
        eventTypes: lead.eventType ? [lead.eventType] : [],
        latestEventDate: lead.date || "",
        latestLocation: lead.location || "",
        latestBudget: lead.budget || "",
        latestMessage: lead.message || "",
        status: "moi",
      });
      continue;
    }

    existing.leadCount += 1;

    if (lead.createdAt > existing.lastContactAt) {
      existing.lastContactAt = lead.createdAt;
      existing.latestEventDate = lead.date || existing.latestEventDate;
      existing.latestLocation = lead.location || existing.latestLocation;
      existing.latestBudget = lead.budget || existing.latestBudget;
      existing.latestMessage = lead.message || existing.latestMessage;
      existing.name = lead.name || existing.name;
      existing.phone = lead.phone || existing.phone;
      existing.email = lead.email || existing.email;
    }

    if (lead.eventType && !existing.eventTypes.includes(lead.eventType)) {
      existing.eventTypes.push(lead.eventType);
    }
  }

  return bucket;
}

export function buildCustomerHistory(
  customerId: string,
  leads: LeadRecord[],
  manualCustomers: ManualCustomerRecord[],
) {
  const leadHistory: CustomerHistoryItem[] = leads
    .filter((lead) => customerKey(lead) === customerId)
    .map((lead) => ({
      id: lead.id,
      source: "lead",
      createdAt: lead.createdAt,
      eventType: lead.eventType || "",
      eventDate: lead.date || "",
      location: lead.location || "",
      budget: lead.budget || "",
      message: lead.message || "",
      company: "",
    }));

  const manualHistory: CustomerHistoryItem[] = manualCustomers
    .filter((customer) => manualCustomerKey(customer) === customerId)
    .map((customer) => ({
      id: customer.id,
      source: "manual",
      createdAt: customer.createdAt,
      eventType: "Them thu cong",
      eventDate: "",
      location: "",
      budget: "",
      message: customer.note || "",
      company: customer.company || "",
    }));

  return [...leadHistory, ...manualHistory].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
}
