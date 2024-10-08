import request from "supertest";
import app from "../..";
import { clearDatabase } from "../../db.connection.js";

const req = request(app);

describe("User routes:", () => {
  let mockUser;

  beforeAll(() => {
    mockUser = { name: "Ali", email: "asd@asd.com", password: "1234" };
  });

  afterAll(async () => {
    await clearDatabase();
  });

  it("GET /user - should return an empty array of users", async () => {
    const res = await req.get("/user");

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(0);
  });

  it("POST /user/signup - should add user successfully", async () => {
    const res = await req.post("/user/signup").send(mockUser);

    expect(res.status).toBe(201);
    expect(res.body.data.email).toEqual(mockUser.email);
    mockUser._id = res.body.data._id;
  });

  it("POST /user/login - should not login invalid user", async () => {
    const res = await req
      .post("/user/login")
      .send({ email: mockUser.email, password: "xxx" });

    expect(res.status).toBe(401);
    expect(res.body.message).toContain("Invalid email or password");
  });

  it("POST /user/login - should login user successfully", async () => {
    const res = await req.post("/user/login").send(mockUser);

    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
  });

  it("GET /user/:id - should return the just added user by id", async () => {
    const res = await req.get(`/user/${mockUser._id}`);

    expect(res.status).toBe(200);
    expect(res.body.data._id).toBe(mockUser._id);
  });
});
