import * as $ from 'jquery';
import { NodeController } from './NodeController';

export class SpellCheckerMenu {
    public static menuElement: JQuery | null = null;
    public static lastElementClicked: JQuery | null = null;

    private element: JQuery;
    private nodeController: NodeController;

    constructor(element: JQuery) {
        this.element = element;
        this.nodeController = new NodeController(element);
    }

    public createMenu(): void {
        this.createMenuElement();

        let menu: any = SpellCheckerMenu.menuElement;

        if(this.element.prop('tagName') !== 'SPAN' || !this.element.attr('class')?.includes('spellchecker-match')) {
            menu.html('').css('visibility', 'hidden');
            return;
        }

        if(SpellCheckerMenu.lastElementClicked != null && !SpellCheckerMenu.lastElementClicked.is(this.element)) menu.html('').css('visibility', 'hidden'); // If is clicking a new error text will reset the menu
        if(menu.find('*').length !== 0) return; // If is already created the html with the replacement options, etc

        SpellCheckerMenu.lastElementClicked = this.element;

        let type = this.getTypeName(this.element.attr('class') ?? '');

        let coords = this.nodeController.getElementCoords(this.element[0]);

        let message = this.element.attr('data-message');
        let replacements: string[] = JSON.parse(this.element.attr('data-replacements') ?? '[]').slice(0, 6);

        let replacementOptions = $('<div>', {class: 'mt-4'});
        replacements.forEach(item => {
            let option = $('<span>', {
                class: 'px-4 m-2 text-sm text-indigo-100 transition-colors duration-150 bg-indigo-700 rounded-lg focus:shadow-outline hover:bg-indigo-800 cursor-pointer spellchecker-option',
                style: 'padding: 0.625rem 1rem !important; margin-right: 10px; margin-bottom: 10px;',
            }).text(item)
            option.appendTo(replacementOptions);
        });

        menu.css('transform', 'translate(' + coords.x + 'px, ' + (coords.y + 30) + 'px)').css('visibility', 'unset');

        let headline = $('<div>', {
            class: 'fw-bold position-relative spellchecker-menu-headline spellchecker-' + (this.element.attr('class') ?? '').replace('spellchecker-match-', ''),
            style: 'font-size: 15px; padding-left: 16px; margin-bottom: 6px;'
        }).text(type);

        menu.append(headline);

        menu.append($('<p>', {
            style: 'color: grey;font-size: 13px;'
        }).text(message ?? ''));

        menu.append($('<div>', {
            class: 'spellchecker-menu-close'
        }).text('X'));

        menu.append(replacementOptions);
    }

    private createMenuElement() {
        if(SpellCheckerMenu.menuElement != null) return;

        let div = $('<div>', {
            id: 'spellchecker-menu', 
            class: 'spellchecker-menu border-indigo-700',
            style: 'visibility: hidden'
        });

        $('html, body').append(div);
        SpellCheckerMenu.menuElement = div;
    }

    private getTypeName(id: string) {
        switch(id.replace('spellchecker-match-', '')) {
            case 'error': {
                return 'Spelling';
            }
            case 'style': {
                return 'Style';
            }
            default: {
                return 'Grammar';
            }
        }
    }

}