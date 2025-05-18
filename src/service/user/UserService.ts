interface UserService {
  createUser(user: string): Promise<boolean>
}

export default UserService
