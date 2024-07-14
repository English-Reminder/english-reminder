import { Either } from "fp-ts/lib/Either";
import { CambridgeCredentialDTO, LoggingInStatusDTO } from "../adapters/dtos";
import { IUserService } from "../domain/services/UserService";
import { CambridgeCredential } from "../domain/value-objects";
import { UserServiceErrorDTO } from "../adapters/dtos/ErrorDTO";

class UserUseCase {
    // function bindingCambridgeCredential(slackUserID: string, credential: CambridgeCredential) {
        
    // }
    private readonly userService: IUserService
    constructor(userService: IUserService) {
        this.userService = userService
    }

    checkCambridgeLoginStatus(slackUserID: string): Promise<Either<UserServiceErrorDTO, LoggingInStatusDTO>> {
        return this.userService.getLoginCamrbridgeStatus(slackUserID)
    }

    loginToCambridge(credential: CambridgeCredentialDTO) {
        this.userService.loginCambridge(credential)
        return
    }
}