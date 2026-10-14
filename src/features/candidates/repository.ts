import { z } from "zod";
import {
  candidateSchema,
  inputSchema,
  roles,
  transition,
  type Candidate,
  type CandidateInput,
  type Status,
} from "./model";
export const STORAGE_KEY = "forma.candidates.v1";
const envelope = z.object({
  version: z.literal(1),
  candidates: z
    .array(candidateSchema)
    .max(10000)
    .refine(
      (items) => new Set(items.map((c) => c.id)).size === items.length,
      "Duplicate candidate IDs",
    ),
});
const names = [
  "Avery Morgan",
  "Jordan Ellis",
  "Casey Rivera",
  "Riley Chen",
  "Taylor Brooks",
  "Samira Vale",
  "Noah Quinn",
  "Alex Parker",
  "Maya Sterling",
  "Elliot Reed",
  "Sasha Bell",
  "Jamie Rowan",
  "Robin Hayes",
  "Drew Collins",
  "Aria Wells",
  "Finley Hart",
];
export const fixtures: Candidate[] = names.map((name, i) => ({
  id: `demo-${i + 1}`,
  name,
  email: `${name.toLowerCase().replace(" ", ".")}@example.com`,
  phone: `+1 202 555 ${String(100 + i).padStart(4, "0")}`,
  skills: [
    "React, TypeScript, CSS",
    "Node.js, PostgreSQL, APIs",
    "Angular, MongoDB, Node.js",
    "React, Node.js, SQL",
  ][i % 4],
  jobTitle: roles[i % 4],
  experience: [5, 3, 7, 4, 2, 6, 4, 8][i % 8],
  status: i % 5 === 0 ? "shortlisted" : i % 7 === 0 ? "rejected" : "applied",
  createdAt: `2026-10-${String(14 - Math.floor(i / 2)).padStart(2, "0")}T09:00:00.000Z`,
}));
export interface CandidateRepository {
  load(): { candidates: Candidate[]; warning: string };
  save(candidates: Candidate[]): Promise<void>;
}
export class LocalCandidateRepository implements CandidateRepository {
  constructor(private storage: Pick<Storage, "getItem" | "setItem">) {}
  load() {
    try {
      const raw = this.storage.getItem(STORAGE_KEY);
      return {
        candidates: raw
          ? envelope.parse(JSON.parse(raw)).candidates
          : structuredClone(fixtures),
        warning: "",
      };
    } catch {
      return {
        candidates: structuredClone(fixtures),
        warning:
          "Saved data could not be read. A temporary demo is shown. Reset demo data to recover local saving.",
      };
    }
  }
  async save(candidates: Candidate[]) {
    const data = envelope.parse({ version: 1, candidates });
    try {
      this.storage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      throw new Error(
        "Unable to save in this browser. Check available storage and browser privacy settings, then try again.",
      );
    }
  }
}
export function createCandidate(input: CandidateInput): Candidate {
  return candidateSchema.parse({
    ...inputSchema.parse(input),
    id: crypto.randomUUID(),
    status: "applied",
    createdAt: new Date().toISOString(),
  });
}
export function changeStatus(records: Candidate[], id: string, status: Status) {
  return records.map((c) => (c.id === id ? transition(c, status) : c));
}
