# Metaland Prototype

### GIS 

* Matching Land SHP with Land Price
* Merge various ROI Land SHP
* Building SHP with xN 'GRO_FLO_CO'
* Land boundary line SHP
* Land SHP 'real_centroid' for [lat,lon] -> address (Reverse Geocoding)
* Topology cleaning - slivers
* Export to GeoJSON - Newline Delimited

### Mapbox
* Build a vector tileset (MBTiles) from GeoJSON - tippecanoe
* Set the MinMax -Z -z!
```
tippecanoe -Z 10 -z 16 -o JG_SD_LAND_MB.mbtiles --generate-ids  --drop-densest-as-needed --extend-zooms-if-still-dropping /Users/jhp/Downloads/jg_sd_land_mb.geojson.json  --force
```
 * Substantially less initial loading + panning lag
 * Allows a scale-independent view of the data
