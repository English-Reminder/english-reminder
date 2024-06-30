import axios from 'axios';
import { retry } from './retry'
import { CambridgeAPIImpl, CambridgeLoginUserResponse } from './cambridge/cambridge-api';
import * as E from 'fp-ts/Either'
import * as fs from 'fs'
import { CambridgeScrapeWordParserImpl, scrapeWord } from './cambridge/cambridge-scrape';
import * as htmlminifier from 'html-minifier'
import { parse, HTMLElement } from 'node-html-parser';
import { minify } from 'html-minifier'
(async function test () {
    const a = new CambridgeAPIImpl(new CambridgeScrapeWordParserImpl())
    const e = await a.fetchWordDetail("buy")
    console.log(e)
}())