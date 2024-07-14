import { Either } from "fp-ts/lib/Either";
import { CambridgeCredentialDTO, LoggingInStatusDTO } from "../../adapters";
import { IProducerMQ, IUserRepository } from "../../ports";
import { either } from "fp-ts";
import { UserServiceErrorDTO } from "../../adapters/dtos/ErrorDTO";

interface IUserService {
    loginCambridge(userCredentialDTO: CambridgeCredentialDTO): Promise<Either<UserServiceErrorDTO, undefined>>
    getLoginCamrbridgeStatus(slackUserID: string): Promise<Either<UserServiceErrorDTO, LoggingInStatusDTO>>
}

class UserServiceImpl implements IUserService {
    producer: IProducerMQ
    userRepository: IUserRepository

    constructor(producer: IProducerMQ, userRepository: IUserRepository) {
        this.producer = producer
        this.userRepository = userRepository
    }
    async getLoginCamrbridgeStatus(slackUserID: string): Promise<Either<UserServiceErrorDTO, LoggingInStatusDTO>> {
        return either.right(LoggingInStatusDTO.LoggedIn)
    }
    async loginCambridge(userCredentialDTO: CambridgeCredentialDTO): Promise<Either<UserServiceErrorDTO, undefined>> {
        this.producer.addLoginMessage(userCredentialDTO)
        return either.right(undefined)
    }
}

export {
    IUserService,
    UserServiceImpl
}