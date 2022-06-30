CREATE TABLE routeTrips(route_id TEXT, agency_id TEXT, agency_name TEXT, trip_id TEXT, trip_headsign TEXT);

INSERT INTO routeTrips
SELECT
	trips.trip_id,
	trips.trip_headsign
	agencyRoutes.route_id,	
	agencyRoutes.agency_id,
	agencyRoutes.agency_name
	
FROM
	agencyRoutes

INNER JOIN
	trips
ON 
	agencyRoutes.route_id = trips.route_id