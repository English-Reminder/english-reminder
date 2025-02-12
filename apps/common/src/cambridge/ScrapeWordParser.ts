import { ICambridgeWordParser, Word } from "./CambridgeAPI";
import * as cheerio from 'cheerio'
import { minify } from "html-minifier";
import { parse, HTMLElement } from 'node-html-parser';

class CambridgeScrapeWordParserImpl implements ICambridgeWordParser {
    parser = (data: any): Array<Word> => {
        const _data = minify(data, {
            "caseSensitive": false,
            "collapseBooleanAttributes": false,
            "collapseInlineTagWhitespace": false,
            "collapseWhitespace": true,
            "conservativeCollapse": false,
            "decodeEntities": false,
            "html5": true,
            "includeAutoGeneratedTags": false,
            "keepClosingSlash": false,
            "minifyCSS": true,
            "minifyJS": true,
            "preserveLineBreaks": false,
            "preventAttributesEscaping": false,
            "processConditionalComments": true,
            "processScripts": [
                "text/html"
            ],
            "removeAttributeQuotes": false,
            "removeComments": true,
            "removeEmptyAttributes": false,
            "removeEmptyElements": false,
            "removeOptionalTags": false,
            "removeRedundantAttributes": false,
            "removeScriptTypeAttributes": false,
            "removeStyleLinkTypeAttributes": false,
            "removeTagWhitespace": false,
            "sortAttributes": false,
            "sortClassName": false,
            "trimCustomFragments": false,
            "useShortDoctype": false
        })
        return scrapeWord(_data) 
    }

}
function scrapeWord(html: string): Array<Word> {
    // fetch dicts
    const _tmp = parse(html)
    const allDicts = _tmp.querySelectorAll(".page .pr.dictionary")
    // const allDicts = $(".page").find(".pr.dictionary")
    const words = allDicts.flatMap((el) => {
        return _scrapeEachDict(el)
    })
    const extendedExample = _tmp.querySelectorAll("#dataset-example .deg").map(_ => _.innerText)
    words.map(_ => _.extendedExamples = extendedExample)
    return words
}

function _scrapeEachDict(el: HTMLElement): Array<Word> {
    const dictCode = el.getAttribute("data-id")

    // Scrape each def group
    return el.querySelectorAll(".pr.entry-body__el").map(el => {
        // const $ = cheerio.load(el)
        const mainHeadword = el.querySelector(".pos-header .headword .hw.dhw").innerText
        const mainPosition = el.querySelector(".pos.dpos").innerText
        const ukPronounciation = getTextOrNull(el, ".pos-header .uk.dpron-i .ipa.dipa")
        const usPronounciation = getTextOrNull(el, ".pos-header .us.dpron-i .ipa.dipa")
        const definitionEls = el.querySelectorAll("div.pr.dsense")
        const definitionGroups = definitionEls.map(el => {
            return _scrapeEachDef(el)
        })

        const defGrammarsBlock = el.querySelectorAll("div.xref.grammar .item")
        const grammars = defGrammarsBlock.map(el => {
            return {
                title: el.querySelector(".dx-h").innerText,
                explain: el.querySelector("dx-pos").innerText,
                entry: el.querySelector('a').getAttribute('href')
            }
        })
        const defIdiomsBlock = el.querySelectorAll("div.xref.idioms .item, div.xref.idiom .item")
        const idioms = defIdiomsBlock.map(el => {
            return {
                title: el.querySelector("a").innerText,
                entry: el.querySelector("a").getAttribute("href")
            }
        })
        const phrasalVerbsBlock = el.querySelectorAll(".xref.phrasal_verbs .item, .xref.phrasal_verb .item")
        const phrasalVerb = phrasalVerbsBlock.map(el => {
            
            return {
                title: el.querySelector("a").innerText,
                entry: el.querySelector("a").getAttribute("href")
            }
        })
        return {
            dictionaryId: dictCode,
            headword: mainHeadword,
            ukPronounce: ukPronounciation,
            usPronounce: usPronounciation,
            position: mainPosition,
            definitionGroups: definitionGroups,
            grammars: grammars,
            phrasalVerbs: phrasalVerb,
            idioms: idioms,
            extendedExamples: []
        } as unknown as Word
    })
}


function _scrapeEachDef(el: HTMLElement) {
    // get metadata
    const defHeadword = getTextOrNull(el, ".dsense_h > .hw.dsense_hw")
    const defPosition = getTextOrNull(el, ".dsense_h > .pos.dsense_pos")
    const defGuideword = getTextOrNull(el, ".dsense_h > .guideword.dsense_gw")
    
    // get definition + examples + synonyms + thesauruses
    const defBlockEls = el.querySelectorAll(".ddef_block")
    const defs = defBlockEls.map(el => {
        return _scrapeEachDefBlock(el)
    })

    const defPhraseBlocks = el.querySelectorAll("dsense_b .dphrase-block")
    const defPhrases = defPhraseBlocks.map(el => {
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
    return {
        headword: defHeadword,
        position: defPosition,
        guideword: defGuideword,
        definitions: defs,
        phrases: defPhrases
    }
}

function _scrapeEachDefBlock(el: HTMLElement) {
    const wordDefSenseID = el.getAttribute("data-wl-senseid")
    const wordDefCerfLevel = getTextOrNull(el, ".ddef-info > .epp-xref.dxref")
    const wordDefinition = el.querySelector(".ddef_h > .ddef_d").innerText
    el.querySelector(".ddef_h > .ddef_d").textContent
    const wordDefExamples = el.querySelectorAll(".ddef_b > .examp.dexamp").map(el => el.innerText)
    const wordDefSeeAlso = el.querySelectorAll(".ddef_b .see_also .item").map(el => {
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
                title: el.querySelector(".daccord_lt").innerText,
                words: el.querySelectorAll(".daccord_lb ul .had").map((el) => {
                    return {
                        word: el.querySelector("a").innerText,
                        example: el.querySelector(".example.dexample").innerText
                    }
                })
            }
        })
    )
    return {
        cerfLevel: wordDefCerfLevel,
        definition: wordDefinition,
        senseID: wordDefSenseID,
        examples: wordDefExamples,
        synonyms: wordDefSynonyms,
        seeAlso: wordDefSeeAlso,
        thesaureses: wordDefThesauruses
    }
}


function getTextOrNull($: HTMLElement, cssSelector: string) {
    if ($.querySelector(cssSelector)) {
        return $.querySelector(cssSelector).innerText
    } else return null
}

export {
    scrapeWord,
    CambridgeScrapeWordParserImpl
}