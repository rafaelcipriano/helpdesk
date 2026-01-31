export interface ShowByUserOutput {
  id: string
  title: string
  description: string
  status: string
  price: number
  customerName: string
  technicianName: string
  technicianEmail: string
  createdAt: Date
  updatedAt: Date
  services: Service[]
}
interface Service {
  id: string
  name: string
  price: number
}