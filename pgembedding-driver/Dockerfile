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
    mv openacs-packages/pgvector-driver ./openacs-4/packages/ && \
    patch -p0 /usr/local/ns/config-oacs-5-10-0.tcl ./openacs-4/packages/pgvector-driver/config.patch

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
    make install && \
    chmod 775 /usr/local/ns/lib/libtbert.so && \
    chown nsadmin:nsadmin /usr/local/ns/lib/libtbert.so

RUN git clone --branch v0.4.4 https://github.com/pgvector/pgvector.git && \
    cd pgvector && \
    make && \
    make install

RUN wget -O oacs-5-10-0.pg_dump.gz "https://openacs.org/storage/download/oacs-5-10-0.pg_dump.gz?file_id=5741618" && \
    gunzip oacs-5-10-0.pg_dump.gz && \
    /etc/init.d/postgresql start && \
    su postgres -c 'psql -f oacs-5-10-0.pg_dump oacs-5-10-0'

ENV LD_LIBRARY_PATH="$LD_LIBRARY_PATH:/usr/local/lib"

EXPOSE 8000
STOPSIGNAL SIGQUIT

CMD bash -c "/etc/init.d/postgresql start && /usr/local/ns/bin/nsd -f -t /usr/local/ns/config-oacs-5-10-0.tcl -u nsadmin -g nsadmin"
