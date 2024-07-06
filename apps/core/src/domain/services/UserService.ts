
interface UserService {
    loginCambridge(username: string, password: string): any
}

class UserServiceImpl implements UserService {
    loginCambridge(username: string, password: string) {
        throw new Error("Method not implemented.");
    }
}