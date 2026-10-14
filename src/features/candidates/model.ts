import { z } from "zod";
export const roles = [
  "Front-End Developer",
  "Node.js Developer",
  "MEAN Stack Developer",
  "FULL Stack Developer",
] as const;
export const statuses = ["applied", "shortlisted", "rejected"] as const;
export const inputSchema = z.object({
  name: z.string().trim().min(2, "Enter at least 2 characters.").max(80),
  email: z.email("Enter a valid email address.").max(120),
  phone: z
    .string()
    .trim()
    .regex(/^[+\d ()-]{7,25}$/, "Enter a phone number with 7–25 characters."),
  skills: z.string().trim().min(2, "Add at least one skill.").max(250),
  jobTitle: z.enum(roles),
  experience: z
    .number({ error: "Enter years of experience from 0 to 50." })
    .min(0)
    .max(50),
});
export const candidateSchema = inputSchema.extend({
  id: z.string().min(1),
  status: z.enum(statuses),
  createdAt: z.iso.datetime(),
});
export type CandidateInput = z.infer<typeof inputSchema>;
export type Candidate = z.infer<typeof candidateSchema>;
export type Status = Candidate["status"];
export const statusLabel = (status: Status) =>
  ({ applied: "In review", shortlisted: "Shortlisted", rejected: "Rejected" })[
    status
  ];
export function transition(candidate: Candidate, status: Status): Candidate {
  if (candidate.status === status)
    throw new Error("This candidate already has that status.");
  return candidateSchema.parse({ ...candidate, status });
}
export type Filters = {
  query: string;
  role: string;
  status: string;
  sort: string;
  page: number;
};
export function readFilters(params: URLSearchParams): Filters {
  return {
    query: params.get("q") ?? "",
    role: roles.includes(params.get("role") as (typeof roles)[number])
      ? params.get("role")!
      : "",
    status: statuses.includes(params.get("status") as Status)
      ? params.get("status")!
      : "",
    sort: ["oldest", "name", "experience"].includes(params.get("sort") ?? "")
      ? params.get("sort")!
      : "newest",
    page: Math.max(1, Number.parseInt(params.get("page") ?? "1") || 1),
  };
}
export function filterCandidates(records: Candidate[], f: Filters) {
  const query = f.query.trim().toLowerCase();
  return records
    .filter(
      (c) =>
        (!f.role || c.jobTitle === f.role) &&
        (!f.status || c.status === f.status) &&
        `${c.name} ${c.email} ${c.skills}`.toLowerCase().includes(query),
    )
    .sort((a, b) =>
      f.sort === "name"
        ? a.name.localeCompare(b.name)
        : f.sort === "experience"
          ? b.experience - a.experience || a.name.localeCompare(b.name)
          : f.sort === "oldest"
            ? a.createdAt.localeCompare(b.createdAt)
            : b.createdAt.localeCompare(a.createdAt),
    );
}
