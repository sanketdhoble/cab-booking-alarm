import { Component } from '@angular/core';
import {AjaxService} from './ajax.service';
declare var google: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers:[AjaxService]
})
export class AppComponent {
  title = 'app';
	country:string;
	latitude:number;
	 longitude:number;
	 reachingTime:number;
	 isTimeToCallCab:boolean=false;
	 reachingTimeHr:number;
	 reachingTimeMin:number;
	 timeLeftToCallCab:number;
	 hours:Array<Object> = [{key:0,value:"12 am"},{key:1,value:"1 am"},{key:2,value:"2 am"},{key:3,value:"3 am"},{key:4,value:"4 am"},{key:5,value:"5 am"},{key:6,value:"6 am"},{key:7,value:"7 am"},{key:8,value:"8 am"},{key:9,value:"9 am"},{key:10,value:"10 am"},{key:11,value:"11 am"},{key:12,value:"12 pm"},{key:13,value:"1 pm"},{key:14,value:"2 pm"},{key:15,value:"3 pm"},{key:16,value:"4 pm"},{key:17,value:"5 pm"},{key:18,value:"6 pm"},{key:19,value:"7 pm"},{key:20,value:"8 pm"},{key:21,value:"9 pm"},{key:22, value:"10 pm"},{key:23,value:"11 pm"}];
	 minutes:Array<number> = [0,5,10,15,20,25,30,35,40,45,50,55];
	 address:string;
	 currentTime:number;
	 sourceLat=21.1458004;
	 sourceLong=79.0881546;
	 destinationLat=21.1312759;
	 destinationLong=79.0800402;
	 googleTime:number;
	 uberGoTime:number;
	 worstCaseTime:number;
	 timeToLeave:number;
	 timeLeftForCab:number;
	 res:string;
	constructor(private ajaxService: AjaxService){ 
		this.address="nagpur";
	 }
  	getLaLng(){
  		this.ajaxService.getLatLong(this.address).subscribe(response => {
        this.latitude = response.results[0].geometry.location.lat;
        this.longitude = response.results[0].geometry.location.lng; 
        console.log(this) 

    		});
  	}
  	uberDetails(){
  		//DUMMY UBER API RESPONSE giving info about estimated arrival time of driver for pickup.
  	var data={
				"times": [
					{
					"localized_display_name": "uberGO",
					"estimate": 120, //mins
					"display_name": "uberGO",
					"product_id": "96f64e8b-10f3-44cc-8054-c1d77b1657fd"
					},
					{
					"localized_display_name": "uberX",
					"estimate": 120, //mins
					"display_name": "uberX",
					"product_id": "5473fa8e-fb10-44d0-9f39-22d362c49f2e"
					}
				]
		    }
		    var uberGoData = data.times;
	        for(var uberGoIndex=0;uberGoIndex<uberGoData.length;uberGoIndex++)
	          {
	            if(uberGoData[uberGoIndex].localized_display_name=="uberGO")
	            {
	                this.uberGoTime=uberGoData[uberGoIndex].estimate;
	            }
	          }
	         
	         this.getGoogleTime();
  	}
  	getGoogleTime(){
  	        var origin = new google.maps.LatLng(this.sourceLat,this.sourceLong),
                destination =  new google.maps.LatLng(this.destinationLat,this.destinationLong),
                service = new google.maps.DistanceMatrixService();
            service.getDistanceMatrix(
                {
                    origins: [origin],
                    destinations: [destination],
                    travelMode: google.maps.TravelMode.DRIVING,
                    avoidHighways: false,
                    avoidTolls: false
                }, 
                this.callback.bind(this)
            );
    

    }
    callback(response, status) {
    			console.log(this)

                if(status=="OK") {
                    this.googleTime= response.rows[0].elements[0].duration.value;
                    this.logic();
                }
                else {
                    console.log("Error: " + status);
                }
            }

    logic(){
    		/** Logic & calculations**/
	          console.log(this.uberGoTime/60,"uberGoTime mins");
			  console.log(Math.ceil(this.googleTime/60),"googleTime mins");	          
	          this.worstCaseTime=(this.googleTime+15*60+60*60)*1000;  //in sec
	          this.currentTime=new Date().getTime();
	          var currentTimeHr=new Date().getHours();
	          var currentTimeMin=new Date().getMinutes();
	          this.timeToLeave=(this.currentTime-this.worstCaseTime*1000);
	          this.timeLeftForCab=((this.reachingTimeHr-currentTimeHr)*60*60*1000)+((this.reachingTimeMin-currentTimeMin)*60*1000)
	          console.log(this.timeLeftForCab/60000,'timeLeftForCab mins');
	          console.log(this.worstCaseTime/60000,'worstCaseTime mins');

	          if((this.timeLeftForCab/60000)<=(this.uberGoTime/60+Math.ceil(this.googleTime/60))){
	          	alert('ALARM, Time to leave now')
	          	console.log("ALARM, Time to go out");
	          	return;
	          }
	          if(this.timeLeftForCab>this.worstCaseTime){
	          	var diff=this.timeLeftForCab-this.worstCaseTime;
		          	setTimeout(() => {
				      this.uberDetails();
				    }, diff);
	          }
	          else{
	          	console.log("WorstCase reached, checking every 1 min");
	          		setTimeout(() => {
	          		   console.log("test1");
				      this.uberDetails();
				    }, 60000);
	          }
	          this.timeLeftToCallCab=this.timeLeftForCab/60000-(this.uberGoTime/60+this.googleTime/60);
	          this.latitude=34;
	          console.log(this.latitude,'lat')
	          console.log(this,'this')
	          
	          console.log(this.timeLeftToCallCab,'timeLeft to Leave');

    }




}
