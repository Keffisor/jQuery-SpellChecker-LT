import * as $ from 'jquery';

export class SpellCheckerAPI {

    static async check(text: string): Promise<any> {
        let settings = {
            "url": "https://api.languagetool.org/v2/check",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            "data": {
                "text": text,
                "language": "auto"
            }
        };

        let response = await new Promise((resolve, reject) => {
            $.ajax(settings).done(resolve).fail(reject);
        });

        return response;
    }

}