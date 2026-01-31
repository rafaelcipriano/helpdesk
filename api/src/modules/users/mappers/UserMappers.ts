import { CreateUserOutput } from "../dtos/output/CreateUserOutput"

class UserMappers {
  createUserDTO(
    user: any
   ): CreateUserOutput {
    if (user.role === "TECHINCIAN") {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        availability: user.openingHours,
      }
    } else {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    }
  }

  indexUserDTO(users: any) {
    return users.map((user: any) => {
      if(user.role === "TECHNICIAN") {
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          availability: user.openingHours,
        }
      } else {
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      }
    })
  }

  updateProfileDTO(user: any) {
    return {
      name: user.name,
      email: user.email,
    }
  }
}

export { UserMappers }