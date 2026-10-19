import { beforeEach, describe, expect, it, vi } from "vitest";

const authMock = vi.hoisted(() => vi.fn());
const storeMock = vi.hoisted(() => ({ getCompletedPointIds: vi.fn(), setPointCompleted: vi.fn() }));

vi.mock("@/auth", () => ({ auth: authMock }));
vi.mock("@/lib/roadmap/progress-store", () => storeMock);

import { GET, PUT } from "./route";

const POINT_ID = "sd.foundations.vertical-vs-horizontal";
const HOST = "sams.dev";

function putRequest(body: unknown, headers: Record<string, string> = { origin: `https://${HOST}`, host: HOST }) {
  return new Request(`https://${HOST}/api/roadmap/progress`, {
    method: "PUT",
    headers: { "content-type": "application/json", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.resetAllMocks();
  vi.spyOn(console, "error").mockImplementation(() => undefined);
});

describe("GET /api/roadmap/progress", () => {
  it("returns 401 when signed out", async () => {
    authMock.mockResolvedValue(null);
    expect((await GET()).status).toBe(401);
  });

  it("returns the signed-in user's completed ids", async () => {
    authMock.mockResolvedValue({ user: { id: "u1" } });
    storeMock.getCompletedPointIds.mockResolvedValue([POINT_ID]);
    const res = await GET();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ success: true, data: { completed: [POINT_ID] }, error: null });
    expect(storeMock.getCompletedPointIds).toHaveBeenCalledWith("u1");
  });

  it("returns 500 without leaking details when the store fails", async () => {
    authMock.mockResolvedValue({ user: { id: "u1" } });
    storeMock.getCompletedPointIds.mockRejectedValue(new Error("connection string leaked"));
    const res = await GET();
    expect(res.status).toBe(500);
    expect(JSON.stringify(await res.json())).not.toContain("leaked");
  });
});

describe("PUT /api/roadmap/progress", () => {
  it("returns 403 for a cross-site origin", async () => {
    authMock.mockResolvedValue({ user: { id: "u1" } });
    const res = await PUT(putRequest({ pointId: POINT_ID, completed: true }, { origin: "https://evil.example", host: HOST }));
    expect(res.status).toBe(403);
    expect(storeMock.setPointCompleted).not.toHaveBeenCalled();
  });

  it("returns 401 when signed out", async () => {
    authMock.mockResolvedValue(null);
    expect((await PUT(putRequest({ pointId: POINT_ID, completed: true }))).status).toBe(401);
  });

  it("returns 400 for invalid JSON", async () => {
    authMock.mockResolvedValue({ user: { id: "u1" } });
    expect((await PUT(putRequest("{not json"))).status).toBe(400);
  });

  it("returns 400 for an unknown point", async () => {
    authMock.mockResolvedValue({ user: { id: "u1" } });
    expect((await PUT(putRequest({ pointId: "made.up", completed: true }))).status).toBe(400);
    expect(storeMock.setPointCompleted).not.toHaveBeenCalled();
  });

  it("saves a tick for the signed-in user", async () => {
    authMock.mockResolvedValue({ user: { id: "u1" } });
    storeMock.setPointCompleted.mockResolvedValue(undefined);
    const res = await PUT(putRequest({ pointId: POINT_ID, completed: true }));
    expect(res.status).toBe(200);
    expect(storeMock.setPointCompleted).toHaveBeenCalledWith("u1", POINT_ID, true);
  });

  it("returns 500 when the store fails", async () => {
    authMock.mockResolvedValue({ user: { id: "u1" } });
    storeMock.setPointCompleted.mockRejectedValue(new Error("db down"));
    expect((await PUT(putRequest({ pointId: POINT_ID, completed: false }))).status).toBe(500);
  });
});
