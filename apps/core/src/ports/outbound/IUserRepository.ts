import { Either } from "fp-ts/lib/Either";
import { CambridgeCredentialDTO, LoggingInStatusDTO } from "../../adapters";
import { ErrorDTO, GetLoginStatusErrorDTO } from "../../adapters/dtos/ErrorDTO";

interface IUserRepository {
    saveCambridgeCredential(credential: CambridgeCredentialDTO): Promise<Either<ErrorDTO, unknown>>
    getCambridgeCredentialStatus(slackUserID: string): Promise<Either<GetLoginStatusErrorDTO, LoggingInStatusDTO>>
    // lockCambridgeLogin(slackUserID: string): Promise<number>
    // releaseLockCambridgeLogin(slackUserID: string): Promise<number>
    
}
export {
    IUserRepository
}