import { Word } from "./cambridge-api";
import * as cheerio from 'cheerio'
function scrapeWord(html: string): Array<Word> {
    // fetch dicts
    const $ = cheerio.load(html)
    const allDicts = $(".page").find(".pr.dictionary")
    allDicts.map((i, el) => {
        _scrapeEachDict(el)
    })
    return
}

function _scrapeEachDict(el: cheerio.Element): Word {
    const $ = cheerio.load(el)
    const dictCode = $(".pr.dictionary").attr("data-id")
    $().find(".pr.entry-body__el").map((i, el) => {
        _scrapeEachDefGroup(el)
    })
    return
}

function _scrapeEachDefGroup(el: cheerio.Element) {
    const $ = cheerio.load(el)
    const mainHeadword = $(".pos-header > .headword").text()
    const mainPosition = $(".pos.dpos").text()
    const ukPronounciation = $(".pos-header > .uk.dpron-i").text()
    const usPronounciation = $(".pos-header > .us.dpron-i")
    const definitionEls = $("div.pr.dsense")
    definitionEls.map((i, el) => {
        _scrapeEachDef(el)
    })
    return
}

function _scrapeEachDef(el: cheerio.Element) {
    const $ = cheerio.load(el)
    // get metadata
    const defHeadword = getTextOrNull($, ".dsense_h > .hw.dsense_hw")
    const defPosition = getTextOrNull($, ".dsense_h > .pos.dsense_pos")
    const defGuideword = getTextOrNull($, ".dsense_h > .guideword.dsense_gw")
    
    // get definition + examples + synonyms + thesauruses
    const defBlockEls = $().find(".ddef_block")
    defBlockEls.map((i, el) => {
        _scrapeEachDefBlock(el)
    })

    return
}

function _scrapeEachDefBlock(el: cheerio.Element) {
    const $ = cheerio.load(el)
    const wordDefSenseID = $(".ddef_block").attr("data-wl-senseid")
    const wordDefCerfLevel = getTextOrNull($, ".ddef-info > .epp-xref.dxref")
    const wordDefinition = $(".ddef_h > .ddef_d").text()
    const wordDefExamples = $(".ddef_b > .examp.dexamp")
    const wordDefSeeAlso = 
    const wordDefSynonyms = 
    const wordDefThesauruses = 
    const 
    
}

function getTextOrNull($: cheerio.CheerioAPI, cssSelector: string) {
    if ($(cssSelector).length) {
        return $(cssSelector).text
    } else return null
}

export {
    scrapeWord
}