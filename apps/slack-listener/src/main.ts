import { App, BlockElementAction, DialogSubmitAction, InteractiveAction } from '@slack/bolt'
import { parse } from 'cookie'
// import {} from '@english-reminder/core'
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
  app.event('app_home_opened', async ({ event, client, context }) => {
    try {
      // Call views.publish with the built-in client
      const result = await client.views.publish({
        // Use the user ID associated with the event
        user_id: event.user,
        view: {
          type: 'home',
          callback_id: 'home_view',
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: 'Welcome to your _App\'s Home_! :tada:'
              }
            },
            {
              type: 'actions',
              elements: [
                {
                  type: 'button',
                  text: {
                    type: 'plain_text',
                    text: 'Open Modal'
                  },
                  action_id: 'open_modal'
                }
              ]
            }
          ]
        }
      });
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  });
  
  // Listen to the action (button click)
  app.action('open_modal', async ({ body, ack, client, payload }) => {
    // Acknowledge the action
    await ack();
  
    try {
      // Call views.open with the built-in client
      const result = await client.views.open({
        trigger_id: "aaa",
        view: {
          type: 'modal',
          callback_id: 'modal-identifier',
          title: {
            type: 'plain_text',
            text: 'My App Modal'
          },
          blocks: [
            {
              type: 'section',
              block_id: 'section-identifier',
              text: {
                type: 'mrkdwn',
                text: 'This is a section block with a button.'
              },
              accessory: {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: 'Click Me'
                },
                action_id: 'button_click'
              }
            }
          ],
          submit: {
            type: 'plain_text',
            text: 'Submit'
          }
        }
      });
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  });
})()