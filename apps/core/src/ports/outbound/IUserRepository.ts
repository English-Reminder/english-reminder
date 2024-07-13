import { CambridgeCredentialDTO, LoggingInStatus } from "../../adapters";

interface UserRepository {
    saveCambridgeCredential(credential: CambridgeCredentialDTO): Promise<number>
    getCambridgeCredentialStatus(slackUserID: string): Promise<LoggingInStatus>
    lockCambridgeLogin(slackUserID: string): Promise<number>
    releaseLockCambridgeLogin(slackUserID: string): Promise<number>
    
}
export {
    UserRepository
}