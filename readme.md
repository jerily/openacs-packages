pgvector-driver
pgembedding-driver
sample-2fa

# Installation Instuctions
```
# install vector embeddings naviserver module (BERT models)
git clone --recurse-submodules https://github.com/jerily/tbert.git
cd tbert && mkdir build && cd build
cmake .. -DBUILD_SHARED_LIBS=ON -DCMAKE_BUILD_TYPE=Release
make
make install
cd ..
make
make install

# install multi-factor authentication naviserver module
git clone --recurse-submodules https://github.com/jerily/tmfa.git
cd tmfa && mkdir build && cd build
cmake .. -DCMAKE_INSTALL_PREFIX:PATH=/usr
make
make install
cd ..
make
make install

# install qr code generator naviserver module
git clone https://github.com/jerily/tqrcodegen.git
cd tqrcodegen
make
make install

# install pg_vector postgresql extension
git clone --branch v0.4.4 https://github.com/pgvector/pgvector.git
cd pgvector
make
make install

# install pg_embedding postgresql extension
git clone https://github.com/neondatabase/pg_embedding.git
cd pg_embedding
git apply ../openacs-packages/pgembedding-driver/pg_embedding.patch
make
make install 
```
