import { SpellChecker } from './SpellChecker';
import * as $ from 'jquery';
import { Config } from './Config';

declare global {
    interface JQuery {
        spellchecker(): this;
    }
}

($.fn as any).spellchecker = function(this: JQuery, config: Record<string, any> = {}) {
    Config.updateConfig(config);
    return this.each(function(): void {
        new SpellChecker($(this));
    });
};

(window as any).$ = $;