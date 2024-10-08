import request from "supertest";
import app from "../..";
import { clearDatabase } from "../../db.connection.js";

const req = request(app);

describe("Lab testing:", () => {
  let mockUser, userToken, todoData, userData;

  beforeAll(async () => {
    mockUser = {
      name: "Mustafa",
      email: "mustafa@iti.com",
      password: "1994",
    };

    const userResponse = await req.post("/user/signup").send(mockUser);
    userData = userResponse.body.data;

    const loginResponse = await req.post("/user/login").send(mockUser);
    userToken = loginResponse.body.data;
  });

  describe("User routes:", () => {
    it("GET /user/search - should return the correct user by name", async () => {
      const res = await req.get("/user/search").query({ name: mockUser.name });
      expect(res.status).toBe(200);
      expect(res.body.data[0].name).toBe(mockUser.name);
    });

    it("GET /user/search - invalid name should return appropriate status and message", async () => {
      const res = await req.get("/user/search").query({ name: "anything" });
      expect(res.status).toBe(200);
      expect(res.body.data).toContain("no user found");
    });
  });

  describe("Todos routes:", () => {
    it("PATCH /todo/:id - missing title should return status 400 with an error message", async () => {
      const todo = { title: "learning JS" };

      let res = await req
        .post("/todo")
        .send(todo)
        .set({ authorization: userToken });
      todoData = res.body.data;

      res = await req
        .patch(`/todo/${todoData._id}`)
        .set({ authorization: userToken });
      expect(res.status).toBe(400);
      expect(res.body.message).toContain("title is required");
    });

    it("PATCH /todo/:id - should update the title of the todo", async () => {
      const res = await req
        .patch(`/todo/${todoData._id}`)
        .send({ title: "JS" })
        .set({ authorization: userToken });

      expect(res.status).toBe(200);
      expect(res.body.data.title).toBe("JS");
    });

    it("GET /todo/user - should return all todos for the authenticated user", async () => {
      const res = await req.get("/todo/user").set({ authorization: userToken });
      expect(res.body.data).toHaveLength(1);
      expect(res.status).toBe(200);
    });

    it("GET /todo/user - should return no todos for a user with no todos", async () => {
      const userTwo = {
        name: "Ali",
        email: "ali@gmail.com",
        password: "1234",
      };

      let res = await req.post("/user/signup").send(userTwo);
      const userTwoToken = res.body.data;

      res = await req.get("/todo/user").set({ authorization: userTwoToken });
      expect(res.body.data).toHaveLength(0);
      expect(res.status).toBe(200);
      expect(res.body.message).toContain("no todos found");
    });
  });

  afterAll(async () => {
    await clearDatabase();
  });
});
