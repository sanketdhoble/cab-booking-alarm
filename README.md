# CabApp

##Inputs : 
1. Source and Destination in the format < latitude, longitude>  The time at which he or she needs to reach at the destination

##Assumptions taken :
1. The user has time in hand to book a cab. 
2. The time at which he/she expects to reach is not beyond the day of setting the reminder. 
3. An Uber Go is the required means of transportation and is assumed to be always available. 
4. Travel time provided my Go o gle Maps will have a maximum deviation of 60 Minutes. 
5. Maximum time taken by the cab to reach the pickup point has been capped to 15 Minutes. 


##Implementation Details : 
1. User provides all necessary inputs.
2. Once he sets the reminder, both the Maps and Uber API are called to check if it is already time to book a cab. 
	a. If yes, remind the user. 
	b. If no, then the following cases arise 
		i. We are already within the worst case time, then check the revised times after every 1 minute e.g Scheduled Time : 10:00 AM, Travel Time : 10 Mins, Cab Arrival Time : 2 Mins So worst case the user takes (10 +60 i.e maximum deviation) + 15 i.e worst case of Uber = 85 Minutes that evaluates to 8:35 AM So if the user sets the reminder after 8:35 AM, check every minute to minimize risk of delay, else go to 2nd case. 
		ii. We haven't yet reached the worst case time, so recheck only after we
		have reached at the worst case time and then keep checking every
		minute from then on.