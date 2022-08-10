CREATE TABLE agencyRoutes(route_id TEXT, agency_id TEXT, agency_name TEXT);

INSERT INTO agencyRoutes
SELECT
	route_id,	
	agency.agency_id,
	agency.agency_name
	
FROM
	agency

INNER JOIN
	routes
ON 
	routes.agency_id = agency.agency_id