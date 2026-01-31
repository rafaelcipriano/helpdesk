import { app } from "../app"
import { prisma } from "../lib/prisma"
import request from "supertest"

describe("POST/create - CallService", () => {
  let token: string
  let callId: string

  beforeAll(async () => {
    const session = await request(app).post("/session/login").send({
      email: "doug@example.com",
      password: "12345678"
    })

    token = session.body.token
  })

  afterEach(async () => {
    if (callId) {
      await prisma.call.delete({ where: { id: callId } })
    }

    callId = ""
  })

  it("Should return 201 and create a call sucessufully", async () => {
    const services = await prisma.service.findMany()
    const customer = await prisma.customer.findUnique({
      where: { email: "doug@example.com" }
    })

    const response = await request(app)
      .post("/calls")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Algum título aleatório",
        description: "Alguma descrição ainda mais aletória...",
        services: [services[0].id],
        customerId: customer?.id,
    })

    callId = response.body.id

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty("id")
  })

  it("Should choose the technician with fewer open calls", async () => {
    const services = await prisma.service.findMany()
    const customer = await prisma.customer.findUnique({ where: { email: "doug@example.com" } })

    const tech1 = await prisma.technician.findFirst()
    const tech2 = await prisma.technician.findFirst({ where: { NOT: { id: tech1?.id } } })
    expect(tech2).toBeTruthy()

    // create an OPEN call for tech1 to make them busier
    const busyCall = await prisma.call.create({
      data: {
        title: "Busy open call",
        description: "Busy open call for test".repeat(3),
        price: services[0].price,
        customerId: customer?.id!,
        technicianId: tech1?.id!,
        status: "OPEN"
      }
    })

    const response = await request(app)
      .post("/calls")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "New call should avoid busy technician",
        description: "Descrição suficiente para validação da seleção",
        services: [services[0].id],
        customerId: customer?.id
      })

    // cleanup
    await prisma.call.delete({ where: { id: busyCall.id } })
    await prisma.call.delete({ where: { id: response.body.id } })

    expect(response.status).toBe(201)
    expect(response.body.technician).not.toBe(tech1?.id)
  })

  it("Should return calls ordered by createdAt ASC for customer", async () => {
    const services = await prisma.service.findMany()
    const customer = await prisma.customer.findUnique({ where: { email: "doug@example.com" } })

    const customerSession = await request(app).post("/session/login").send({
      email: "doug@example.com",
      password: "12345678"
    })
    const customerToken = customerSession.body.token

    const first = await request(app)
      .post("/calls")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({
        title: "First call",
        description: "First call description".repeat(3),
        services: [services[0].id],
        customerId: customer?.id
      })

    const second = await request(app)
      .post("/calls")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({
        title: "Second call",
        description: "Second call description".repeat(3),
        services: [services[0].id],
        customerId: customer?.id
      })

    const response = await request(app)
      .get(`/calls/called-by-customer/${customer?.id}`)
      .set("Authorization", `Bearer ${customerToken}`)

    // cleanup
    await prisma.call.delete({ where: { id: first.body.id } })
    await prisma.call.delete({ where: { id: second.body.id } })

    expect(response.status).toBe(200)
    expect(response.body.length).toBeGreaterThanOrEqual(2)
    const idxFirst = response.body.findIndex((c: any) => c.id === first.body.id)
    const idxSecond = response.body.findIndex((c: any) => c.id === second.body.id)
    expect(idxFirst).toBeLessThan(idxSecond)
  })

  it("Should return 404 and a service not found", async () => {
    const customer = await prisma.customer.findUnique({
      where: { email: "doug@example.com" }
    })

    const response = await request(app)
      .post("/calls")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Algum título aleatório",
        description: "Alguma descrição ainda mais aleatória...",
        services: ["c389328f-0add-44e9-a3f1-942fb3ce58b3"],
        customerId: customer?.id,
      })

    expect(response.status).toBe(404)
    expect(response.body.message).toContain("not found")
  })
  
  it("Should return 400 and service not available", async () => {
    const customer = await prisma.customer.findUnique({
      where: { email: "doug@example.com" }
    })

    const service = await prisma.service.findFirst({
      where: { status: "UNAVAILABLE" }
    })

    const response = await request(app)
      .post("/calls")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Algum título aleatório",
        description: "Alguma descrição ainda mais aleatória...",
        services: [service?.id],
        customerId: customer?.id,
      })

    expect(response.status).toBe(400)
    expect(response.body.message).toContain("is not AVAILABLE")
  })

})

