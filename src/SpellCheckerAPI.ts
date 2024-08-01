import * as $ from 'jquery';
import { Config } from './Config';

export class SpellCheckerAPI {

    static async check(text: string): Promise<any> {
        let settings: any = {
            "url": Config.BASE_ENDPOINT_URL,
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            "data": {
                "text": text,
                "language": Config.LANGUAGE
            }
        };

        if(Config.API_KEY != null) settings['data']['apiKey'] = Config.API_KEY;

        let response = await new Promise((resolve, reject) => {
            $.ajax(settings).done(resolve).fail(reject);
        });

        return response;
    }

}