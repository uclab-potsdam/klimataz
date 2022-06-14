CREATE TABLE tripsStoptime(route_id TEXT, agency_id TEXT, agency_name TEXT, trip_id TEXT, trip_headsign TEXT,stop_id TEXT)

INSERT INTO tripsStoptime

SELECT
	routeTrips.route_id,	
	routeTrips.agency_id,
	routeTrips.agency_name,
	routeTrips.trip_id,
	routeTrips.trip_headsign,
	stop_times.stop_id
	
FROM
	routeTrips

INNER JOIN
	stop_times
ON 
	routeTrips.trip_id = stop_times.trip_id