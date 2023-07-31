package require mapscript

set comment {
/*
 * tile generation parameters
 *
 * kaMap! generates tiles to load in the client application by first rendering
 * larger areas from the map file and then slicing them up into smaller tiles.
 * This approach reduces the overhead of loading PHP/MapScript and PHP GD and
 * drawing the map file.  These larger areas are referred to as metaTiles in
 * the code.  You can set the size of both the small tiles and the metaTiles
 * here.  A reasonable size for the small tiles seems to be 200 pixels square.
 * Smaller tiles seem to cause problems in client browsers by causing too many
 * images to be created and thus slowing performance of live dragging.  Larger
 * tiles take longer to download to the client and are inefficient.
 *
 * The number of smaller tiles that form a metaTile can also be configured.
 * This parameter allows tuning of the tile generator to ensure optimal
 * performance and for label placement.  MapServer will produce labels only
 * within a rendered area.  If the area is too small then features may be
 * labelled multiple times.  If the area is too large, it may exceed MapServer,s
 * maximum map size (by default 2000x2000) or be too resource-intensive on the
 * server, ultimately reducing performance.
 */
}


set tileWidth 256
set tileHeight 256
set metaWidth 4
set metaHeight 4
set metaBuffer 10


set comment {
/*
 * in-image debugging information - tile location, outlines etc.
 * to use this, you need to remove images from your cache first.  This also
 * affects the meta tiles - if debug is on, they are not deleted.
 */
}

set debug_p false


set szMap "gmap"
set szBaseDir [file join $::acs::rootdir packages maps]
set szBaseDataDir ${szBaseDir}/data/
set szBaseCacheDir ${szBaseDir}/data/tmp-cache/
set szMapName Cyprus
set szMapFile [file join ${szBaseDataDir} cyprus.map]
set anScales {30000000 15000000 7500000 3000000 1500000 750000 300000 100000 30000 7500 3000 1500} ;# {15000000 7500000 3000000 1000000} ;# {75000 62500 50000 37500 25000 12500} ;# 


set szMetaDir ${szBaseDataDir}/tmp-meta
set szCacheDir ${szBaseDataDir}/tmp-cache

set szMapImageFormat PNG
#set szMapImageFormat AGG_Q
set szMapImageCreateFunction "imagecreatefrompng"
set szImageExtension "png"
set szImageCreateFunction "imagecreate"
set szImageHeader "image/png"

set szReferenceMapName keymap
set szReferenceMapFile ${szMetaDir}/${szReferenceMapName}.${szImageExtension}
#set szURL "./"
set szURL "http://localhost:8000/maps/"

set force_p false
