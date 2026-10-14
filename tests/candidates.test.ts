import { describe, expect, it } from "vitest";
import {
  filterCandidates,
  inputSchema,
  readFilters,
  roles,
  transition,
} from "../src/features/candidates/model";
import {
  fixtures,
  LocalCandidateRepository,
  STORAGE_KEY,
  changeStatus,
  createCandidate,
} from "../src/features/candidates/repository";
const base = readFilters(new URLSearchParams());
describe("candidate queries", () => {
  it("searches skills case insensitively without changing fixtures", () => {
    expect(
      filterCandidates(fixtures, { ...base, query: "  TYPESCRIPT " }).length,
    ).toBe(4);
    expect(fixtures[0].id).toBe("demo-1");
  });
  it("combines role and status", () => {
    expect(
      filterCandidates(fixtures, {
        ...base,
        role: roles[0],
        status: "shortlisted",
      }).map((c) => c.id),
    ).toEqual(["demo-1"]);
  });
  it("sorts by experience and name", () => {
    expect(
      filterCandidates(fixtures, { ...base, sort: "experience" })[0].experience,
    ).toBe(8);
    expect(filterCandidates(fixtures, { ...base, sort: "name" })[0].name).toBe(
      "Alex Parker",
    );
  });
  it("validates URL filters and page", () => {
    expect(
      readFilters(
        new URLSearchParams("role=nope&status=nope&page=-5&sort=oops"),
      ),
    ).toEqual(base);
    expect(
      readFilters(new URLSearchParams("q=React&page=2&status=applied")).page,
    ).toBe(2);
  });
  it("returns no results for an unmatched query", () =>
    expect(
      filterCandidates(fixtures, { ...base, query: "missing person" }),
    ).toEqual([]));
});
describe("input and transitions", () => {
  it("rejects invalid form fields", () => {
    expect(
      inputSchema.safeParse({
        ...fixtures[0],
        name: "",
        email: "bad",
        phone: "x",
        skills: "",
        experience: -1,
      }).success,
    ).toBe(false);
    expect(
      inputSchema.safeParse({ ...fixtures[0], experience: 51 }).success,
    ).toBe(false);
  });
  it("creates a validated applied candidate", () => {
    const c = createCandidate(fixtures[0]);
    expect(c.id).not.toBe(fixtures[0].id);
    expect(c.status).toBe("applied");
  });
  it.each(["applied", "shortlisted", "rejected"] as const)(
    "can move to %s from a different state",
    (status) => {
      const c = {
        ...fixtures[0],
        status:
          status === "applied" ? ("rejected" as const) : ("applied" as const),
      };
      expect(transition(c, status).status).toBe(status);
      expect(() => transition({ ...c, status }, status)).toThrow();
    },
  );
  it("changes only the target and keeps input immutable", () => {
    const next = changeStatus(fixtures, "demo-2", "rejected");
    expect(next[1].status).toBe("rejected");
    expect(fixtures[1].status).toBe("applied");
    expect(next[0]).toBe(fixtures[0]);
  });
});
describe("versioned persistence", () => {
  it("loads fixtures when empty and round trips saved edits", async () => {
    const map = new Map<string, string>();
    const repo = new LocalCandidateRepository({
      getItem: (k) => map.get(k) ?? null,
      setItem: (k, v) => {
        map.set(k, v);
      },
    });
    expect(repo.load().candidates).toEqual(fixtures);
    await repo.save(changeStatus(fixtures, "demo-2", "rejected"));
    expect(repo.load().candidates[1].status).toBe("rejected");
    expect(JSON.parse(map.get(STORAGE_KEY)!).version).toBe(1);
  });
  it.each([
    "{",
    '{"version":99,"candidates":[]}',
    '{"version":1,"candidates":[{}]}',
  ])("recovers invalid storage %s", (raw) => {
    const result = new LocalCandidateRepository({
      getItem: () => raw,
      setItem: () => {},
    }).load();
    expect(result.warning).toBeTruthy();
    expect(result.candidates).toHaveLength(16);
  });
  it("reports unavailable storage and failed writes", async () => {
    const repo = new LocalCandidateRepository({
      getItem: () => {
        throw Error("disabled");
      },
      setItem: () => {
        throw Error("quota");
      },
    });
    expect(repo.load().warning).toBeTruthy();
    await expect(repo.save(fixtures)).rejects.toThrow("Unable to save");
  });
  it("rejects duplicate records at the boundary", async () => {
    const repo = new LocalCandidateRepository({
      getItem: () => null,
      setItem: () => {},
    });
    await expect(repo.save([fixtures[0], fixtures[0]])).rejects.toThrow();
  });
});
