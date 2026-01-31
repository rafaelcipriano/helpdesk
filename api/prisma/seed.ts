import { prisma } from "../src/lib/prisma"
import { hash } from "bcrypt"

async function main(){
  await prisma.$transaction([
    prisma.administrator.create({
      data: {
        name: "Rafael",
        email: "rafael@example.com",
        password: await hash("12345678", 8)
      }
    }),

    prisma.customer.create({
      data: {
        name: "Doug",
        email: "doug@example.com",
        password: await hash("12345678", 8)
      }
    }),

    prisma.technician.createMany({
      data: [
        {
          name: "Bob",
          email: "bob@example.com",
          password: await hash("12345678", 8),
          openingHours: ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"]
        },
        {
          name: "Alvin",
          email: "alvin@example.com",
          password: await hash("12345678", 8),
          openingHours: ["10:00", "11:00", "12:00", "13:00", "16:00", "17:00", "18:00", "19:00"]
        },
        {
          name: "Jonh",
          email: "john@example.com",
          password: await hash("12345678", 8),
          openingHours: ["12:00", "13:00", "14:00", "15:00", "18:00", "19:00", "20:00", "21:00"]
        },
      ]
    }),

    prisma.service.createMany({
      data: [
        {
          name: "Instalação/Atualização de Softwares",
          price: 150,
          status: "AVAILABLE"
        },
        {
          name: "Instalação/Atualzação de Hardwares",
          price: 200,
          status: "AVAILABLE"
        },
        {
          name: "Diagnóstico e Remoção de Vírus",
          price: 250,
          status: "AVAILABLE"
        },
        {
          name: "Suporte a Impressoras",
          price: 150,
          status: "AVAILABLE"
        },
        {
          name: "Suporte a Periféricos",
          price: 100,
          status: "AVAILABLE"
        },
        {
          name: "Conectividade de Internet",
          price: 250,
          status: "AVAILABLE"
        },
        {
          name: "Backup e Recuperação de Dados",
          price: 600,
          status: "AVAILABLE"
        },
        {
          name: "Otimização de SO/Formatação",
          price: 250,
          status: "AVAILABLE"
        },
        {
          name: "VPN e Acesso Remoto",
          price: 350,
          status: "UNAVAILABLE"
        },
      ],
      skipDuplicates: true
    })
  ])
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })