import { SitesModel } from './SitesModel';
import { PanelModel } from './PanelModel';


export class FileDtlsModel {

    id : number;
    site_id : number;
    name : string;
    folder : string;
    path : string;
    thumbnail : string;
    latitude : number;
    longitude : number;
    altitude : number;
    status : string;
    temp_path : string;
    total_annotations : number;
    created_at : string;
    updated_at : string;
    deleted_at : string;
    panels : PanelModel;
    site : SitesModel;
}