import request from "supertest";
import app from "../..";
import { clearDatabase } from "../../db.connection.js";

const req = request(app);

describe("Todo routes:", () => {
  let mockUser, userToken, todoInDB;

  beforeAll(async () => {
    mockUser = { name: "Ali", email: "asd@asd.com", password: "1234" };
    await req.post("/user/signup").send(mockUser);
    const res = await req.post("/user/login").send(mockUser);
    userToken = res.body.data;
  });

  afterAll(async () => {
    await clearDatabase();
  });

  it("GET /todo - should return an empty array of todos", async () => {
    const res = await req.get("/todo");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(0);
  });

  it("POST /todo - should not add a todo for unauthenticated users", async () => {
    const res = await req.post("/todo").send({ title: "eating breakfast" });

    expect(res.status).toBe(401);
    expect(res.body.message).toContain("please login first");
  });

  it("POST /todo - should add a todo for authenticated users", async () => {
    const res = await req
      .post("/todo")
      .send({ title: "eating breakfast" })
      .set({ authorization: userToken });

    expect(res.status).toBe(201);
    expect(res.body.data.title).toBe("eating breakfast");
    todoInDB = res.body.data;
  });

  it("GET /todo/:id - should return the just added todo", async () => {
    const res = await req
      .get(`/todo/${todoInDB._id}`)
      .set({ authorization: userToken });

    expect(res.body.data).toEqual(todoInDB);
  });
});
