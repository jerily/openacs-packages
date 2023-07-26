ad_library {

    pgembedding search engine driver installation procedures

    @author Neophytos Demetriou (neophytos@gmail.com)
    @creation-date 2023-07-26
}

namespace eval pgembedding_driver::install {}


ad_proc -private pgembedding_driver::install::preinstall_checks {

} {

    Make sure postgresql_contrib and pgembedding are installed
    before allowing the installation of pgembedding-driver

    @author Neophytos Demetriou
    @creation-date 2023-07-26

} {

    ns_log Notice " ********** STARTING BEFORE-INSTALL CALLBACK ****************"

    # check if pgembedding is installed
    # in psql we do this by checking the presence of a data type vector
    # select typname from pg_type where typename='vector';

    if { [db_0or1row pgembedding_compile_check {
        select 1 from pg_available_extensions where name='embedding'
    }] } {
        # if pgembedding is installed
        ns_log Notice "******* pgembedding is compiled and installed. ***********"
        # continue with installation
    } else {

        # pgembedding not installed
        ns_log Notice "******* pgembedding is not installed. ***********"
    }
    ns_log Notice " ********** ENDING BEFORE-INSTALL CALLBACK ****************"

}

ad_proc -private pgembedding_driver::install::package_install {
} {

    Installation callback for pgembedding search engine driver

    @author Neophytos Demetriou (neophytos@gmail.com)
    @creation-date 2023-07-26

    @error
} {
    pgembedding_driver::install::register_fts_impl
}

ad_proc -private pgembedding_driver::install::register_fts_impl {
} {

    Register FtsEngineDriver service contract implementation
    @author Neophytos Demetriou (neophytos@gmail.com)
    @creation-date 2023-07-26

    @return

    @error
} {

    set spec {
        name "pgembedding-driver"
        aliases {
            search pgembedding::search
            index pgembedding::index
            unindex pgembedding::unindex
            update_index pgembedding::index
            summary pgembedding::summary
            info pgembedding::driver_info
        }
        contract_name "FtsEngineDriver"
        owner "pgembedding-driver"
    }

    acs_sc::impl::new_from_spec -spec $spec

}

ad_proc -private pgembedding_driver::install::before_uninstall {
} {
    Remove FtsEngineDriver service contract implementation
} {
    acs_sc::impl::delete \
        -contract_name "FtsEngineDriver" \
        -impl_name "pgembedding-driver"
}

#
# Local variables:
#    mode: tcl
#    tcl-indent-level: 4
#    indent-tabs-mode: nil
# End:
