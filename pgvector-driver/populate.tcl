set filename [file join $::acs::rootdir www foodhunter_reviews.csv]
set fp [open $filename]
set data [read $fp]
set lst [lrange [split $data "\n"] 1 end]

set package_id 1098
set index_vuh_parms {
  {-m view}
  {-folder_id:integer 0}
}
::xowiki::Package initialize -parameter $index_vuh_parms \
    -package_id $package_id \
    -url /xowiki/ \
    -actual_query "" \
    -user_id 759
foreach {dummy record} $lst {
	lassign [split $record ","] id something title
	set page [::xowiki::Page new \
              -title $title \
              -name en:$id \
              -package_id $package_id \
              -parent_id [::$package_id folder_id] \
              -destroy_on_cleanup \
              -text {
                nada
              }]
	$page set_content [string trim [$page text] " \n"]
	$page initialize_loaded_object
	$page save_new
}
ns_return 200 text/plain $lst
