import { SeverityModel } from './SeverityModel';


export class DefectSeverityModel {

    id : number;
    name : string;
    country : string;
    total_annotation : string;
    severity : SeverityModel;

    constructor(){
        this.id = null;
        this.name = '';
        this.country = '';
        this.total_annotation = '';
        this.severity = new SeverityModel();
    }

}