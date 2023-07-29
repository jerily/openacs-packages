package require mapscript
set oMap [::mapscript::mapObj -args /home/phi/openacs/mapserver-8.0.1/tests/test.map]
set oMap [::mapscript::mapObj -args [file join $::acs::rootdir packages maps data cyprus.map]]
ns_return 200 text/plain ok

