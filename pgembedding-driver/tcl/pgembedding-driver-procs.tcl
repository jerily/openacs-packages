ad_library {
    semantic search engine using pgembedding

    @author Neophytos Demetriou (neophytos@gmail.com)
    @creation-date 2023-07-26
}

namespace eval pgembedding {}

ad_proc -public pgembedding::index {
    object_id
    txt
    title
    keywords
} {

    @author Neophytos Demetriou (neophytos@gmail.com)
    @creation-date 2023-07-26

    @param object_id
    @param txt
    @param title
    @param keywords

    @return nothing
} {
    set embedding "\{[join [::tbert::ev mymodel $title] ","]\}"
    #ns_log notice embedding=$embedding
    set exists_p [db_0or1row exists_row "select 1 from pgembedding_txt where object_id = :object_id"]
    if { !$exists_p } {
    	db_dml insert_index {
        insert into pgembedding_txt (object_id, embedding)
          select o.object_id, :embedding
          from acs_objects o
          where object_id = :object_id
           and not exists (select 1 from pgembedding_txt
                            where object_id = o.object_id)
    	}
    } else {
      db_dml update_index {
          update pgembedding_txt set
          embedding = :embedding
          where object_id = :object_id
      }
    }
}

ad_proc -public pgembedding::unindex {
    object_id
} {

    @author Neophytos Demetriou (neophytos@gmail.com)
    @creation-date 2023-07-26

    @param object_id

    @return nothing
} {
    db_dml unindex "delete from pgembedding_txt where object_id=:object_id"
}

ad_proc -deprecated pgembedding::update_index args {

    @author Neophytos Demetriou (neophytos@gmail.com)
    @creation-date 2023-07-26

    @param object_id
    @param txt
    @param title
    @param keywords

    @return nothing
} {
    pgembedding::index {*}$args
}

ad_proc -callback search::search -impl pgembedding-driver {
    -query
    {-user_id 0}
    {-offset 0}
    {-limit 10}
    {-df ""}
    {-dt ""}
    {-package_ids ""}
    {-object_type ""}
    {-extra_args {}}
} {
    @author Neophytos Demetriou (neophytos@gmail.com)
    @creation-date 2023-07-26

    @param query
    @param user_id
    @param offset
    @param limit
    @param df
    @param dt
    @param package_ids
    @param object_type
    @param extra_args
    @return
    @error
} {
    set packages $package_ids
    set orig_query $query


    set embedding "ARRAY\[[join [::tbert::ev mymodel $query] ","]\]"

    set where_clauses ""
    set from_clauses ""

    set limit_clause ""
    set offset_clause ""
    if {[string is integer -strict $limit]} {
        set limit_clause " limit $limit "
    }
    if {[string is integer -strict $offset]} {
        set offset_clause " offset $offset "
    }

    set need_acs_objects 0
    if {$df ne ""} {
        set need_acs_objects 1
        lappend where_clauses "o.creation_date > :df"
    }
    if {$dt ne ""} {
        set need_acs_objects 1
        lappend where_clauses "o.creation_date < :dt"
    }

    foreach {arg value} $extra_args {
        array set arg_clauses [lindex [callback -impl $arg search::extra_arg -value $value -object_table_alias "o"] 0]
        if {[info exists arg_clauses(from_clause)] && $arg_clauses(from_clause) ne ""} {
            lappend from_clauses $arg_clauses(from_clause)
        }
        if {[info exists arg_clauses(where_clause)] && $arg_clauses(where_clause) ne ""} {
            lappend where_clauses $arg_clauses(where_clause)
        }
    }
    if {[llength $extra_args]} {
        # extra_args can assume a join on acs_objects
        set need_acs_objects 1
    }
    # generate the package id restriction.
    set ids {}
    foreach id $packages {
        if {[string is integer -strict $id]} {
            lappend ids $id
        }
    }
    if {$ids ne ""} {
        set need_acs_objects 1
        lappend where_clauses "o.package_id in ([ns_dbquotelist $ids])"
    }
    if {$need_acs_objects} {
        lappend from_clauses "pgembedding_txt txt" "acs_objects o"
        lappend where_clauses "o.object_id = txt.object_id"
    } else {
        lappend from_clauses "pgembedding_txt txt"
    }


    set embedding "ARRAY\[[join [::tbert::ev mymodel $query] ","]\]"
    set orderby_clause "order by embedding <-> $embedding"
    set sql [subst {
           select txt.object_id
           from [join $from_clauses ","]
           [expr {[llength $where_clauses] > 0 ? " where [join $where_clauses { and }]" : ""}]
           $orderby_clause
           $limit_clause $offset_clause
    }]
    ns_log notice sql=$sql
    set results_ids [db_list search $sql]
    set count 100
    set stop_words {}

    return [list ids $results_ids stopwords $stop_words count $count]
}

ad_proc -public pgembedding::summary {
    query
    txt
} {
    @author Neophytos Demetriou (neophytos@gmail.com)
    @creation-date 2023-07-26

    @param query
    @param txt

} {
    return [string range $txt 0 200]
}


ad_proc -callback search::driver_info -impl pgembedding-driver {
    @author Neophytos Demetriou (neophytos@gmail.com)
    @creation-date 2023-07-26
} {
    pgembedding driver info callback
} {
    return [pgembedding::driver_info]
}

ad_proc -private pgembedding::driver_info {} {
    @author Neophytos Demetriou (neophytos@gmail.com)
    @creation-date 2023-07-26
} {
    return [list package_key pgembedding-driver version 1 automatic_and_queries_p 0  stopwords_p 0]
}


#
# Local variables:
#    mode: tcl
#    tcl-indent-level: 4
#    indent-tabs-mode: nil
# End:
