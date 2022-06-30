-- creating tables

create table agency(agency_id TEXT,agency_name TEXT,agency_url TEXT,
                    agency_timezone TEXT,agency_lang TEXT, agency_phone TEXT);

create table calendar_dates(service_id TEXT,date NUMERIC,exception_type NUMERIC);

create table routes(route_id TEXT,agency_id TEXT,route_short_name TEXT,
                    route_long_name TEXT,route_desc TEXT,route_type NUMERIC,
                    route_url TEXT,route_color TEXT,route_text_color TEXT);
create table shapes(shape_id TEXT,shape_pt_lat REAL,shape_pt_lon REAL,
                    shape_pt_sequence NUMERIC);
create table stops(stop_id TEXT,stop_code TEXT,stop_name TEXT,
                   stop_desc TEXT,stop_lat REAL,stop_lon REAL,
                   zone_id NUMERIC,stop_url TEXT,timepoint NUMERIC);
create table stop_times(trip_id TEXT,arrival_time TEXT,departure_time TEXT,
                        stop_id TEXT,stop_sequence NUMERIC,stop_headsign TEXT,
                        pickup_type NUMERIC,drop_off_type NUMERIC);
create table trips(route_id TEXT,service_id TEXT,trip_id TEXT,
                   trip_headsign TEXT,direction_id NUMERIC,
                   block_id TEXT,shape_id TEXT);

-- import data

.separator ","                              
.import "./gtfs_delfi/stops.txt" stops
.import "./gtfs_delfi/agency.txt" agency
.import "./gtfs_delfi/calendar_dates.txt" calendar_dates
.import "./gtfs_delfi/routes.txt" routes
.import "./gtfs_delfi/shapes.txt" shapes
.import "./gtfs_delfi/stops.txt" stops
.import "./gtfs_delfi/stop_times.txt" stop_times
.import "./gtfs_delfi/trips.txt" trips     
.dump                                    

-- removing headers
delete from agency where agency_id like 'agency_id';
delete from calendar_dates where service_id like 'service_id';
delete from routes where route_id like 'route_id';
delete from shapes where shape_id like 'shape_id';
delete from stops where stop_id like 'stop_id';
delete from stop_times where trip_id like 'trip_id';
delete from trips where route_id like 'route_id';

-- test dump and print random Wuppertal station 🤠
select * from stops where stop_id == 'de:05124:11130';

-- uncomment to quit once the db is created
--.quit