import { HomeView, View } from "@slack/bolt";

export default {
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
} as HomeView