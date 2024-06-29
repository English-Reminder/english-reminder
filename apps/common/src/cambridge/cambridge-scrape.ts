import { Word } from "./cambridge-api";
import * as cheerio from 'cheerio'
import { parse, HTMLElement } from 'node-html-parser';
function scrapeWord(html: string): Array<Word> {
    // fetch dicts
    const $ = cheerio.load(html)
    const _tmp = parse(html)
    const allDicts = _tmp.querySelectorAll(".page .pr.dictionary")

    // const allDicts = $(".page").find(".pr.dictionary")
    allDicts.map((el) => {
        _scrapeEachDict(el)
    })
    return
}

function _scrapeEachDict(el: HTMLElement): Word {
    const dictCode = el.getAttribute("data-id")
    el.querySelectorAll(".pr.entry-body__el").map(el => {
        _scrapeEachDefGroup(el)
    })
    return
}

function _scrapeEachDefGroup(el: HTMLElement) {
    // const $ = cheerio.load(el)
    const mainHeadword = el.querySelector(".pos-header .headword .hw.dhw").innerText
    const mainPosition = el.querySelector(".pos.dpos").innerText
    const ukPronounciation = el.querySelector(".pos-header .uk.dpron-i .ipa.dipa").innerText
    const usPronounciation = el.querySelector(".pos-header .us.dpron-i .ipa.dipa").innerText
    const definitionEls = el.querySelectorAll("div.pr.dsense")
    definitionEls.map(el => {
        _scrapeEachDef(el)
    })

    const defGrammarsBlock = el.querySelectorAll("div.xref.grammar")
    defGrammarsBlock.map(el => {
        return {
            
        }
    })
    const defIdiomsBlock = el.querySelectorAll("div.xref.idioms, div.xref.idiom")
    
    const phrasalVerbsBlock = el.querySelectorAll(".xref.phrasal_verbs, .xref.phrasal_verb")

    return
}

function _scrapeEachDef(el: HTMLElement) {
    // get metadata
    const defHeadword = getTextOrNull(el, ".dsense_h > .hw.dsense_hw")
    const defPosition = getTextOrNull(el, ".dsense_h > .pos.dsense_pos")
    const defGuideword = getTextOrNull(el, ".dsense_h > .guideword.dsense_gw")
    
    // get definition + examples + synonyms + thesauruses
    const defBlockEls = el.querySelectorAll(".ddef_block")
    defBlockEls.map(el => {
        _scrapeEachDefBlock(el)
    })

    const defPhraseBlocks = el.querySelectorAll("dsense_b .dphrase-block")
    defPhraseBlocks.map(el => {
        return {
            title: el.querySelector(".dphrase-title").textContent,
            definitions: el.querySelectorAll(".dphrase_b .ddef_block").map(el => {
                return {
                    senseID: el.getAttribute("data-wl-senseid"),
                    cerfLevel: getTextOrNull(el, ".epp-xef.dxref"),
                    definition: el.querySelector(".ddef_d").textContent,
                    examples: el.querySelectorAll(".examp.dexamp").map(_ => _.textContent)
                }
            })
        }
    })
    return
}

function _scrapeEachDefBlock(el: HTMLElement) {
    const wordDefSenseID = el.getAttribute("data-wl-senseid")
    const wordDefCerfLevel = getTextOrNull(el, ".ddef-info > .epp-xref.dxref")
    const wordDefinition = el.querySelector(".ddef_h > .ddef_d").innerText
    el.querySelector(".ddef_h > .ddef_d").textContent
    const wordDefExamples = el.querySelector(".ddef_b > .examp.dexamp")
    const wordDefSeeAlso = el.querySelectorAll(".ddef_b > .see_also > .item").map(el => {
        return {
            headword: el.innerText,
            entry: el.querySelector("a").getAttribute("href")
        }
    })
    const wordDefSynonyms = (
        el.querySelectorAll(".ddef_b > .xref.synonyms, .ddef_b > .xref.synonym").map(el => {
            return {
                headword: el.innerText,
                entry: el.querySelector("a").getAttribute("href")
            }
        })
    )
    const wordDefThesauruses = (
        el.querySelectorAll(".daccord.fs16").map(el => {
            return {
                title: el.querySelector(".daccord_lt"),
                words: el.querySelectorAll(".daccord_lb > .had").map((el) => {
                    return {
                        word: el.querySelector("a").innerText,
                        example: el.querySelector(".example.dexample").innerText
                    }
                })
            }
        })
    )
    return
}


function getTextOrNull($: HTMLElement, cssSelector: string) {
    if (!$.querySelector(cssSelector).isVoidElement) {
        return $.querySelector(cssSelector).innerText
    } else return null
}

export {
    scrapeWord
}