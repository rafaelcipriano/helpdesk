interface IndexUserOutput {
  id: string
  name: string
  email: string
  role: string
  avatar: string | null
  createdAt: Date
  updatedAt: Date
  availability?: string[]
}

export { IndexUserOutput }