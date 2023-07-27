create table pgvector_txt (
        object_id integer
                  constraint txt_object_id_fk
                  references acs_objects on delete cascade,
        embedding vector(384)
);
