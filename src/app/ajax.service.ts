import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class AjaxService {
    constructor(private http: Http){
        console.log('AjaxService Initialized...');
    }

    getLatLong(address){
        return this.http.get('https://maps.googleapis.com/maps/api/geocode/json?v=3&address='+address+'&components=country:india&sensor=false')
            .map(res => res.json());
    }
}