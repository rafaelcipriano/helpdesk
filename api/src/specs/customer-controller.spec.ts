import { app } from "../app"
import { prisma } from "../lib/prisma"
import request from "supertest"

describe("POST/customer - CustomerControllers", () => {
  let uuid: string

  afterEach(async () => {
    if (uuid) {
      await prisma.customer.delete({
        where: { id: uuid }
      })
    }
    uuid = ""
  })

  it("Should return 201 and create a customer account successfully", async () => {
    const uniqueEmail = `test${Date.now()}@example.com`

    const response = await request(app).post("/session/signup").send({
      name: "Test",
      email: uniqueEmail,
      password: "12345678"
    })

    expect(response.status).toBe(201)
    expect(response.body).toMatchObject({
      id: expect.any(String),
      name: "Test",
      email: uniqueEmail
    })

    uuid = response.body.id
  })

  it("Should return 400 when name has less than 3 letters", async () => {
    const response = await request(app).post("/session/signup").send({
      name: "Te",
      email: `shortname${Date.now()}@example.com`,
      password: "12345678"
    })

    expect(response.body.message).toBe("validation error")
  })

  it("Should return 400 when email is invalid", async () => {
    const response = await request(app).post("/session/signup").send({
      name: "Test",
      email: "invalidemail.com",
      password: "12345678"
    })

    expect(response.status).toBe(400)
    expect(response.body.message).toContain("validation")
  })

  it("Should return 409 when email is already in use", async () => {
    const uniqueEmail = `duplicate${Date.now()}@example.com`

    const firstResponse = await request(app).post("/session/signup").send({
      name: "Original User",
      email: uniqueEmail,
      password: "12345678"
    })

    uuid = firstResponse.body.id
    
    const duplicateResponse = await request(app).post("/session/signup").send({
      name: "Duplicate User",
      email: uniqueEmail,
      password: "12345678"
    })

    expect(duplicateResponse.status).toBe(409)
    expect(duplicateResponse.body.message).toContain("already in use")
  })

  it("Should return 400 when the password provided has less than 6 characters", async () => {
    const uniqueEmail = `test${Date.now()}@example.com`

    const response = await request(app).post("/session/signup").send({
      name: "Test",
      email: uniqueEmail,
      password: "12345"
    })

    expect(response.body.message).toBe("validation error")
  })
})

describe("GET/customer - CustomerControllers", () => {
  let token: string

  beforeAll(async () => {
    const session = await request(app).post("/session/login").send({
      email: "rafael@example.com",
      password: "12345678"
    })

    token = session.body.token
  })

  it("Should return 200 and an id property if a customer exists", async () => {
    const response = await request(app)
      .get("/customer")
      .set("Authorization", `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body[0]).toHaveProperty("id")
  })

  it("Should not return the password when GET", async () => {
    const response = await request(app)
      .get("/customer")
      .set("Authorization", `Bearer ${token}`)

    expect(response.body[0]).not.toHaveProperty("password")
  })
})