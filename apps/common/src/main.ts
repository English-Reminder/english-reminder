import axios from 'axios';
import { retry } from './retry'
import { CambridgeAPIImpl } from './cambridge/cambridge-api';

(async function test () {
    const a = new CambridgeAPIImpl()

    console.log(await a.login("abc@icloud.com", "123456"))

}())
