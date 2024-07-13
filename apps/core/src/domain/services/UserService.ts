import { CambridgeCredentialDTO, LoggingInStatus } from "../../adapters";
import { ProducerMQ, UserRepository } from "../../ports";



interface UserService {
    loginCambridge(userCredentialDTO: CambridgeCredentialDTO): number
    checkLoginCamrbridgeStatus(slackUserID: string): LoggingInStatus
}

class UserServiceImpl implements UserService {
    producer: ProducerMQ
    userRepository: UserRepository
    // memCache: 
    constructor(producer: ProducerMQ, userRepository: UserRepository) {
        this.producer = producer
        this.userRepository = userRepository
    }
    checkLoginCamrbridgeStatus(slackUserID: string): LoggingInStatus {
        return LoggingInStatus.LoggedIn
    }
    loginCambridge(userCredentialDTO: CambridgeCredentialDTO): number {
        return this.producer.addLoginMessage(userCredentialDTO)
    }
}

export {
    UserService,
    UserServiceImpl
}