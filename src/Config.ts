export class Config {
    public static BASE_ENDPOINT_URL: string = 'https://api.languagetool.org/v2/check'
    public static REQUEST_COOLDOWN: number = 6.2;
    public static LANGUAGE: string = 'auto';
    public static API_KEY: string | null = null;

    public static updateConfig(config: Record<string, any>) {
        Object.entries(config).forEach(([key, value]) => {
            switch(key) {
                case 'endpoint_url': {
                    this.BASE_ENDPOINT_URL = value
                    break;
                }
                case 'request_cooldown': {
                    this.REQUEST_COOLDOWN = value;
                    break;
                }
                case 'language': {
                    this.LANGUAGE = value;
                    break;
                }
                case 'api_key': {
                    this.API_KEY = value;
                    break;
                }
                default: break;
            }
        });
    }

}