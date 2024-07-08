import { ModalView } from "@slack/bolt"
const USERNAME_BLOCK_ID = "username-inp"
const PASSWORD_BLOCK_ID = "password-inp"
const SLACK_LOGIN_MODAL_CALLBACK_ID = "slack-login-modal-callback-id"
const LOGIN_MODAL_CONFIG = {
	USERNAME_BLOCK_ID,
	PASSWORD_BLOCK_ID,
	SLACK_LOGIN_MODAL_CALLBACK_ID
}
const LOGIN_MODAL_VIEW = {
	"type": "modal",
	"title": {
		"type": "plain_text",
		"text": "English Reminder",
		"emoji": true
	},
	"submit": {
		"type": "plain_text",
		"text": "Submit",
		"emoji": true
	},
	"close": {
		"type": "plain_text",
		"text": "Cancel",
		"emoji": true
	},
    callback_id: SLACK_LOGIN_MODAL_CALLBACK_ID,
	"blocks": [
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "Login to Cambridge"
			}
		},
		{
			"type": "input",
			"element": {
				"type": "plain_text_input",
				"action_id": "plain_text_input-action"
			},
			"label": {
				"type": "plain_text",
				"text": "Username",
				"emoji": true
			},
			"block_id": USERNAME_BLOCK_ID
		},
		{
			"type": "input",
			"element": {
				"type": "plain_text_input",
				"action_id": "plain_text_input-action"
			},
			"label": {
				"type": "plain_text",
				"text": "Password",
				"emoji": true
			},
			"block_id": PASSWORD_BLOCK_ID
		}
	]
} as ModalView

export {
	LOGIN_MODAL_VIEW,
	LOGIN_MODAL_CONFIG
}