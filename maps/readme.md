# maps

![Maps Sample Screenshot - Cyprus](maps-screenshot-1.png "Maps Sample Screenshot - Cyprus")
![Maps Sample Screenshot - Paphos](maps-screenshot-2.png "Maps Sample Screenshot - Paphos")


```
apt install -y pkg-config \
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
    cmake
```

Install MapServer and tcl.gd for NaviServer:
```
git clone https://github.com/flightaware/tcl.gd.git
cd tcl.gd
autoreconf
./configure --with-tcl=/usr/local/ns/lib/
make
make install

wget https://download.osgeo.org/mapserver/mapserver-8.0.1.tar.gz
tar -xzvf mapserver-8.0.1.tar.gz
cd mapserver-8.0.1
mkdir build
cd build
cmake .. -DWITH_FCGI=0 -DWITH_HARFBUZZ=0 -DWITH_FRIBIDI=0 -DWITH_PROTOBUFC=0 -DWITH_THREAD_SAFETY=1 -DCMAKE_BUILD_TYPE=Debug -DCMAKE_INSTALL_PREFIX=/usr/local/ns
make
make install
cd ../mapscript/tcl
cp /var/www/oacs-5-10-0/packages/maps/files/* .
swig -tcl8 -I/usr/local/include/mapserver/ -outcurrentdir -namespace -DUSE_NAVISERVER ../mapscript.i
gcc -shared -o mapscript.so ./mapscript_wrap.c -I/usr/local/include/mapserver -I/usr/include/gdal -I/usr/include/libxml2/ -I/usr/local/ns/include -L/usr/local/ns/lib -lnsd -ltcl8.6 -lmapserver -DPROJ_VERSION_MAJOR=8 -DUSE_NAVISERVER -fPIC
cp mapscript.so /usr/local/ns/bin/
```
