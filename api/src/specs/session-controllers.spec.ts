import { app } from "../app"
import { prisma } from "../lib/prisma"
import request from "supertest"

describe("POST/session - SessionController", () => {
  let id: string

  beforeAll(async () => {
    const response = await request(app).post("/session/signup").send({
      name: "Test Customer",
      email: "testcustomer@example.com",
      password: "12345678"
    })

    id = response.body.id
  })

  afterAll(async () => {
    await prisma.customer.delete({ where: { id } })
  })

  it("Shoud return 404 not found", async () => {
    const response = await request(app).post("/session/login").send({
      email: "wrongemail@example.com",
      password: "12345678"
    })

    expect(response.status).toBe(404)
    expect(response.body.message).toContain("not found")
  })

  it("Should return 201 and a valid token", async () => {
    const response = await request(app).post("/session/login").send({
      email: "testcustomer@example.com",
      password: "12345678"
    })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty("token")
  })
})