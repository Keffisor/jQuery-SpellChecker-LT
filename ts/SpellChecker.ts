import * as $ from 'jquery';
import { NodeController } from './NodeController';
import { SpellCheckerAPI } from './SpellCheckerAPI';
import { Utils } from './Utils';
import { SpellCheckerMenu } from './SpellCheckerMenu';

export class SpellChecker {
    private element: JQuery;
    private nodeController: NodeController;

    private isActive: boolean = false;

    constructor(element: JQuery) {
        this.element = element;
        this.nodeController = new NodeController(element);

        this.typeEvent();
        this.clickEvent();
    }

    private typeEvent(): void {
        $(this.element).on('input', () => {
            this.startSpellCheckTask();
        });
    }

    private clickEvent(): void {
        $(document).on('click', (event: JQuery.ClickEvent) => {
            const menu: SpellCheckerMenu = new SpellCheckerMenu($(event.target));
            menu.createMenu();
        });
        
        $(document).on('click', (event: JQuery.ClickEvent) => { // On click replacement option
            const element = $(event.target);
            if(element.prop('tagName') !== 'SPAN' || !(element.attr('class') ?? '').includes('spellchecker-option')) return;

            SpellCheckerMenu.lastElementClicked?.prop('outerHTML', element.text());
        });
    }

    public startSpellCheckTask(): void {
        if (this.isActive) return;
        console.log('Task spelling checking started');
        this.isActive = true;

        setTimeout(() => {
            if (!this.isActive) return;
            this.startSpellCheck();
        }, 6.2 * 1000);

    }

    private startSpellCheck(): void {
        const elements = this.element.find('p, h1, h2, h3');
        let element: any = elements.first();

        if (this.nodeController.getPositionedNode() != null) {
            element = $([this.nodeController.getPositionedNode()]);

            let previous_elements = [];
            for (const elm of Array.from(elements)) {
                let $elm = $(elm);
                if ($elm.is(element)) break;
                previous_elements.push($elm);
            }

            previous_elements.filter(elm => elm.text() !== '').slice(elements.length - 3).forEach(elm => {
                this.doSpellCheckConn(elm);
            });
        }

        this.doSpellCheckConn(element);
    }

    private doSpellCheckConn(element: JQuery): void {
        const elements = ['P', 'H2', 'H3', 'H1'];

        if(!elements.includes(element.prop('tagName'))) element = element.parent();
        if (!elements.includes(element.prop('tagName'))) {
            this.isActive = false;
            return;
        }

        SpellCheckerAPI.check(element.text()).then((response) => {
            this.applySpellCheck(element, response.matches);
        });
    }

    private applySpellCheck(element: JQuery, matches: Record<string, any>): void {
        if(matches.length === 0) {
            this.resetSpellChecksFormats();
            this.isActive = false;
            return;
        }

        let html = this.stripSpellCheckFormats(element);

        matches.forEach((json: any) => {
            let offset = json.offset;
            let length = json.length;

            let message = json.message.replace("'", '&#039;');
            let replacements: string[] = [];

            json.replacements.forEach((value: any) => {
                replacements.push(value.value.replace("'", '&#039;'));
            });

            //let match: any = element.text().slice(offset).slice(0, length);

            let error_id = json.rule.id;
            let category_id = json.rule.category.id;
            if(category_id == 'REDUNDANCY') error_id = 'REDUNDANCY';

            let start = offset;
            let end = offset + length;

            let patt = /(\<.*?\>)|&(?:nbsp|amp|quot|copy|reg|[gl]t|\#[0-9a-f]+);/ig;

            let match;
            while(match = patt.exec(html)) { // Not my code, from another repository
                let topt;

                if (match[0].substr(0,3) == '<br') {
                    topt = patt.lastIndex - match.index - 1;
                } else if (match[0].substr(0,1) == '<') {
                    topt = patt.lastIndex - match.index;
                } else {
                    topt= patt.lastIndex - match.index - 1;
                }
                if (start >= match.index) {
                    start = start + topt;
                }
                if (end > match.index) {
                    end = end + topt;
                }
            }

            let span = '<span class="' + this.getSpellClass(error_id) + '" data-message="' + message + '" data-replacements=\'' + JSON.stringify(replacements) + '\'>';

            html = Utils.insertAt(html, span, start);
            html = Utils.insertAt(html, '</span>', end + span.length );

            let ddup = new RegExp('</(EM|STRONG|SUP|SUB)><\\1>','i');

            html = html.replace(ddup,'');
        });

        const positioned_node: Node | null = this.nodeController.getPositionedNode();
        const sel = window.getSelection();
        
        if(sel == null || positioned_node == null) {
            this.isActive = false;
            return;
        }

        const node: Node | null = sel.focusNode;
        const offset = sel.focusOffset;
        const pos = this.nodeController.getCursorPosition(positioned_node, node, offset, { pos: 0, done: false });

        // If for some reason you're watching this, you will say, what the fuck is this? Well, sometimes the insertAt and some shit that I don't remember makes 
        // the html bugged with strange symbols, I don't know the reason XD. I imagine now after a lot of months later that are < and > converted to text format and it's a malformation of the html
        if(pos == null || html.includes('&amp;') || html.includes('&nbsp;')) {
            this.isActive = false;
            return;
        }

        let cursorFix = pos != null && $([positioned_node]).is(element);

        if(cursorFix) console.log('[CURSOR]' + JSON.stringify(pos));
        element.html(Utils.reConvertHtmlCode(html));
        console.log('SpellChecking HTML updated');

        if(cursorFix) {
            sel.removeAllRanges();
            const range = this.nodeController.setCursorPosition(positioned_node, document.createRange(), {
                pos: pos.pos,
                done: false,
            });
            range.collapse(true);
            sel.addRange(range);
        }

        this.isActive = false;
    }

    private resetSpellChecksFormats(): void {
        this.element.find('.spellchecker-match-error, .spellchecker-match-style, .spellchecker-match-gramatic').each((i, elm) => {
            $(elm).prop('outerHTML', $(elm).html());
        });
    }


    private stripSpellCheckFormats(element: JQuery): string {
        let tmp_element = $('<' + element.prop('tagName') + '>').html(element.html());

        tmp_element.find('.spellchecker-match-error, .spellchecker-match-style, .spellchecker-match-gramatic').each((i, elm) => {
            $(elm).prop('outerHTML', $(elm).html());
        });

        return tmp_element.prop('outerHTML');
    }

    private getSpellClass(error_id: string): string {
        let blue = ['RELACIONADO', 'COMPLEJIZAR', 'IN_A_X_MANNER', 'REDUNDANCY'];
        let red = ['MORFOLOGIK_RULE'];

        for (let o of blue) {
            if(error_id.includes(o)) return 'spellchecker-match-style';
        }

        for (let o of red) {
            if(error_id.includes(o)) return 'spellchecker-match-error';
        }

        console.log('Not found ID: ' + error_id);
        return 'spellchecker-match-gramatic'; // If is not blue or red, it's yellow.
    }

    public getElement(): JQuery {
        return this.element;
    }

}