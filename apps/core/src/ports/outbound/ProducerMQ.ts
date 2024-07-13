import { CambridgeCredentialDTO } from "../../adapters";

interface ProducerMQ {
    addLoginMessage: (credential: CambridgeCredentialDTO) => number
    updateLoginState: (progressID: string, slackUserID: string, state: string) => number
}

export {
    ProducerMQ
}