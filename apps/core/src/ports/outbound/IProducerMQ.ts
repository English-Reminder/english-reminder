import { CambridgeCredentialDTO } from "../../adapters";

interface IProducerMQ {
    addLoginMessage: (credential: CambridgeCredentialDTO) => Promise<number>
}

export {
    IProducerMQ
}