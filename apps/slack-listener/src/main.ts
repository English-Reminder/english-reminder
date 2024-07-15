import { App, Block, BlockAction, BlockElementAction, DialogSubmitAction, InteractiveAction, SlackAction } from '@slack/bolt'
import { parse } from 'cookie'
import {LOGIN_MODAL_VIEW, LOGIN_MODAL_CONFIG } from './assets/slack-template/LoginModal';
import HomeView from './assets/slack-template/HomeView';
import { CambridgeCredentialDTO, RedisProducer, UserRepositoryImpl } from '@english-reminder/core'
import { UserServiceImpl, IUserService } from '@english-reminder/core'
import { redis, pgPool } from '@english-reminder/core';
// import {} from '@english-reminder/core'
const app = new App({
  clientId: process.env['CLIENT_ID'],
  clientSecret: process.env['CLIENT_SECRET'],
  signingSecret: process.env['SLACK_SIGNING_SECRET'],
  token: process.env['SLACK_BOT_TOKEN'],
  appToken: process.env['SLACK_APP_TOKEN'],
  socketMode: true,
  port: 3000
});


/* Add functionality here */

(async () => {
  console.log(process.env['CLIENT_ID'])
  // Start the app
  await app.start();
  app.event('app_home_opened', async ({ event, client, payload, context }) => {
    try {
      // Call views.publish with the built-in client
      const result = await client.views.publish({
        // Use the user ID associated with the event
        user_id: payload.user,
        view: HomeView
      });
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  });

  // Listen to the action (button click)
  app.action('open_modal', async ({ ack, client, body }) => {
    // Acknowledge the action
    await ack();
  
    try {
      // Call views.open with the built-in client
      console.log(body)
      const result = await client.views.open({
        trigger_id: (body as BlockAction).trigger_id,
        view: LOGIN_MODAL_VIEW
      });
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  });
  
  app.view(LOGIN_MODAL_CONFIG.SLACK_LOGIN_MODAL_CALLBACK_ID, async ({ ack, body, view }) => {
    ack()
    console.log(LOGIN_MODAL_CONFIG)
    const username = body.view.state.values[LOGIN_MODAL_CONFIG.USERNAME_BLOCK_ID][LOGIN_MODAL_CONFIG.SLACK_USERNAME_INPUT_ACTION_ID].value
    const password = body.view.state.values[LOGIN_MODAL_CONFIG.PASSWORD_BLOCK_ID][LOGIN_MODAL_CONFIG.SLACK_PASSWORD_INPUT_ACTION_ID].value
    const credentialDTO = new CambridgeCredentialDTO(body.user.id, username!, password!)
    const redisMQ = new RedisProducer(redis)
    const userRepository = new UserRepositoryImpl(redis, pgPool)
    const service: IUserService = new UserServiceImpl(redisMQ, userRepository)
    service.loginCambridge(credentialDTO)
  })
})()