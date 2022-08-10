CREATE TABLE agencyStops(route_id TEXT, agency_id TEXT, agency_name TEXT, trip_id TEXT, trip_headsign TEXT,stop_id TEXT, stop_name TEXT,stop_desc TEXT,stop_lat REAL,stop_lon REAL)

INSERT INTO agencyStops
SELECT DISTINCT
	tripsStoptime.route_id,	
	tripsStoptime.agency_id,
	tripsStoptime.agency_name,
	tripsStoptime.trip_id,
	tripsStoptime.trip_headsign,
	tripsStoptime.stop_id,
	 stops.stop_name,
	 stops.stop_desc,
	 stops.stop_lat,
	 stops.stop_lon
	
FROM
	tripsStoptime

INNER JOIN
	stops
ON 
	tripsStoptime.stop_id = stops.stop_id