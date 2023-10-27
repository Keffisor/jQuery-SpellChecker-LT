import { SpellChecker } from './SpellChecker';
import * as $ from 'jquery';

declare global {
    interface JQuery {
        spellchecker(): this;
    }
}

($.fn as any).spellchecker = function(this: JQuery) {
    return this.each(function(): void {
        new SpellChecker($(this));
    });
};

(window as any).$ = $;