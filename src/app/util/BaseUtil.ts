import { isEmpty } from "rxjs/operators"

export default class BaseUtil {

    static isEmpty(str:string):boolean{
        return (!str || 0 === str.length);
    }

    static isObjNull(obj:Object):boolean {
        if(obj != null && obj != undefined){
            return false;
        } else {
            return true;
        }
    }

    static getStrLower(str : string):string{
        let strLower = this.getStrLower(str);
        if(!BaseUtil.isEmpty(strLower)){
            strLower = strLower.toLowerCase();
        }
        return strLower;
    }



}