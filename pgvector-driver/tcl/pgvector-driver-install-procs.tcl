ad_library {

    pgvector search engine driver installation procedures

    @author Neophytos Demetriou (neophytos@gmail.com)
    @creation-date 2023-07-25
}

namespace eval pgvector_driver::install {}


ad_proc -private pgvector_driver::install::preinstall_checks {

} {

    Make sure postgresql_contrib and pgvector are installed
    before allowing the installation of pgvector-driver

    @author Neophytos Demetriou
    @creation-date 2023-07-25

} {

    ns_log Notice " ********** STARTING BEFORE-INSTALL CALLBACK ****************"

    # check if pgvector is installed
    # in psql we do this by checking the presence of a data type vector
    # select typname from pg_type where typename='vector';

    if { [db_0or1row pgvector_compile_check {
        select distinct(typname) from pg_type where typname='vector'
    }] } {
        # if pgvector is installed
        ns_log Notice "******* pgvector is compiled and installed. ***********"
        # continue with installation
    } else {

        # pgvector not installed
        ns_log Notice "******* pgvector is not installed. ***********"
    }
    ns_log Notice " ********** ENDING BEFORE-INSTALL CALLBACK ****************"

}

ad_proc -private pgvector_driver::install::package_install {
} {

    Installation callback for pgvector search engine driver

    @author Neophytos Demetriou (neophytos@gmail.com)
    @creation-date 2023-07-25

    @error
} {
    pgvector_driver::install::register_fts_impl
}

ad_proc -private pgvector_driver::install::register_fts_impl {
} {

    Register FtsEngineDriver service contract implementation
    @author Neophytos Demetriou (neophytos@gmail.com)
    @creation-date 2023-07-25

    @return

    @error
} {

    set spec {
        name "pgvector-driver"
        aliases {
            search pgvector::search
            index pgvector::index
            unindex pgvector::unindex
            update_index pgvector::index
            summary pgvector::summary
            info pgvector::driver_info
        }
        contract_name "FtsEngineDriver"
        owner "pgvector-driver"
    }

    acs_sc::impl::new_from_spec -spec $spec

}

ad_proc -private pgvector_driver::install::before_uninstall {
} {
    Remove FtsEngineDriver service contract implementation
} {
    acs_sc::impl::delete \
        -contract_name "FtsEngineDriver" \
        -impl_name "pgvector-driver"
}

#
# Local variables:
#    mode: tcl
#    tcl-indent-level: 4
#    indent-tabs-mode: nil
# End:
