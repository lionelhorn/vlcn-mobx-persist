CREATE TABLE IF NOT EXISTS store (id INTEGER PRIMARY KEY NOT NULL, key TEXT, data TEXT, lastUpdate TEXT);
SELECT crsql_as_crr('store');
