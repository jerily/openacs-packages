# pgembedding-driver

## Install pg_embedding PostgreSQL extension
```
git clone https://github.com/neondatabase/pg_embedding.git
git apply pg_embedding.patch
make
make install
```

In your database:
```
CREATE EXTENSION embedding;
```
