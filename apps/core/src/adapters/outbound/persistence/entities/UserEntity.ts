class UserEntity {
    userID: string
    slackUserID: string
    credentialID: string
    constructor(userID: string, slackUserID: string, credentialID: string) {
        this.userID = userID
        this.slackUserID = slackUserID
        this.credentialID = credentialID
    }
}