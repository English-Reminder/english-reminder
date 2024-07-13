class CambridgeCredentialDTO {
    readonly slackUserID: string
    readonly username: string
    readonly password: string
    public constructor(slackUserID: string, username: string, password: string) {
        this.slackUserID = slackUserID
        this.username = username
        this.password = password
    }
}

enum LoggingInStatus {
    LoggedIn,
    LoggingIn,
}

export {
    CambridgeCredentialDTO,
    LoggingInStatus
}

