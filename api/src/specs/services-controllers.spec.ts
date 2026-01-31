import { app } from "../app"
import { prisma } from "../lib/prisma"
import request from "supertest"

describe("ServicesControllers", () => {
  let token: string
  let serviceId: string

  beforeAll(async () => {
    const session = await request(app).post("/session/login").send({
      email: "rafael@example.com",
      password: "12345678"
    })

    token = session.body.token
  })

  afterEach(async () => {
    if (serviceId) {
      await prisma.service.delete({ where: { id: serviceId } })
    }

    serviceId = ""
  })

  it("Should return 201 and create a service successfully", async () => {
    const response = await request(app)
      .post("/services")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Instalação de firewall",
        price: 120.00
      })
    
    serviceId = response.body.id

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty("name")
    expect(response.body).toHaveProperty("price")
    expect(response.body.status).toBe("UNAVAILABLE")
  })

  it("Should return 400 when create a duplicate service", async () => {
    const response = await request(app)
      .post("/services")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Diagnóstico de hardware",
        price: 165.00
      })

    serviceId = response.body.id

    const duplicateResponse = await request(app)
      .post("/services")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Diagnóstico de hardware",
        price: 165.00
      })

    expect(duplicateResponse.status).toBe(400)
    expect(duplicateResponse.body.message).toContain("already exists")
  })

  it("Should return 400 when updating a service and it already exists", async () => {
    const service = await request(app)
      .post("/services")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Manutenção em Infraestrutura de Rede",
        price: 360.00
      })

    serviceId = service.body.id

    const response = await request(app)
      .patch(`/services/${serviceId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Manutenção em Infraestrutura de Rede",
      })

    expect(response.status).toBe(400)
    expect(response.body.message).toContain("already exists")
  })
})