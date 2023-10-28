import * as $ from 'jquery';
import { Config } from './Config';

export class SpellCheckerAPI {

    static async check(text: string): Promise<any> {
        let settings = {
            "url": Config.BASE_ENDPOINT_URL,
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