create table pgembedding_txt (
        object_id integer
                  constraint txt_object_id_fk
                  references acs_objects on delete cascade,
        embedding real[]
);
