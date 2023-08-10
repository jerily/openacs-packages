# pgvector-driver, pgembedding-driver, sample-2fa, and maps for OpenACS

## Try them out with docker
```
git clone https://github.com/jerily/openacs-packages.git
cd openacs-packages
docker build . -t neo-openacs-packages:latest
# On Linux
docker run --network host neo-openacs-packages:latest
# On Mac/Windows (thanks Adrian Ferenc and Dr. Yuen):
docker run -d -p 8000:8000 pgvector-driver:latest

# Once you run the last command, 
# you can point your browser to http://localhost:8000/
# and login with the following credentials:

email: test at example dot com
password: test
```
 
## Installation Instuctions
```bash
# Build and install the dependencies of tbert
git clone --recurse-submodules git@github.com:jerily/tbert.git
cd tbert
TBERT_DIR=$(pwd)
cd ${TBERT_DIR}/bert.cpp
mkdir build
cd build
cmake .. -DBUILD_SHARED_LIBS=ON -DCMAKE_BUILD_TYPE=Release
make
make install

# Build tbert NaviServer module
cd ${TBERT_DIR}
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
make
make install 
```
