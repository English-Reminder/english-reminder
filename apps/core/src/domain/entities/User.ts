import { CambridgeCredential } from "../value-objects";

class User {
    readonly userID: string
    readonly userSlackID: string
    readonly userCambridgeID: string
    readonly cambridgeCredential: CambridgeCredential
    constructor(userID: string, userSlackID: string, userCambridgeID: string, cambridgeCredential: CambridgeCredential) {
        this.userID = userID;
        this.userSlackID = userSlackID;
        this.userCambridgeID = userCambridgeID;
        this.cambridgeCredential = cambridgeCredential;
    }
}

export {
    User
}