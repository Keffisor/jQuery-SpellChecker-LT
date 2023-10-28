export class Config {
    public static BASE_ENDPOINT_URL = 'https://api.languagetool.org/v2/check'
    public static REQUEST_COOLDOWN = 6.2;

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
                default: break;
            }
        });
    }

}