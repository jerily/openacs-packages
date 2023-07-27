create table pgvector_txt (
        object_id integer
                  constraint txt_object_id_fk
                  references acs_objects on delete cascade,
        embedding vector(384)
);
CREATE INDEX ON pgvector_txt USING ivfflat (embedding vector_l2_ops) WITH (lists = 100);
