SELECT
	stop_lat,
	stop_lon,
	stop_name,
	COUNT(*)
FROM
	agencyPerStops
GROUP BY
	stop_name;

