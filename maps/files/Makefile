ifndef NAVISERVER
    NAVISERVER  = /usr/local/ns
endif

#
# Module name
#
MOD      =  mapscript.so

#
# Objects to build.
#
MODOBJS     = mapscript_wrap.o

MODLIBS  += -lmapserver

CFLAGS += -DPROJ_VERSION_MAJOR=8 -DUSE_NAVISERVER -I$(NAVISERVER)/include/mapserver -I/usr/local/include -I/usr/include/gdal -I/usr/include/libxml2/
CXXFLAGS += $(CFLAGS)

include  $(NAVISERVER)/include/Makefile.module
