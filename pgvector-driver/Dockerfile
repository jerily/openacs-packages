FROM ubuntu:latest
ENV TZ=UTC
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN apt update && apt install -y \
    postgresql \
    postgresql-contrib \
    postgresql-14 \
    postgresql-server-dev-14 \
    python3 \
    python3-pip \
    python3-dev \
    build-essential \
    libssl-dev \
    libffi-dev \
    libxml2-dev \
    libxslt1-dev \
    zlib1g-dev \
    libgcrypt-dev \
    pkg-config \
    libgd-dev \
    autoconf \
    libpng-dev \
    libjpeg-dev \
    libproj-dev \
    libgdal-dev \
    libcairo-dev \
    libgeos-dev \
    libgif-dev \
    libfreetype-dev \
    cmake \
    cvs \
    git \
    vim \
    curl \
    wget \
    unzip \
    && rm -rf /var/lib/apt/lists/*

RUN pip3 install --upgrade pip
RUN pip3 install --upgrade setuptools
RUN pip3 install --upgrade wheel
RUN pip3 install --upgrade virtualenv
RUN pip3 install --upgrade virtualenvwrapper

RUN cd /usr/local/src && \
    wget http://prdownloads.sourceforge.net/tcl/tcl8.6.13-src.tar.gz && \
    tar xzf tcl8.6.13-src.tar.gz && \
    cd tcl8.6.13/unix && \
    ./configure --enable-threads && \
    make && \
    make install

RUN echo "14 main postgres" > ~postgres/.postgresqlrc && \
    cat ~postgres/.postgresqlrc && \
    chown postgres ~postgres/.postgresqlrc && \
    ls -la ~postgres/.postgresqlrc

RUN cd /usr/local/src && \
    git clone https://github.com/gustafn/install-ns && \
    cd install-ns && \
    bash install-ns.sh && \
    bash install-ns.sh build && \
    /etc/init.d/postgresql start && \
    pg_lsclusters && \ 
    bash install-oacs.sh && \
    bash install-oacs.sh build

RUN cd /var/www/oacs-5-10-0/ && \
    git clone https://github.com/jerily/openacs-packages.git && \
    ls -la && \
    patch -p0 /usr/local/ns/config-oacs-5-10-0.tcl ./openacs-packages/config.patch && \
    mv openacs-packages/pgvector-driver ./openacs-4/packages/ && \
    mv openacs-packages/pgembedding-driver ./openacs-4/packages/ && \
    mv openacs-packages/sample-2fa ./openacs-4/packages/ && \
    mv openacs-packages/maps ./openacs-4/packages/ && \
    cd openacs-4/packages/search && \
    patch -p0 < ../../../openacs-packages/search.patch && \
    cd ../xowiki && \
    patch -p0 < ../../../openacs-packages/xowiki.patch

RUN echo hello

RUN git clone --recurse-submodules https://github.com/jerily/tbert.git

RUN cd tbert && \
    cd bert.cpp && \
    pip3 install -r requirements.txt

RUN cd tbert && \
    cd bert.cpp && \
    cd models && \
    python3 download-ggml.py download all-MiniLM-L12-v2 q4_0 && \
    ls -la && \
    mkdir /var/www/oacs-5-10-0/models && \
    cp -R all-MiniLM-L12-v2 /var/www/oacs-5-10-0/models

RUN cd tbert && mkdir build && cd build && \
    cmake .. -DBUILD_SHARED_LIBS=ON -DCMAKE_BUILD_TYPE=Release -DNAVISERVER=/usr/local/ns && \
    make && \
    make install

RUN git clone --recurse-submodules https://github.com/jerily/tmfa.git && \
    cd tmfa && mkdir build && cd build && \
    cmake .. -DCMAKE_INSTALL_PREFIX:PATH=/usr && \
    make && \
    make install && \
    cd .. && \
    make && \
    make install

RUN git clone https://github.com/jerily/tqrcodegen.git && \
    cd tqrcodegen && \
    make && \
    make install

RUN git clone --branch v0.4.4 https://github.com/pgvector/pgvector.git && \
    cd pgvector && \
    make && \
    make install

RUN git clone https://github.com/neondatabase/pg_embedding.git && \
    cd pg_embedding && \
    git apply /var/www/oacs-5-10-0/packages/pgembedding-driver/pg_embedding.patch && \
    make && \
    make install  

RUN git clone https://github.com/flightaware/tcl.gd.git && \
    cd tcl.gd && \
    autoreconf && \
    ./configure --with-tcl=/usr/local/ns/lib/ && \
    make && \
    make install

RUN wget https://download.osgeo.org/mapserver/mapserver-8.0.1.tar.gz && \
    tar -xzvf mapserver-8.0.1.tar.gz && \
    cd mapserver-8.0.1 && \
    mkdir build && \
    cd build && \
    cmake .. -DWITH_FCGI=0 -DWITH_HARFBUZZ=0 -DWITH_FRIBIDI=0 -DWITH_PROTOBUFC=0 -DWITH_THREAD_SAFETY=1 -DCMAKE_BUILD_TYPE=Debug -DCMAKE_INSTALL_PREFIX=/usr/local/ns && \
    make && \
    make install && \
    cd ../mapscript/tcl && \
    cp /var/www/oacs-5-10-0/packages/maps/files/* . && \
    swig -tcl8 -I/usr/local/include/mapserver/ -outcurrentdir -namespace -DUSE_NAVISERVER ../mapscript.i && \
    gcc -shared -o mapscript.so ./mapscript_wrap.c -I/usr/local/include/mapserver -I/usr/include/gdal -I/usr/include/libxml2/ -I/usr/local/ns/include -L/usr/local/ns/lib -lnsd -ltcl8.6 -lmapserver -DPROJ_VERSION_MAJOR=8 -DUSE_NAVISERVER -fPIC && \
    cp mapscript.so /usr/local/ns/bin/

RUN wget -O oacs-5-10-0.pg_dump.gz "https://openacs.org/storage/download/oacs-5-10-0.pg_dump.gz?file_id=5741618" && \
    gunzip oacs-5-10-0.pg_dump.gz && \
    /etc/init.d/postgresql start && \
    su postgres -c 'psql -f oacs-5-10-0.pg_dump oacs-5-10-0'

ENV LD_LIBRARY_PATH="$LD_LIBRARY_PATH:/usr/local/lib"

EXPOSE 8000
STOPSIGNAL SIGQUIT

CMD bash -c "/etc/init.d/postgresql start && /usr/local/ns/bin/nsd -f -t /usr/local/ns/config-oacs-5-10-0.tcl -u nsadmin -g nsadmin"
