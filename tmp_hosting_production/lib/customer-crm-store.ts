import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type CustomerCrmStatus = "moi" | "dang_trao_doi" | "da_gui_bao_gia" | "chot";

export type CustomerCrmRecord = {
  customerId: string;
  status: CustomerCrmStatus;
  updatedAt: string;
};

const dataDir = path.join(process.cwd(), "data");
const crmFile = path.join(dataDir, "customer-crm.json");

async function ensureCrmFile() {
  await mkdir(dataDir, { recursive: true });

  try {
    await readFile(crmFile, "utf8");
  } catch {
    await writeFile(crmFile, "[]", "utf8");
  }
}

async function readCrmRecords() {
  await ensureCrmFile();
  const raw = await readFile(crmFile, "utf8");
  return JSON.parse(raw) as CustomerCrmRecord[];
}

async function writeCrmRecords(records: CustomerCrmRecord[]) {
  await ensureCrmFile();
  await writeFile(crmFile, JSON.stringify(records, null, 2), "utf8");
}

export async function getCustomerCrmMap() {
  const records = await readCrmRecords();
  return new Map(records.map((record) => [record.customerId, record]));
}

export async function upsertCustomerCrmStatus(
  customerId: string,
  status: CustomerCrmStatus,
) {
  const records = await readCrmRecords();
  const nextRecord: CustomerCrmRecord = {
    customerId,
    status,
    updatedAt: new Date().toISOString(),
  };

  const nextRecords = records.filter((record) => record.customerId !== customerId);
  nextRecords.unshift(nextRecord);
  await writeCrmRecords(nextRecords);
  return nextRecord;
}
