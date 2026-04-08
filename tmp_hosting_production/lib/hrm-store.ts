import crypto from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type EmployeeStatus = "thu_viec" | "dang_lam" | "tam_nghi" | "nghi_viec";

export type EmployeeRecord = {
  id: string;
  code: string;
  fullName: string;
  citizenId: string;
  department: string;
  position: string;
  phone: string;
  email: string;
  startDate: string;
  salary: string;
  status: EmployeeStatus;
  notes: string;
  createdAt: string;
};

const dataDir = path.join(process.cwd(), "data");
const employeesFile = path.join(dataDir, "hrm-employees.json");

async function ensureEmployeesFile() {
  await mkdir(dataDir, { recursive: true });

  try {
    await readFile(employeesFile, "utf8");
  } catch {
    await writeFile(employeesFile, "[]", "utf8");
  }
}

async function readEmployees() {
  await ensureEmployeesFile();
  const raw = await readFile(employeesFile, "utf8");
  return JSON.parse(raw) as EmployeeRecord[];
}

async function writeEmployees(employees: EmployeeRecord[]) {
  await ensureEmployeesFile();
  await writeFile(employeesFile, JSON.stringify(employees, null, 2), "utf8");
}

function nextEmployeeCode(employees: EmployeeRecord[]) {
  return `NS-${String(employees.length + 1).padStart(3, "0")}`;
}

export async function listEmployees() {
  const employees = await readEmployees();
  return employees.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getEmployeeById(id: string) {
  const employees = await readEmployees();
  return employees.find((employee) => employee.id === id) || null;
}

export async function createEmployee(input: Omit<EmployeeRecord, "id" | "code" | "createdAt">) {
  const employees = await readEmployees();
  const employee: EmployeeRecord = {
    id: crypto.randomUUID(),
    code: nextEmployeeCode(employees),
    createdAt: new Date().toISOString(),
    ...input,
  };

  employees.unshift(employee);
  await writeEmployees(employees);
  return employee;
}

export async function updateEmployee(
  id: string,
  input: Omit<EmployeeRecord, "id" | "code" | "createdAt">,
) {
  const employees = await readEmployees();
  const employee = employees.find((item) => item.id === id);

  if (!employee) {
    throw new Error("Khong tim thay nhan vien.");
  }

  Object.assign(employee, input);
  await writeEmployees(employees);
  return employee;
}

export async function deleteEmployee(id: string) {
  const employees = await readEmployees();
  const nextEmployees = employees.filter((employee) => employee.id !== id);
  await writeEmployees(nextEmployees);
}
