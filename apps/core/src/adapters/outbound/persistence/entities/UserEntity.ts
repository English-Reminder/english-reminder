class UserEntity {
    userID: string
    slackUserID: string
    constructor(userID: string, slackUserID: string) {
        this.userID = userID
        this.slackUserID = slackUserID
    }
}