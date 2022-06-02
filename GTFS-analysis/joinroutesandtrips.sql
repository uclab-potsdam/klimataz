-- quickly filters and joins according to agencies' ID (HHV)
SELECT
	agency.agency_id AS agency_id,
	agency.agency_name as agency_name,
	routes.route_id as route_id,
	routes.route_short_name as route_short_name,
	trips.trip_id as trip_id
FROM
	agency
	LEFT JOIN routes on routes.agency_id = agency.agency_id
	LEFT JOIN trips on trips.route_id = routes.route_id
WHERE
	agency.agency_id IN (8601,10375,10833,10874,10931,11008,13277)
	