describe("PUT/addService - CallService", () => {
  let technicianToken: string
  let callId: string
  let services: any

  beforeAll(async () => {
    services = await prisma.service.findMany()

    const customer = await prisma.customer.findUnique({ where: { email: "doug@example.com" } })

    const customerSession = await request(app).post("/session/login").send({
      email: "doug@example.com",
      password: "12345678"
    })

    const call = await request(app)
    .post("/calls")
    .set("Authorization", `Bearer ${customerSession.body.token}`)
    .send({
      title: "Alguma título aleatório...",
      description: "Alguma descrição ainda mais aleatória...",
      services: [services[1].id],
      customerId: customer?.id
    })

    const technician = await prisma.technician.findUnique({
      where: { id: call.body.technician }
    })

    const technicianSession = await request(app).post("/session/login").send({
      email: technician?.email,
      password: "12345678"
    })

    callId = call.body.id
    technicianToken = technicianSession.body.token
  })

  afterAll(async () => {
    if (callId) {
      await prisma.call.delete({ where: { id: callId } })    
    }

    callId = ""
  })

  it("Should return 200 and add a service to the call", async () => {
    const response = await request(app)
      .put("/calls/add-service")
      .set("Authorization", `Bearer ${technicianToken}`)
      .send({
        callId,
        serviceId: services[2].id
      })

    expect(response.status).toBe(200)
  })
  
  it("Should return 404 and call not found", async () => {
    const response = await request(app)
      .put("/calls/add-service")
      .set("Authorization", `Bearer ${technicianToken}`)
      .send({
        callId: "56113a2f-84e8-44ec-ac53-4d8879c18a17",
        serviceId: services[4].id
      })

    expect(response.status).toBe(404)
    expect(response.body.message).toContain("not found")
  })
  
  
  it("Should return 404 and service not found", async () => {
    const response = await request(app)
      .put("/calls/add-service")
      .set("Authorization", `Bearer ${technicianToken}`)
      .send({
        callId,
        serviceId: "56003a2f-84e8-44ec-ac53-4d8879c18a67"
      })

    expect(response.status).toBe(404)
    expect(response.body.message).toContain("not found")
  })
  
  
  it("Should return 400 if technician is not responsible for the call", async () => {
    const call = await prisma.call.findUnique({
      where: { id: callId }
    })

    const technician = await prisma.technician.findFirst({
      where: { NOT: { id: call?.technicianId } }
    })

    const session = await request(app).post("/session/login").send({
      email: technician?.email,
      password: "12345678"
    })

    const response = await request(app)
      .put("/calls/add-service")
      .set("Authorization", `Bearer ${session.body.token}`)
      .send({
        callId,
        serviceId: services[5].id
      })

    expect(response.status).toBe(400)
    expect(response.body.message).toContain("technician responsible for the ticket can add")
  })
  
})

describe("PUT/toggleStatus - CallService", () => {
  let customerToken: string
  let callId: string

  beforeAll(async () => {
    const customerSession = await request(app).post("/session/login").send({
      email: "doug@example.com",
      password: "12345678"
    })

    customerToken = customerSession.body.token
  })

  afterAll(async () => {
    if (callId) {
      await prisma.call.delete({ where: { id: callId } })
    }
  })

  it("Should return 200 and toggle call status", async () => {
    const service = await prisma.service.findMany({ where: { status: "AVAILABLE" } })
    const customer = await prisma.customer.findUnique({
      where: { email: "doug@example.com" }
    })
    
    const call = await request(app)
      .post("/calls")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({
        title: "Algum título aletório...",
        description: "Uma descrição ainda aletória...",
        services: [service[0].id],
        customerId: customer?.id
    })
    
    callId = call.body.id
    const technician = await prisma.technician.findUnique({ 
      where: { id: call.body.technician }
    })

    const technicianSession = await request(app).post("/session/login").send({
      email: technician?.email,
      password: "12345678"
    })

    const technicianToken = technicianSession.body.token

    const response = await request(app)
      .put(`/calls/status/${callId}`)
      .set("Authorization", `Bearer ${technicianToken}`)

    expect(response.status).toBe(200)
    expect(response.body.status).not.toBe("OPEN")
  })
})
