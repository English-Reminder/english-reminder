import { App } from '@slack/bolt'
import { parse } from 'cookie'
const app = new App({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
  port: 3000
});


/* Add functionality here */

(async () => {
  console.log(process.env.CLIENT_ID)
  // Start the app
  await app.start();
  app.command('/echo', async ({ command, ack, respond }) => {
    // Acknowledge command request
    await ack();
    console.log(command);
    await respond({
      "blocks": [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "New Paid Time Off request from <example.com|Fred Enriquez>\n\n<https://example.com|View request>"
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
            "text": "Label",
            "emoji": true
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
            "text": "Label",
            "emoji": true
          }
        },
        {
          "type": "section",
          "fields": [
            {
              "type": "plain_text",
              "text": "*this is plain_text text*",
              "emoji": true
            },
            {
              "type": "plain_text",
              "text": "*this is plain_text text*",
              "emoji": true
            },
            {
              "type": "plain_text",
              "text": "*this is plain_text text*",
              "emoji": true
            },
            {
              "type": "plain_text",
              "text": "*this is plain_text text*",
              "emoji": true
            },
            {
              "type": "plain_text",
              "text": "*this is plain_text text*",
              "emoji": true
            }
          ]
        }
      ]
    });
    // app.client.chat.postMessage()
  });
})()