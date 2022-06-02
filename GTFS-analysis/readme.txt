Data from https://www.opendata-oepnv.de/ht/de/organisation/delfi/startseite?tx_vrrkit_view%5Bdataset_name%5D=deutschlandweite-sollfahrplandaten-gtfs&tx_vrrkit_view%5Baction%5D=details&tx_vrrkit_view%5Bcontroller%5D=View
To build database run in terminal "sqlite3 delfi.db < create_delfi_db.sql"
A script will be launched and data will be dumped in sqlite db. You can use it from command line or via https://sqlitebrowser.org/

In export dirty data specific to HHV assuming lat/lon bbox around Landkreis (cleaning and refining TBD).
To do:
- Match stops with responsible agency
- Aggregate trips for routes
- Aggregate stops for trips