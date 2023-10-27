export class Utils {

    static insertAt(str: string, charToInsert: string, pos: number) : string {
        return str.slice(0, pos) + charToInsert + str.slice(pos);
    }

    static reConvertHtmlCode(htmlCode: string): string {
        return $('<div>').html(htmlCode).find('*').html();
    }


}