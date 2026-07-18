import { expect, it, vi } from "vitest";

const query = vi.fn().mockResolvedValue([]);
vi.mock("@neondatabase/serverless", () => ({ neon: () => ({ query }) }));

import { factionBoard } from "./db";

it("reads boards without touching a local SQLite file", async () => {
  process.env.DATABASE_URL = "postgresql://test.invalid/meimei";
  process.env.MEIMEI_DB_PATH = "/proc/meimei.db";
  expect(await factionBoard()).toHaveLength(8);
  expect(query).toHaveBeenCalledOnce();
});
