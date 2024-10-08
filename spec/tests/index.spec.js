import request from "supertest";
import app from "../..";

const req = request(app);

describe("Root routes:", () => {
  it("GET / should return todos as an empty array", async () => {
    const res = await req.get("/");

    expect(res.body.data).toEqual([]);
  });

  it("GET /xx should return 404 Not Found", async () => {
    const res = await req.get("/xx");

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Not found");
  });
});
