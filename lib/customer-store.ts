import crypto from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const dataDir = path.join(process.cwd(), "data");
const customersFile = path.join(dataDir, "customers.json");

export type ManualCustomerRecord = {
  id: string;
  createdAt: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  note: string;
};

async function ensureCustomersFile() {
  await mkdir(dataDir, { recursive: true });

  try {
    await readFile(customersFile, "utf8");
  } catch {
    await writeFile(customersFile, "[]", "utf8");
  }
}

async function readCustomers() {
  await ensureCustomersFile();
  const raw = await readFile(customersFile, "utf8");
  return JSON.parse(raw) as ManualCustomerRecord[];
}

async function writeCustomers(customers: ManualCustomerRecord[]) {
  await ensureCustomersFile();
  await writeFile(customersFile, JSON.stringify(customers, null, 2), "utf8");
}

export async function getManualCustomers() {
  return readCustomers();
}

export async function createManualCustomer(
  customer: Omit<ManualCustomerRecord, "id" | "createdAt">,
) {
  const customers = await readCustomers();
  const nextCustomer: ManualCustomerRecord = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...customer,
  };

  customers.unshift(nextCustomer);
  await writeCustomers(customers);
  return nextCustomer;
}
