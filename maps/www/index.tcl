set path [acs_root_dir]/packages/maps/lib/
source ${path}/config.tcl

ad_page_contract {
	@author Neophytos Demetriou
} {
    ll:trim,notnull,optional
    {s:integer,notnull,optional 750000}
}


set nScale $s
if { ${nScale} > [lindex ${anScales} 0] } {
    set nScale [lindex ${anScales} 0]
}

## find closest valid scale (that is larger than this one)
foreach theScale [lreverse ${anScales}] {
    if { ${nScale} <= ${theScale} } {
        set nScale ${theScale}
        break;
    }
}


set map_url iframe-map
if { [info exists ll] } {
    lassign [split $ll {,}] lon lat
    if { [string is double -strict $lon] && [string is double -strict $lat] } {
	append map_url "?ll=${ll}&s=${nScale}"
    }
}

