/* ***********************************************************
Example 4-3 (DHTMLapi.js)
"Dynamic HTML:The Definitive Reference"
2nd Edition
by Danny Goodman
Published by O'Reilly & Associates  ISBN 1-56592-494-0
http://www.oreilly.com
Copyright 2002 Danny Goodman.  All Rights Reserved.
************************************************************ */
// DHTMLapi.js custom API for cross-platform
// object positioning by Danny Goodman (http://www.dannyg.com).
// Release 2.0. Supports NN4, IE, and W3C DOMs.

// Global variables
var isCSS, isW3C, isIE4, isNN4;
// initialize upon load to let all browsers establish content objects
function initDHTMLAPI() {
    if (document.images) {
        isCSS = (document.body && document.body.style) ? true : false;
        isW3C = (isCSS && document.getElementById) ? true : false;
        isIE4 = (isCSS && document.all) ? true : false;
        isNN4 = (document.layers) ? true : false;
        isIE6CSS = (document.compatMode && document.compatMode.indexOf("CSS1") >= 0) ? true : false;
    }
}
// set event handler to initialize API
//window.onload = initDHTMLAPI;

// Seek nested NN4 layer from string name
function seekLayer(doc, name) {
    var theObj;
    for (var i = 0; i < doc.layers.length; i++) {
        if (doc.layers[i].name == name) {
            theObj = doc.layers[i];
            break;
        }
        // dive into nested layers if necessary
        if (doc.layers[i].document.layers.length > 0) {
            theObj = seekLayer(document.layers[i].document, name);
        }
    }
    return theObj;
}

// Convert object name string or object reference
// into a valid element object reference
function getRawObject(obj) {
    var theObj;
    if (typeof obj == "string") {
        if (isW3C) {
            theObj = document.getElementById(obj);
        } else if (isIE4) {
            theObj = document.all(obj);
        } else if (isNN4) {
            theObj = seekLayer(document, obj);
        }
    } else {
        // pass through object reference
        theObj = obj;
    }
    return theObj;
}

// Convert object name string or object reference
// into a valid style (or NN4 layer) reference
function getObject(obj) {
    var theObj = getRawObject(obj);
    if (theObj && isCSS) {
        theObj = theObj.style;
    }
    return theObj;
}

// Position an object at a specific pixel coordinate
function shiftTo(obj, x, y) {
    var theObj = getObject(obj);
    if (theObj) {
        if (isCSS) {
            // equalize incorrect numeric value type
            var units = (typeof theObj.left == "string") ? "px" : 0;
            theObj.left = x + units;
            theObj.top = y + units;
        } else if (isNN4) {
            theObj.moveTo(x,y)
        }
    }
}

// Move an object by x and/or y pixels
function shiftBy(obj, deltaX, deltaY) {
    var theObj = getObject(obj);
    if (theObj) {
        if (isCSS) {
            // equalize incorrect numeric value type
            var units = (typeof theObj.left == "string") ? "px" : 0;
            theObj.left = getObjectLeft(obj) + deltaX + units;
            theObj.top = getObjectTop(obj) + deltaY + units;
        } else if (isNN4) {
            theObj.moveBy(deltaX, deltaY);
        }
    }
}

// Set the z-order of an object
function setZIndex(obj, zOrder) {
    var theObj = getObject(obj);
    if (theObj) {
        theObj.zIndex = zOrder;
    }
}

// Set the background color of an object
function setBGColor(obj, color) {
    var theObj = getObject(obj);
    if (theObj) {
        if (isNN4) {
            theObj.bgColor = color;
        } else if (isCSS) {
            theObj.backgroundColor = color;
        }
    }
}

// Set the visibility of an object to visible
function show(obj) {
    var theObj = getObject(obj);
    if (theObj) {
        theObj.visibility = "visible";
    }
}

// Set the visibility of an object to hidden
function hide(obj) {
    var theObj = getObject(obj);
    if (theObj) {
        theObj.visibility = "hidden";
    }
}

// Retrieve the x coordinate of a positionable object
function getObjectLeft(obj)  {
    var elem = getRawObject(obj);
    var result = 0;
    if (document.defaultView) {
        var style = document.defaultView;
        var cssDecl = style.getComputedStyle(elem, "");
        result = cssDecl.getPropertyValue("left");
    } else if (elem.currentStyle) {
        result = elem.currentStyle.left;
    } else if (elem.style) {
        result = elem.style.left;
    } else if (isNN4) {
        result = elem.left;
    }
    return parseInt(result);
}

// Retrieve the y coordinate of a positionable object
function getObjectTop(obj)  {
    var elem = getRawObject(obj);
    var result = 0;
    if (document.defaultView) {
        var style = document.defaultView;
        var cssDecl = style.getComputedStyle(elem, "");
        result = cssDecl.getPropertyValue("top");
    } else if (elem.currentStyle) {
        result = elem.currentStyle.top;
    } else if (elem.style) {
        result = elem.style.top;
    } else if (isNN4) {
        result = elem.top;
    }
    return parseInt(result);
}

// Retrieve the rendered width of an element
function getObjectWidth(obj)  {
    var elem = getRawObject(obj);
    var result = 0;
    if (elem.offsetWidth) {
        result = elem.offsetWidth;
    } else if (elem.clip && elem.clip.width) {
        result = elem.clip.width;
    } else if (elem.style && elem.style.pixelWidth) {
        result = elem.style.pixelWidth;
    }
    return parseInt(result);
}

// Retrieve the rendered height of an element
function getObjectHeight(obj)  {
    var elem = getRawObject(obj);
    var result = 0;
    if (elem.offsetHeight) {
        result = elem.offsetHeight;
    } else if (elem.clip && elem.clip.height) {
        result = elem.clip.height;
    } else if (elem.style && elem.style.pixelHeight) {
        result = elem.style.pixelHeight;
    }
    return parseInt(result);
}


// Return the available content width space in browser window
function getInsideWindowWidth() {
    if (window.innerWidth) {
        return window.innerWidth;
    } else if (isIE6CSS) {
        // measure the html element's clientWidth
        return document.body.parentElement.clientWidth;
    } else if (document.body && document.body.clientWidth) {
        return document.body.clientWidth;
    }
    return 0;
}
// Return the available content height space in browser window
function getInsideWindowHeight() {
    if (window.innerHeight) {
        return window.innerHeight;
    } else if (isIE6CSS) {
        // measure the html element's clientHeight
        return document.body.parentElement.clientHeight;
    } else if (document.body && document.body.clientHeight) {
        return document.body.clientHeight;
    }
    return 0;
}

// XMLhttpRequest stuff
var aXmlHttp = new Array();
var aXmlResponse = new Array();
function xmlResult()
{
    for(var i=0;i<aXmlHttp.length;i++)
    {
        if(aXmlHttp[i] && aXmlHttp[i][0] && aXmlHttp[i][0].readyState==4&&aXmlHttp[i][0].responseText)
        {
            //must null out record before calling function in case
            //function invokes another xmlHttpRequest.
            var f = aXmlHttp[i][2];
            var o = aXmlHttp[i][1];
            var s = aXmlHttp[i][0].responseText;
            aXmlHttp[i][0] = null;
            aXmlHttp[i][1] = null;
            aXmlHttp[i] = null;
            f.apply(o,new Array(s));
        }
    }
}

// u -> url
// o -> object (can be null) to invoke function on
// f -> callback function
// p -> optional argument to specify POST
function call(u,o,f)
{
    var method = "GET";
    var dat;
    if (arguments.length==4){
      method = "POST";
      tmp = u.split(/\?/);
      u = tmp[0];
      dat = tmp[1];

    }
    var idx = aXmlHttp.length;
    for(var i=0; i<idx;i++)
    if (aXmlHttp[i] == null)
    {
        idx = i;
        break;
    }
    aXmlHttp[idx]=new Array(2);
    aXmlHttp[idx][0] = getXMLHTTP();

    aXmlHttp[idx][1] = o;
    aXmlHttp[idx][2] = f;
    if(aXmlHttp[idx])
    {
        aXmlHttp[idx][0].open(method,u,true);
        if(method == "POST"){
          aXmlHttp[idx][0].setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

          aXmlHttp[idx][0].send(dat);
        }
        aXmlHttp[idx][0].onreadystatechange=xmlResult;
        
       if(method =="GET"){ aXmlHttp[idx][0].send(null);}
    }
}

function getXMLHTTP()
{
    var A=null;
    if(!A && typeof XMLHttpRequest != "undefined")
    {
        A=new XMLHttpRequest();
    }
    if (!A)
    {
        try
        {
            A=new ActiveXObject("Msxml2.XMLHTTP");
        }
        catch(e)
        {
            try
            {
                A=new ActiveXObject("Microsoft.XMLHTTP");
            }
            catch(oc)
            {
                A=null
            }
        }
    }    
    return A;
}

function drawNull(s)
{
    eval(s);
    return false;
}
/**
 * kaMap! events
 */
var gnLastEventId = 0;
var KAMAP_ERROR = gnLastEventId ++;
var KAMAP_WARNING = gnLastEventId ++;
var KAMAP_NOTICE = gnLastEventId++;
var KAMAP_INITIALIZED = gnLastEventId ++;
var KAMAP_MAP_INITIALIZED = gnLastEventId ++;
var KAMAP_EXTENTS_CHANGED = gnLastEventId ++;
var KAMAP_SCALE_CHANGED = gnLastEventId ++;
var KAMAP_LAYERS_CHANGED = gnLastEventId ++;


/******************************************************************************
 * kaMap main class
 *
 * construct a new kaMap instance.  Pass the id of the div to put the kaMap in
 *
 * this class is the main API for any application.  Only use the functions
 * provided by this API to ensure everything functions correctly
 *
 * szID - string, the id of a div to put the kaMap! into
 *
 *****************************************************************************/
function kaMap( szID )
{
    this.isCSS = false;
    this.isW3C = false;
    this.isIE4 = false;
    this.isNN4 = false;
    this.isIE6CSS = false;

	if (document.images) {
        this.isCSS = (document.body && document.body.style) ? true : false;
        this.isW3C = (this.isCSS && document.getElementById) ? true : false;
        this.isIE4 = (this.isCSS && document.all) ? true : false;
        this.isNN4 = (document.layers) ? true : false;
        this.isIE6CSS = (document.compatMode && document.compatMode.indexOf("CSS1") >= 0) ? true : false;
    }
    
    this.domObj = this.getRawObject( szID );
    this.domObj.style.overflow = 'hidden';
    
    this.hideLayersOnMove = false;

    /**
     * initialization states
     * 0 - not initialized
     * 1 - initializing
     * 2 - initialized
     */
    this.initializationState = 0;

    //track mouse down events
    this.bMouseDown = false;

    //track last recorded mouse position
    this.lastx = 0;
    this.lasty = 0;

    //keep a reference to the inside layer since we use it a lot
    this.theInsideLayer = null;

    //viewport width and height are used in many calculations
    this.viewportWidth = safeParseInt(this.domObj.style.width);
    this.viewportHeight = safeParseInt(this.domObj.style.height);

    //track amount the inside layer has moved to help in wrapping images
    this.xOffset = 0;
    this.yOffset = 0;

    //track current origin offset value
    this.xOrigin = 0;
    this.yOrigin = 0;

    //the name of the current map
    this.currentMap = '';

    //the current width and height in tiles
    this.nWide = 0;
    this.nHigh = 0;

    //current top and left are tracked when the map moves
    //to start the map at some offset, these would be set to
    //the appropriate pixel value.
    this.nCurrentTop = 0; //null;
    this.nCurrentLeft = 0; //null;

    //keep a live reference to aPixel to help with caching problems - hish
    this.aPixel = new Image(1,1);
    this.aPixel.src = '/maps/images/a_pixel.gif';

    //error stack for tracking images that have failed to load
    this.imgErrors = new Array();

    //an array of available maps
    this.aMaps = new Array();

    //tile size and buffer size determine how many tiles to create
    this.tileWidth = null;
    this.tileHeight = null;
    this.nBuffer = 1;

    this.baseURL = '';
    
    //size of a pixel, geographically - assumed to be square
    this.cellSize = null;

    //image id counter - helps with reloading failed images
    this.gImageID = 0;

    //event manager
    this.eventManager = new _eventManager();

    //slider stuff
    this.as=slideid=null;
    this.accelerationFactor=1;
    this.pixelsPerStep = 30;
    this.timePerStep = 25;

    //this is a convenience to allow redirecting the client code to a server
    //other than the one that this file was loaded from.  This may not
    //work depending on security settings, except for loading tiles since
    //those come directly from a php script instead of an XmlHttpRequest.
    //
    //by default, if this is empty, it loads from the same site as the
    //page loaded from.  If set, it should be a full http:// reference to the
    //directory in which init.php, tile.php and the other scripts are located.
    this.server = '';

    //similarly, this is the global initialization script called once per page
    //load ... the result of this script tell the client what other scripts
    //are used for the other functions
    this.init = "init";

    //these are the values that need to be initialized by the init script
    this.tileURL = null;

    this.aObjects = [];
    this.aCanvases = [];
    this.layersHidden = false;

    this.aTools = [];

    /* register the known events */
    for (var i=0; i<gnLastEventId; i++)
    {
        this.registerEventID( i );
    }
    this.createLayers();

}

kaMap.prototype.seekLayer = function(doc, name) {
    var theObj;
    for (var i = 0; i < doc.layers.length; i++) {
        if (doc.layers[i].name == name) {
            theObj = doc.layers[i];
            break;
        }
        // dive into nested layers if necessary
        if (doc.layers[i].document.layers.length > 0) {
            theObj = this.seekLayer(document.layers[i].document, name);
        }
    }
    return theObj;
}

// Convert object name string or object reference
// into a valid element object reference
kaMap.prototype.getRawObject = function(obj) {
    var theObj;
    if (typeof obj == "string") {
        if (this.isW3C) {
            theObj = document.getElementById(obj);
        } else if (this.isIE4) {
            theObj = document.all(obj);
        } else if (this.isNN4) {
            theObj = seekLayer(document, obj);
        }
    } else {
        // pass through object reference
        theObj = obj;
    }
    return theObj;
}

// Convert object name string or object reference
// into a valid style (or NN4 layer) reference
kaMap.prototype.getObject = function(obj) {
    var theObj = this.getRawObject(obj);
    if (theObj && this.isCSS) {
        theObj = theObj.style;
    }
    return theObj;
}

// Retrieve the rendered width of an element
kaMap.prototype.getObjectWidth = function(obj)  {
    var elem = this.getRawObject(obj);
    var result = 0;
    if (elem.offsetWidth) {
        result = elem.offsetWidth;
    } else if (elem.clip && elem.clip.width) {
        result = elem.clip.width;
    } else if (elem.style && elem.style.pixelWidth) {
        result = elem.style.pixelWidth;
    }
    return parseInt(result);
}

// Retrieve the rendered height of an element
kaMap.prototype.getObjectHeight = function(obj)  {
    var elem = this.getRawObject(obj);
    var result = 0;
    if (elem.offsetHeight) {
        result = elem.offsetHeight;
    } else if (elem.clip && elem.clip.height) {
        result = elem.clip.height;
    } else if (elem.style && elem.style.pixelHeight) {
        result = elem.style.pixelHeight;
    }
    return parseInt(result);
}

/**
 * kaMap.zoomTo( lon, lat [, scale] )
 *
 * zoom to some geographic point (in current projection) and optionally scale
 *
 * lon - the x coordinate to zoom to
 * lat - the y coordinate to zoom to
 * scale - optional. The scale to use
 */
kaMap.prototype.zoomTo = function( cgX, cgY )
{

    var oMap = this.getCurrentMap();
    var inchesPerUnit = new Array(1, 12, 63360.0, 39.3701, 39370.1, 4374754);
    var newScale;
    if (arguments.length == 3)
    {
        newScale = arguments[2];
    }
    else
    {
        newScale = this.getCurrentScale();
    }
    this.cellSize = newScale/(oMap.resolution * inchesPerUnit[oMap.units]);
    var nFactor = oMap.zoomToScale( newScale );

    var cpX = cgX / this.cellSize;
    var cpY = cgY / this.cellSize;

    var vpLeft = Math.round(cpX - this.viewportWidth/2);
    var vpTop = Math.round(cpY + this.viewportHeight/2);


    //figure out which tile the center point lies on
    var cTileX = Math.floor(cpX/this.tileWidth)*this.tileWidth;
    var cTileY = Math.floor(cpY/this.tileHeight)*this.tileHeight;


    //figure out how many tiles left and up we need to move to lay out from
    //the top left and have the top/left image off screen (or partially)
    var nTilesLeft = Math.ceil(this.viewportWidth/(2*this.tileWidth))*this.tileWidth;
    var nTilesUp = Math.ceil(this.viewportHeight/(2*this.tileHeight))*this.tileHeight;

    this.nCurrentLeft = cTileX - nTilesLeft;
    this.nCurrentTop = -1*(cTileY + nTilesUp);

    this.xOrigin = this.nCurrentLeft;
    this.yOrigin = this.nCurrentTop;

    this.theInsideLayer.style.left = -1*(vpLeft - this.xOrigin) + "px";
    this.theInsideLayer.style.top = (vpTop + this.yOrigin) + "px";

    var layers = oMap.getLayers();
    for( var k=0; k<layers.length; k++)
    {
        var d = layers[k].domObj;
        for(var j=0; j<this.nHigh; j++)
        {
            for( var i=0; i<this.nWide; i++)
            {
                var img = d.childNodes[(j*this.nWide)+i];
                img.src = this.aPixel.src;
                img.style.top = (this.nCurrentTop + j*this.tileHeight - this.yOrigin) + "px";
                img.style.left = (this.nCurrentLeft + i*this.tileWidth - this.xOrigin) + "px";
                layers[k].setTile(img);
            }
        }
    }
    this.checkWrap( );
    this.updateObjects();
    this.triggerEvent( KAMAP_SCALE_CHANGED, this.getCurrentScale() );
    this.triggerEvent( KAMAP_EXTENTS_CHANGED, this.getGeoExtents() );
}

/**
 * kaMap.zoomToExtents( minx, miny, maxx, maxy )
 *
 * best fit zoom to extents.  Center of extents will be in the center of the
 * view and the extents will be contained within the view at the closest scale
 * available above the scale these extents represent
 *
 * minx, miny, maxx, maxy - extents in units of current projection.
 */
kaMap.prototype.zoomToExtents = function(minx, miny, maxx, maxy)
{

    /* calculate new scale from extents and viewport, then find closest
     * scale and calculate new extents from centerpoint and scale.  Then
     * move theInsideLayer and all the images to show that centerpoint at
     * the center of the view at the given scale
     */
    var inchesPerUnit = new Array(1, 12, 63360.0, 39.3701, 39370.1, 4374754);
    var oMap = this.getCurrentMap();

    //the geographic center - where we want to end up
    var cgX = (maxx+minx)/2;
    var cgY = (maxy+miny)/2;

    var tmpCellSizeX = (maxx - minx)/this.viewportWidth;
    var tmpCellSizeY = (maxy - miny)/this.viewportHeight;
    var tmpCellSize = Math.max( tmpCellSizeX, tmpCellSizeY );

    var tmpScale = tmpCellSize * oMap.resolution * inchesPerUnit[oMap.units];
    var newScale = oMap.aScales[0];
    for (var i=1; i<oMap.aScales.length; i++)
    {
        if (tmpScale >= oMap.aScales[i])
        {
            break;
        }
        newScale = oMap.aScales[i];
    }
    //now newScale has our new scale size
    this.cellSize = newScale/(oMap.resolution * inchesPerUnit[oMap.units]);
    var nFactor = oMap.zoomToScale( newScale );

    var cpX = cgX / this.cellSize;
    var cpY = cgY / this.cellSize;

    var vpLeft = Math.round(cpX - this.viewportWidth/2);
    var vpTop = Math.round(cpY + this.viewportHeight/2);


    //figure out which tile the center point lies on
    var cTileX = Math.floor(cpX/this.tileWidth)*this.tileWidth;
    var cTileY = Math.floor(cpY/this.tileHeight)*this.tileHeight;


    //figure out how many tiles left and up we need to move to lay out from
    //the top left and have the top/left image off screen (or partially)
    var nTilesLeft = Math.ceil(this.viewportWidth/(2*this.tileWidth))*this.tileWidth;
    var nTilesUp = Math.ceil(this.viewportHeight/(2*this.tileHeight))*this.tileHeight;

    this.nCurrentLeft = cTileX - nTilesLeft;
    this.nCurrentTop = -1*(cTileY + nTilesUp);

    this.xOrigin = this.nCurrentLeft;
    this.yOrigin = this.nCurrentTop;

    this.theInsideLayer.style.left = -1*(vpLeft - this.xOrigin) + "px";
    this.theInsideLayer.style.top = (vpTop + this.yOrigin) + "px";

    var layers = oMap.getLayers();
    for( var k=0; k<layers.length; k++)
    {
        var d = layers[k].domObj;
        for(var j=0; j<this.nHigh; j++)
        {
            for( var i=0; i<this.nWide; i++)
            {
                var img = d.childNodes[(j*this.nWide)+i];
                img.src = this.aPixel.src;
                img.style.top = (this.nCurrentTop + j*this.tileHeight - this.yOrigin) + "px";
                img.style.left = (this.nCurrentLeft + i*this.tileWidth - this.xOrigin) + "px";
                layers[k].setTile(img);
            }
        }
    }
    this.checkWrap( );
    this.updateObjects();
    this.triggerEvent( KAMAP_SCALE_CHANGED, this.getCurrentScale() );
    this.triggerEvent( KAMAP_EXTENTS_CHANGED, this.getGeoExtents() );
}

/**
 * kaMap.createDrawingCanvas( idx )
 *
 * create a layer on which objects can be drawn (such as point objects)
 *
 * idx - int, the z-index of the layer.  Should be < 100 but above the map
 * layers.
 */
kaMap.prototype.createDrawingCanvas = function( idx )
{

    var d = document.createElement( 'div' );
    d.style.position = 'absolute';
    d.style.left = '0px';
    d.style.top = '0px';
    d.style.width= '3000px';
    d.style.height = '3000px';
    d.style.zIndex = idx;
    this.theInsideLayer.appendChild( d );
    this.aCanvases.push( d );
    d.kaMap = this;
    return d;
}

kaMap.prototype.removeDrawingCanvas = function( canvas )
{

    for (var i=0; i<this.aCanvases.length;i++)
    {
        if (this.aCanvases[i] == canvas)
        {
            this.aCanvases.splice( i, 1 );
        }
    }
    this.theInsideLayer.removeChild(canvas);
    canvas.kaMap = null;
    return true;
}


/**
 * kaMap.addObjectGeo( canvas, lon, lat, obj )
 *
 * add an object to a drawing layer and position it at the given geographic
 * position.  This is defined as being in the projection of the map.
 *
 * TODO: possibly add ability to call a reprojection service (xhr request?) to
 * convert lon/lat into the current coordinate system if not lon/lat.
 *
 * canvas - object, the drawing canvas to add this object to
 * x - int, the x position in pixels
 * y - int, the y position in pixels
 * obj - object, the object to add (an img, div etc)
 *
 * returns true
 */
kaMap.prototype.addObjectGeo = function( canvas, lon, lat, obj )
{

    obj.lon = lon;
    obj.lat = lat;
    var aPix = this.geoToPix( lon, lat );
    return this.addObjectPix( canvas, aPix[0], aPix[1], obj );
}

kaMap.prototype.addMarkerGeo = function( canvas, lon, lat, obj,dx,dy )
{

    obj.lon = lon;
    obj.lat = lat;
    var aPix = this.geoToPix( lon, lat );
    return this.addObjectPix( canvas, aPix[0]+dx, aPix[1]+dy, obj );
}


/**
 * kaMap.addObjectPix( canvas, x, y, obj )
 *
 * add an object to the map canvas and position it at the given pixel position.
 * The position should not include the xOrigin/yOrigin offsets
 *
 * canvas - object, the canvas to add this object to
 * x - int, the x position in pixels
 * y - int, the y position in pixels
 * obj - object, the object to add (an img, div etc)
 *
 * returns true;
 */
kaMap.prototype.addObjectPix = function( canvas, x, y, obj )
{

    var xOffset = (obj.xOffset) ? obj.xOffset : 0;
    var yOffset = (obj.yOffset) ? obj.yOffset : 0;
    var top = (y - this.yOrigin + yOffset);
    var left = (x - this.xOrigin + xOffset);
    obj.style.position = 'absolute';
    obj.style.top = top + "px";
    obj.style.left = left + "px";
    obj.canvas = canvas;
    canvas.appendChild( obj );
    this.aObjects.push( obj );

    return true;
}

/**
 * kaMap.shiftObject( x, y, obj )
 *
 * move an object by a pixel amount
 *
 * x - int, the number of pixels in the x direction to move the object
 * y - int, the number of pixels in the y direction to move the object
 * obj - object, the object to move
 *
 * returns true
 */
kaMap.prototype.shiftObject = function( x, y, obj )
{

    var top = safeParseInt(obj.style.top);
    var left = safeParseInt(obj.style.left);

    obj.style.top = (top + y) + "px";
    obj.style.left = (left + x) + "px";

    return true;
}

/**
 * kaMap.removeObject( obj )
 *
 * removes an object previously added with one of the addObjectXxx calls
 *
 * obj - object, an object that has been previously added, or null to remove
 *       all objects
 *
 * returns true if the object was removed, false otherwise (i.e. if it was
 * never added).
 */
kaMap.prototype.removeObject = function( obj )
{

    for (var i=0; i<this.aObjects.length; i++)
    {
        if (this.aObjects[i] == obj || obj == null)
        {
            if (!obj)
                obj = this.aObjects[i];
            if (obj.canvas)
            {
                obj.canvas.removeChild( obj );
                obj.canvas = null;
            }
            this.aObjects.splice(i,1);
            return true;
        }
    }
    return false;
}

/**
 * kaMap.centerObject( obj )
 *
 * slides the map to place the object at the center of the map
 *
 * obj - object, an object previously added to the map
 *
 * returns true
 */
kaMap.prototype.centerObject = function(obj)
{

    var vpX = -safeParseInt(this.theInsideLayer.style.left) + this.viewportWidth/2;
    var vpY = -safeParseInt(this.theInsideLayer.style.top) + this.viewportHeight/2;

    var xOffset = (obj.xOffset)?obj.xOffset:0;
    var yOffset = (obj.yOffset)?obj.yOffset:0;

    var dx = safeParseInt(obj.style.left) - xOffset- vpX;
    var dy = safeParseInt(obj.style.top) - yOffset - vpY;

    this.slideBy(-dx, -dy);
    return true;
}

/**
 * kaMap.geoToPix( gX, gY )
 *
 * convert geographic coordinates into pixel coordinates.  Note this does not
 * adjust for the current origin offset that is used to adjust the actual
 * pixel location of the tiles and other images
 *
 * gX - float, the x coordinate in geographic units of the active projection
 * gY - float, the y coordinate in geographic units of the active projection
 *
 * returns an array of pixel coordinates with element 0 being the x and element
 * 1 being the y coordinate.
 */
kaMap.prototype.geoToPix = function( gX, gY )
{

    var pX = gX / this.cellSize;
    var pY = -1 * gY / this.cellSize;
    return [Math.floor(pX), Math.floor(pY)];
}

/**
 * kaMap.pixToGeo( pX, pY [, bAdjust] )
 *
 * convert pixel coordinates into geographic coordinates.  This can optionally
 * adjust for the pixel offset by passing true as the third argument
 *
 * pX - int, the x coordinate in pixel units
 * pY - int, the y coordinate in pixel units
 *
 * returns an array of geographic coordinates with element 0 being the x
 * and element 1 being the y coordinate.
 */
kaMap.prototype.pixToGeo = function( pX, pY )
{

    var bAdjust = (arguments.length == 3 && arguments[2]) ? true : false;

    if (bAdjust)
    {
        pX = pX + this.xOrigin;
        pY = pY + this.yOrigin;
    }
// HERE-OLD:    var gX = -1 * pX * this.cellSize;
// HERE-OLD:   var gY = pY * this.cellSize;
    var gX = pX * this.cellSize;
    var gY = -1 * pY * this.cellSize;
    return [gX, gY];
}

/**
 * kaMap.initialize( [szMap] )
 *
 * main initialization of kaMap.  This must be called after page load and
 * should only be called once (i.e. on page load).  It does not perform
 * intialization synchronously.  This means that the function will return
 * before initialization is complete.  To determine when initialization is
 * complete, the calling application must register for the KAMAP_INITIALIZED
 * event.
 *
 * szMap - string, optional, the name of a map to initialize by default.  If
 *         not set, use the default configuration map file.
 *
 * returns true
 */
kaMap.prototype.initialize = function()
{
	if (this.initializationState == 2)
    {
        this.triggerEvent( KAMAP_ERROR, 'ERROR: ka-Map! is already initialized!' );
        return false;
    }
    else if (this.intializationState == 1)
    {
        this.triggerEvent( KAMAP_WARNING, 'WARNING: ka-Map! is currently initializing ... wait for the KAMAP_INITIALIZED event to be triggered.' );
        return false;
    }
    
    this.initializationState = 1;
    /* call initialization script on the server */
    var szURL = this.server+this.init;
    
    var sep = (this.init.indexOf("?") == -1) ? "?" : "&";
    
    if (arguments.length > 0 && arguments[0] != '')
    {
        szURL = szURL + sep + "map="+ arguments[0];
        sep = "&";
    }
    if (arguments.length > 1 && arguments[1] != '')
    {
        szURL = szURL + sep + "extents="+ arguments[1];
        sep = "&";
    }
    if (arguments.length > 2 && arguments[2] != '')
    {
        szURL = szURL + sep + "centerPoint="+ arguments[2];
        sep = "&";
    }
    call(szURL, this, this.initializeCallback);
    return true;
}

/**
 * hidden function on callback from init.php
 */
kaMap.prototype.initializeCallback = function( szInit )
{

    // szInit contains /**/ if it worked, or some php error otherwise
    if (szInit.substr(0, 1) != "/")
    {
        this.triggerEvent( KAMAP_ERROR, 'ERROR: ka-Map! initialization '+
                          'failed on the server.  Message returned was:\n' +
                          szInit);
        return false;
    }
    this.initializationState = 2;
    eval(szInit);

    //this.xOrigin = this.nCurrentLeft;
    //this.yOrigin = this.nCurrentTop;

    this.triggerEvent( KAMAP_INITIALIZED );
}

/**
 * kaMap.setBackgroundColor( color )
 *
 * call this to set a background color for the inside layer.  This color
 * shows through any transparent areas of the map.  This is primarily
 * intended to be used by the initializeMap callback function to set the
 * background to the background color in the map file.
 *
 * color: string, a valid HTML color string
 *
 * returns true;
 */
kaMap.prototype.setBackgroundColor = function( color )
{

    this.domObj.style.backgroundColor = color;
    return true;
}

/**
 * hidden method of kaMap to initialize all the various layers needed by
 * kaMap to draw and move the map image.
 */
kaMap.prototype.createLayers = function()
{

    this.theInsideLayer = document.createElement('div');
    this.theInsideLayer.id = 'theInsideLayer';
    this.theInsideLayer.style.position = 'absolute';
    this.theInsideLayer.style.left = '0px';
    this.theInsideLayer.style.top = '0px';
    this.theInsideLayer.style.zIndex = '1';
    this.theInsideLayer.kaMap = this;
    if (this.currentTool)
        this.theInsideLayer.style.cursor = this.currentTool.cursor;
    this.domObj.appendChild(this.theInsideLayer);

    this.domObj.kaMap = this;
    this.theInsideLayer.onmousedown = kaMap_onmousedown;
    this.theInsideLayer.onmouseup = kaMap_onmouseup;
    this.theInsideLayer.onmousemove = kaMap_onmousemove;
    this.theInsideLayer.onmouseover = kaMap_onmouseover;
    this.domObj.onmouseout = kaMap_onmouseout;
    this.theInsideLayer.onkeypress = kaMap_onkeypress;
    this.theInsideLayer.ondblclick = kaMap_ondblclick;
    this.theInsideLayer.oncontextmenu = kaMap_oncontextmenu;
    this.theInsideLayer.onmousewheel = kaMap_onmousewheel;
    if (window.addEventListener && navigator.product && navigator.product == "Gecko")
    {
        this.domObj.addEventListener( "DOMMouseScroll", kaMap_onmousewheel, false );
    }
    
    //this is to prevent problems in IE
    this.theInsideLayer.ondragstart = new Function([], 'var e=e?e:event;e.cancelBubble=true;e.returnValue=false;return false;');
}

/**
 * internal function
 * update the layer URLs based on their current positions
 */

kaMap.prototype.initializeLayers = function(nFactor)
{

    var deltaMouseX = this.nCurrentLeft + safeParseInt(this.theInsideLayer.style.left) - this.xOrigin;
    var deltaMouseY = this.nCurrentTop + safeParseInt(this.theInsideLayer.style.top) - this.yOrigin;

    var vpTop = this.nCurrentTop - deltaMouseY;
    var vpLeft = this.nCurrentLeft - deltaMouseX;

    var vpCenterX = vpLeft + this.viewportWidth/2;
    var vpCenterY = vpTop + this.viewportHeight/2;

    var currentTileX = Math.floor(vpCenterX/this.tileWidth)*this.tileWidth;
    var currentTileY = Math.floor(vpCenterY/this.tileHeight)*this.tileHeight;

    var tileDeltaX = currentTileX - this.nCurrentLeft;
    var tileDeltaY = currentTileY - this.nCurrentTop;

    var newVpCenterX = vpCenterX * nFactor;
    var newVpCenterY = vpCenterY * nFactor;

    var newTileX = Math.floor(newVpCenterX/this.tileWidth) * this.tileWidth;
    var newTileY = Math.floor(newVpCenterY/this.tileHeight) * this.tileHeight;

    var newCurrentLeft = newTileX - tileDeltaX;
    var newCurrentTop = newTileY - tileDeltaY;

    this.nCurrentLeft = newCurrentLeft;
    this.nCurrentTop = newCurrentTop;

    var newTilLeft = -newVpCenterX + this.viewportWidth/2;
    var newTilTop = -newVpCenterY + this.viewportHeight/2;

    var xOldOrigin = this.xOrigin;
    var yOldOrigin = this.yOrigin;

    this.xOrigin = this.nCurrentLeft;
    this.yOrigin = this.nCurrentTop;

    this.theInsideLayer.style.left = (newTilLeft + this.xOrigin) + "px";
    this.theInsideLayer.style.top = (newTilTop + this.yOrigin) + "px";

    var layers = this.aMaps[this.currentMap].getLayers();
    for( var k=0; k<layers.length; k++)
    {
        var d = layers[k].domObj;
        for(var j=0; j<this.nHigh; j++)
        {
            for( var i=0; i<this.nWide; i++)
            {
                var img = d.childNodes[(j*this.nWide)+i];
                img.src = this.aPixel.src;
                img.style.top = (this.nCurrentTop + j*this.tileHeight - this.yOrigin) + "px";
                img.style.left = (this.nCurrentLeft + i*this.tileWidth - this.xOrigin) + "px";
                layers[k].setTile(img);
            }
        }
    }

    this.checkWrap();
    this.updateObjects();

}

/* kaMap.updateObjects
 * call this after any major change to the state of kaMap including after
 * a zoomTo, zoomToExtents, etc.
 */
kaMap.prototype.updateObjects = function()
{

    for (var i=0; i<this.aObjects.length;i++ )
    {
        var obj = this.aObjects[i];
        var xOffset = (obj.xOffset) ? obj.xOffset : 0;
        var yOffset = (obj.yOffset) ? obj.yOffset : 0;
        var aPix = this.geoToPix( obj.lon, obj.lat );
        var top = (aPix[1] - this.yOrigin + yOffset);
        var left = (aPix[0] - this.xOrigin + xOffset);
        obj.style.top = top + "px";
        obj.style.left = left + "px";
    }
}

/**
 * kaMap.resize()
 *
 * called when the viewport layer changes size.  It is the responsibility
 * of the user of this API to track changes in viewport size and call this
 * function to update the map
 */

kaMap.prototype.resize = function( )
{

    if (this.initializationState != 2)
    {
        return false;
    }
    var newViewportWidth = this.getObjectWidth(this.domObj);
    var newViewportHeight = this.getObjectHeight(this.domObj);

    if (this.viewportWidth == null)
    {
        this.theInsideLayer.style.top = (-1*this.nCurrentTop + this.yOrigin) + "px";
        this.theInsideLayer.style.left = (-1*this.nCurrentLeft + this.xOrigin) + "px";
        this.viewportWidth = newViewportWidth;
        this.viewportHeight = newViewportHeight;
    }
    var newWide = Math.ceil((newViewportWidth / this.tileWidth) + 2*this.nBuffer);
    var newHigh = Math.ceil((newViewportHeight / this.tileHeight) + 2*this.nBuffer);

    //this.theInsideLayer.style.top = (safeParseInt(this.theInsideLayer.style.top) + (newViewportHeight - this.viewportHeight)/2)+"px";
    //this.theInsideLayer.style.left = (safeParseInt(this.theInsideLayer.style.left) + (newViewportWidth - this.viewportWidth)/2)+"px";

    this.viewportWidth = newViewportWidth;
    this.viewportHeight = newViewportHeight;

    if (this.nHigh == 0 && this.nWide == 0) this.nWide = newWide;

    while (this.nHigh < newHigh)
        this.appendRow();
    while (this.nHigh > newHigh)
        this.removeRow();
    while (this.nWide < newWide)
        this.appendColumn();
    while (this.nWide > newWide)
        this.removeColumn();

    /*
    var layer = this.aMaps[this.currentMap].aLayers[0].domObj;
    var img = layer.childNodes[0].style;
    this.nCurrentTop = safeParseInt(img.top) + this.yOrigin;
    this.nCurrentLeft = safeParseInt(img.left) + this.xOrigin;
    */
    //this.checkWrap();
    this.triggerEvent( KAMAP_EXTENTS_CHANGED, this.getGeoExtents() );
}

/**
 * internal function to create images for map tiles
 *
 * top - integer, the top of this image in pixels
 * left - integer, the left of this image in pixels
 * obj - object, the layer in which this image will reside
 */
kaMap.prototype.createImage = function( top, left, obj )
{

    var img = document.createElement('img');
    img.src=this.aPixel.src;
    img.width=this.tileWidth;
    img.height=this.tileHeight;
    //first for firefox, rest for IE :(
    img.setAttribute('style', 'position:absolute; top:'+top+'px; left:'+left+'px;' );
    img.style.position = 'absolute';
    img.style.top = (top - this.yOrigin)+'px';
    img.style.left = (left - this.xOrigin)+'px';
    img.style.width = this.tileWidth + "px";
    img.style.height = this.tileHeight + "px";
    img.style.visibility = 'hidden';
    img.galleryimg = "no"; //turn off image toolbar in IE
    img.onerror = kaMap_imgOnError;
    img.onload = kaMap_imgOnLoad;
    img.errorCount = 0;
    img.id = "i" + this.gImageID;
    img.layer = obj;
    img.kaMap = this;
    this.gImageID = this.gImageID + 1;
    //only set the source of the image if it is actually visible
    if (obj.visible)
        obj.setTile(img);
    return img;
}

kaMap.prototype.resetTile = function( id, bForce )
{

    var img = this.DHTMLapi.getRawObject(id);
    if (img.layer)
        img.layer.setTile(this, bForce);
}

kaMap.prototype.reloadImage = function(id)
{
}

kaMap.prototype.resetImage = function(id)
{
}

/**
 * internal function to handle images that fail to load
 */
kaMap_imgOnError = function(e)
{

    if (this.layer)
        this.layer.setTile(this, true);
}

/**
 * internal function to track images as they finish loading.
 */
kaMap_imgOnLoad = function(e)
{

    this.style.visibility = 'visible';
}

/**
 * internal function to append a row of images to each of the layers
 *
 * this function is used when the viewport is resized
 */
kaMap.prototype.appendRow = function()
{

    if (this.nWide == 0)
        return;

    var layers = this.aMaps[this.currentMap].getLayers();
    for( var i=0; i<layers.length; i++)
    {
        var obj = layers[i].domObj;
        for (var j=0; j<this.nWide; j++)
        {
            var top = this.nCurrentTop + (this.nHigh * this.tileHeight);
            var left = this.nCurrentLeft + (j * this.tileWidth);
            var img = this.createImage( top, left, layers[i] );
            //hack around IE problem with clipping layers when a filter is
            //active
            if (this.isIE4)
                img.style.filter = "Alpha(opacity="+layers[i].opacity+")";

            obj.appendChild( img );
        }
    }
    this.nHigh = this.nHigh + 1;
}

/**
 * internal function to append a column of images to each of the layers
 *
 * this function is used when the viewport is resized
 */
kaMap.prototype.appendColumn = function()
{

    if (this.nHigh == 0)
        return;

    var layers = this.aMaps[this.currentMap].getLayers();
    for( var i=0; i<layers.length; i++)
    {
        var obj = layers[i].domObj;
        for(var j=this.nHigh-1; j>=0; j--)
        {
            var top = this.nCurrentTop + (j * this.tileHeight);
            var left = this.nCurrentLeft + (this.nWide * this.tileWidth);
            var img = this.createImage( top, left, layers[i] );
            //hack around IE problem with clipping layers when a filter is
            //active
            if (this.isIE4)
                img.style.filter = "Alpha(opacity="+layers[i].opacity+")";
            if (j < this.nHigh-1)
                obj.insertBefore(img, obj.childNodes[((j+1)*this.nWide)]);
            else
                obj.appendChild(img);

        }
    }
    this.nWide = this.nWide + 1;
}

/**
 * internal function to remove a column of images to each of the layers
 *
 * this function is used when the viewport is resized
 */
kaMap.prototype.removeColumn = function()
{

    if (this.nWide < 4)
        return;

    var layers = this.aMaps[this.currentMap].getLayers();
    for( var i=0; i<layers.length; i++)
    {
        var d = layers[i].domObj;
        for(var j=this.nHigh - 1; j >= 0; j--)
        {
            var img = d.childNodes[((j+1)*this.nWide)-1];
            d.removeChild( img );
            //attempt to prevent memory leaks
            img.onload = null;
            img.onerror = null;
        }
    }
    this.nWide = this.nWide - 1;
}

/**
 * internal function to remove a row of images to each of the layers
 *
 * this function is used when the viewport is resized
 */
kaMap.prototype.removeRow = function()
{

    if (this.nHigh < 4)
        return;

    var layers = this.aMaps[this.currentMap].getLayers();
    for( var i=0; i<layers.length; i++)
    {
        var d = layers[i].domObj;
        for(var j=this.nWide - 1; j >= 0; j--)
        {
            var img = d.childNodes[((this.nHigh-1)*this.nWide)+j];
            d.removeChild( img );
            //attempt to prevent memory leaks
            img.onload = null;
            img.onerror = null;
        }
    }
    this.nHigh = this.nHigh - 1;
}

kaMap.prototype.hideLayers = function()
{
	if (!this.hideLayersOnMove) return;
	
    if (this.layersHidden) return;
    var layers = this.aMaps[this.currentMap].getLayers();
    for( var i=0; i<layers.length; i++)
    {
        layers[i]._visible = layers[i].visible;
        if (layers[i].name != '__base__')
        {
            layers[i].setVisibility( false );
        }
    }
    for( var i = 0; i < this.aCanvases.length; i++)
    {
        this.aCanvases[i].style.visibility = 'hidden';
        this.aCanvases[i].style.display = 'none';
    }
    this.layersHidden = true;
}

kaMap.prototype.showLayers = function()
{
	if (!this.hideLayersOnMove) return;
	
    if (!this.layersHidden) return;
    var layers = this.aMaps[this.currentMap].getLayers();
    for( var i=0; i<layers.length; i++)
    {
        layers[i].setVisibility( layers[i]._visible );
    }
    for( var i = 0; i < this.aCanvases.length; i++)
    {
        this.aCanvases[i].style.visibility = 'visible';
        this.aCanvases[i].style.display = 'block';
    }
    this.layersHidden = false;
}

/**
 * move the map by a certain amount
 */
kaMap.prototype.moveBy = function( x, y )
{

    var til = this.theInsideLayer;
    til.style.top = (safeParseInt(til.style.top)+y) + 'px';
    til.style.left = (safeParseInt(til.style.left)+x )+ 'px';
    this.checkWrap();
}

/**
 * slide the map by a certain amount
 */
kaMap.prototype.slideBy = function(x,y)
{

    if (this.slideid!=null) goQueueManager.dequeue( this.slideid );

    this.as = [];

    var absX = Math.abs(x);
    var absY = Math.abs(y);

    var signX = x/absX;
    var signY = y/absY;

    var distance = absX>absY?absX:absY;
    var steps = Math.floor(distance/this.pixelsPerStep);

    var dx = dy = 0;
    if (steps > 0)
    {
        dx = (x)/(steps*this.pixelsPerStep);
        dy = (y)/(steps*this.pixelsPerStep);
    }

    var remainderX = x - dx*steps*this.pixelsPerStep;
    var remainderY = y - dy*steps*this.pixelsPerStep;

    var px=py=0;

    var curspeed=this.accelerationFactor;
    var i=0;
    while(i<steps)
    {
        if (i>0)
        {
          px+=this.as[i-1][0];
          py+=this.as[i-1][1];
        }

        var cx = px+Math.round(dx*this.pixelsPerStep);
        var cy = py+Math.round(dy*this.pixelsPerStep);
        this.as[i]=new Array(cx-px,cy-py);
        i++;
    }
    if (remainderX != 0 || remainderY != 0)
    {
        this.as[i] = [remainderX, remainderY];
    }
    this.hideLayers();
    this.slideid=goQueueManager.enqueue(this.timePerStep,this,this.slide,[0]);

}

/**
 * handle individual movement within a slide
 */
kaMap.prototype.slide = function(pos)
{

    if (pos>=this.as.length){this.as=slideid=null;this.showLayers();this.triggerEvent( KAMAP_EXTENTS_CHANGED, this.getGeoExtents() );this.zoomIn();return;}

    this.moveBy( this.as[pos][0], this.as[pos][1] );

    pos ++;
    this.slideid=goQueueManager.enqueue(this.timePerStep,this,this.slide,[ pos]);
}

/**
 * internal function to handle various events that are passed to the
 * current tool
 */
kaMap_onkeypress = function( e )
{

    if (this.kaMap.currentTool)
        this.kaMap.currentTool.onkeypress( e );
}

kaMap_onmousemove = function( e )
{

    if (this.kaMap.currentTool)
        this.kaMap.currentTool.onmousemove( e );
}

kaMap_onmousedown = function( e )
{

    if (this.kaMap.currentTool)
        this.kaMap.currentTool.onmousedown( e );
}

kaMap_onmouseup = function( e )
{

    if (this.kaMap.currentTool)
        this.kaMap.currentTool.onmouseup( e );
}

kaMap_onmouseover = function( e )
{

    if (this.kaMap.currentTool)
        this.kaMap.currentTool.onmouseover( e );
}

kaMap_onmouseout = function( e )
{

     if (this.kaMap.currentTool)
        this.kaMap.currentTool.onmouseout( e );
}

kaMap_oncontextmenu = function( e )
{

    if (e.preventDefault) e.preventDefault();
    return false;
}

kaMap_ondblclick = function( e )
{

    if (this.kaMap.currentTool)
        this.kaMap.currentTool.ondblclick( e );
}

kaMap_onmousewheel = function( e )
{
    if (this.kaMap.currentTool)
        this.kaMap.currentTool.onmousewheel( e );
}

kaMap.prototype.cancelEvent = function(e)
{

    e = (e)?e:((event)?event:null);
    e.returnValue = false;
    if (e.preventDefault) e.preventDefault();
    return false;
}

kaMap.prototype.registerTool = function( toolObj )
{

    this.aTools.push( toolObj );
}

kaMap.prototype.activateTool = function( toolObj )
{

    if (this.currentTool)
    {
        this.currentTool.deactivate();
    }
    this.currentTool = toolObj;
    if (this.theInsideLayer)
        this.theInsideLayer.style.cursor = this.currentTool.cursor;
}

kaMap.prototype.deactivateTool = function( toolObj )
{

    if (this.currentTool == toolObj)
        this.currentTool = null;
    if (this.theInsideLayer)
        this.theInsideLayer.style.cursor = 'auto';
}

/**
 * internal function to check if images need to be wrapped
 */
kaMap.prototype.checkWrap = function()
{

    this.xOffset = safeParseInt(this.theInsideLayer.style.left) + this.nCurrentLeft - this.xOrigin;
    this.yOffset = safeParseInt(this.theInsideLayer.style.top) + this.nCurrentTop - this.yOrigin;

    while (this.xOffset > 0)
    {
        this.wrapR2L();
    }
    while (this.xOffset < -(this.nBuffer*this.tileWidth))
    {
        this.wrapL2R();
    }
    while (this.yOffset > -(this.nBuffer*this.tileHeight))
    {
        this.wrapB2T();
    }
    while (this.yOffset < -(2*this.nBuffer*this.tileHeight))
    {
        this.wrapT2B();
    }

    var layer = this.aMaps[this.currentMap].aLayers[0].domObj;
    var img = layer.childNodes[0].style;
    this.nCurrentTop = safeParseInt(img.top) + this.yOrigin;
    this.nCurrentLeft = safeParseInt(img.left) + this.xOrigin;
}

/**
 * internal function to reuse extra images
 * take last image from each row and put it at the beginning
 */
kaMap.prototype.wrapR2L = function()
{

    this.xOffset = this.xOffset - (this.nBuffer * this.tileWidth);

    var layers = this.aMaps[this.currentMap].getLayers();
    for( var k=0; k<layers.length; k++)
    {
        var d = layers[k].domObj;
        var refLeft = safeParseInt(d.childNodes[0].style.left);
        for (var j=0; j<this.nHigh; j++)
        {
            var imgLast = d.childNodes[((j+1)*this.nWide)-1];
            var imgNext = d.childNodes[j*this.nWide];

            imgLast.style.left = (refLeft - this.tileWidth) + 'px';
            imgLast.src = this.aPixel.src;
            d.removeChild(imgLast);
            d.insertBefore(imgLast, imgNext);
            if (layers[k].visible)
                layers[k].setTile(imgLast);
        }
    }
}

/**
 * internal function to reuse extra image
 * take first image from each row and put it at the end
 */
kaMap.prototype.wrapL2R = function()
{

    this.xOffset = this.xOffset + (this.nBuffer*this.tileWidth);
    var layers = this.aMaps[this.currentMap].getLayers();
    for( var k=0; k<layers.length; k++)
    {
        var d = layers[k].domObj;
        var refLeft = safeParseInt(d.childNodes[this.nWide-1].style.left);
        for (var j=0; j<this.nHigh; j++)
        {
            var imgFirst = d.childNodes[j*this.nWide];
            var imgNext;
            /* need to use insertBefore to get a node at the end of a 'row'
             * but this doesn't work for the very last row :(*/
            if (j < this.nHigh-1)
                imgNext = d.childNodes[((j+1)*this.nWide)];
            else
                imgNext = null;

            imgFirst.style.left = (refLeft + this.tileWidth) + 'px';
            imgFirst.src = this.aPixel.src;

            d.removeChild(imgFirst);
            if (imgNext)
                d.insertBefore(imgFirst, imgNext);
            else
                d.appendChild(imgFirst);
            if (layers[k].visible)
                layers[k].setTile(imgFirst);
        }
    }
}

/**
 * internal function to reuse extra images
 * take top image from each column and put it at the bottom
 */
kaMap.prototype.wrapT2B = function()
{

    this.yOffset = this.yOffset + (this.nBuffer*this.tileHeight);
    var layers = this.aMaps[this.currentMap].getLayers();
    for( var k=0; k<layers.length; k++)
    {
        var d = layers[k].domObj;
        var refTop = safeParseInt(d.childNodes[(this.nHigh*this.nWide)-1].style.top);
        for (var i=0; i<this.nWide; i++)
        {
            var imgBottom = d.childNodes[0];

            imgBottom.style.top = (refTop + this.tileHeight) + 'px';
            imgBottom.src = this.aPixel.src;

            d.removeChild(imgBottom);
            d.appendChild(imgBottom);
            if (layers[k].visible)
                layers[k].setTile(imgBottom);

        }
    }
}

/**
 * internal function to reuse extra images
 * take bottom image from each column and put it at the top
 */
kaMap.prototype.wrapB2T = function()
{

    this.yOffset = this.yOffset - (this.nBuffer*this.tileHeight);
    var layers = this.aMaps[this.currentMap].getLayers();
    for( var k=0; k<layers.length; k++)
    {
        var d = layers[k].domObj;
        var refTop = safeParseInt(d.childNodes[0].style.top);
        for (var i=0; i<this.nWide; i++)
        {
            var imgTop = d.childNodes[(this.nHigh*this.nWide)-1];

            imgTop.style.top = (refTop - this.tileHeight) + 'px';
            imgTop.src = this.aPixel.src;

            d.removeChild(imgTop);
            d.insertBefore(imgTop, d.childNodes[0]);
            if (layers[k].visible)
                layers[k].setTile(imgTop);

        }
    }
}

/**
 * kaMap.addMap( oMap )
 *
 * add a new instance of _map to kaMap.  _map is an internal class that
 * represents a map file from the configuration file.  This function is
 * intended for internal use by the init.php script.
 *
 * oMap - object, an instance of _map
 */
kaMap.prototype.addMap = function( oMap )
{

    oMap.kaMap = this;
    this.aMaps[oMap.name] = oMap;
}

/**
 * kaMap.getMaps()
 *
 * return an array of all the _map objects that kaMap knows about.  These can
 * be used to generate controls to switch between maps and to get information
 * about the layers (groups) and scales available in a given map.
 */
kaMap.prototype.getMaps = function()
{

    return this.aMaps;
}

/**
 * kaMap.getCurrentMap()
 *
 * returns the currently selected _map object.  This can be used to get
 * information about the layers (groups) and scales available in the current
 * map.
 */
kaMap.prototype.getCurrentMap = function()
{

    return this.aMaps[this.currentMap];
}

/**
 * kaMap.selectMap( name )
 *
 * select one of the maps that kaMap knows about and re-initialize kaMap with
 * this new map.  This function returns true if name is valid and false if the
 * map is invalid.  Note that a return of true does not imply that the map is
 * fully active.  You must register for the KAMAP_MAP_INITIALIZED event since
 * the map initialization happens asynchronously.
 *
 * name - string, the name of the map to select
 */
kaMap.prototype.selectMap = function( name )
{

    if (!this.aMaps[name])
    {
        return false;
    }
    else
    {
        this.currentMap = name;

        var oMap = this.getCurrentMap();
        this.setBackgroundColor(oMap.backgroundColor);
        //remove existing layers first
        for(var i = this.theInsideLayer.childNodes.length - 1; i>=0; i-- )
        {
            if (this.theInsideLayer.childNodes[i].className == 'mapLayer')
            {
                this.theInsideLayer.removeChild(this.theInsideLayer.childNodes[i]);
            }
        }

        //now create new layers
        var layers = this.aMaps[this.currentMap].getLayers();
        var j = 2;

    	for( var i=0; i<layers.length; i++)
        {
            var d = this.createMapLayer( layers[i].name );
            this.theInsideLayer.appendChild( d );
            
            layers[i].domObj = d;
            layers[i].setOpacity( layers[i].opacity );
            layers[i].setZIndex( layers[i].zIndex );
            layers[i].setVisibility( layers[i].visible );
        }

        //force new images to be created
        this.nWide = 0;
        this.nHigh = 0;
        this.resize();

        if (oMap.aZoomTo.length != 0)
        {
            this.zoomTo(oMap.aZoomTo[0], oMap.aZoomTo[1], oMap.aZoomTo[2]);
            oMap.aZoomTo.length = 0;
        }
        else
        {
            this.zoomToExtents( oMap.currentExtents[0], oMap.currentExtents[1],
                               oMap.currentExtents[2], oMap.currentExtents[3] );
        }
        this.triggerEvent( KAMAP_MAP_INITIALIZED, this.currentMap );
        return true;
    }
}

kaMap.prototype.createMapLayer = function( id )
{

    var d = document.createElement( 'div' );
    d.id = id;
    d.className = 'mapLayer';
    d.style.position = 'absolute';
    d.style.visibility = 'visible';
    d.style.left = '0px';
    d.style.top = '0px';
    d.style.width= '3000px';
    d.style.height = '3000px';
    return d;
}

kaMap.prototype.addMapLayer = function( l )
{
    var map = this.getCurrentMap()
    map.addLayer ( l );
    
    var d = this.createMapLayer( l.name );
    this.theInsideLayer.appendChild( d );
    
    l.domObj = d;
    l.setOpacity( l.opacity );
    l.setVisibility( l.visible );
    l.setZIndex( l.zIndex );
    
    //create images for this layer
    for (var j=0; j<this.nWide; j++)
    {
    	for (var i=0; i<this.nHigh; i++)
        {
            var top = this.nCurrentTop + (i * this.tileHeight);
            var left = this.nCurrentLeft + (j * this.tileWidth);
            var img = this.createImage( top, left, l );
            //hack around IE problem with clipping layers when a filter is
            //active
            if (this.isIE4)
                img.style.filter = "Alpha(opacity="+l.opacity+")";

            l.domObj.appendChild( img );
        }
    }
    
	this.triggerEvent( KAMAP_LAYERS_CHANGED, this.currentMap );
    
}

kaMap.prototype.getCenter = function()
{

    var deltaMouseX = this.nCurrentLeft - this.xOrigin + safeParseInt(this.theInsideLayer.style.left);
    var deltaMouseY = this.nCurrentTop - this.yOrigin +  safeParseInt(this.theInsideLayer.style.top);

    var vpTop = this.nCurrentTop - deltaMouseY;
    var vpLeft = this.nCurrentLeft - deltaMouseX;

    var vpCenterX = vpLeft + this.viewportWidth/2;
    var vpCenterY = vpTop + this.viewportHeight/2;

    return new Array( vpCenterX, vpCenterY );
}

/**
 * kaMap.getGeoExtents()
 *
 * returns an array of geographic extents for the current view in the form
 * (inx, miny, maxx, maxy)
 */
kaMap.prototype.getGeoExtents = function()
{

    var minx = -1*(safeParseInt(this.theInsideLayer.style.left) - this.xOrigin) * this.cellSize;
    var maxx = minx + this.viewportWidth * this.cellSize;
    var maxy= (safeParseInt(this.theInsideLayer.style.top) - this.yOrigin) * this.cellSize;
    var miny= maxy - this.viewportHeight * this.cellSize;
    return [minx,miny,maxx,maxy];

}

kaMap.prototype.zoomIn = function()
{

    this.zoomByFactor(this.aMaps[this.currentMap].zoomIn());
}

kaMap.prototype.zoomOut = function()
{

    this.zoomByFactor(this.aMaps[this.currentMap].zoomOut());
}

kaMap.prototype.zoomToScale = function( scale )
{

    this.zoomByFactor(this.aMaps[this.currentMap].zoomToScale(scale));
}

kaMap.prototype.zoomByFactor = function( nZoomFactor )
{

    if (nZoomFactor == 1)
    {
        this.triggerEvent( KAMAP_NOTICE, "NOTICE: changing to current scale aborted");
        return;
    }

    this.cellSize = this.cellSize/nZoomFactor;
    this.initializeLayers(nZoomFactor);

    this.triggerEvent( KAMAP_SCALE_CHANGED, this.getCurrentScale() );
    this.triggerEvent( KAMAP_EXTENTS_CHANGED, this.getGeoExtents() );
}

kaMap.prototype.getCurrentScale = function()
{

    return this.aMaps[this.currentMap].aScales[this.aMaps[this.currentMap].currentScale];
}

kaMap.prototype.setLayerQueryable = function( name, bQueryable )
{
    this.aMaps[this.currentMap].setLayerQueryable( name, bQueryable );
}

kaMap.prototype.setLayerVisibility = function( name, bVisible )
{

    this.aMaps[this.currentMap].setLayerVisibility( name, bVisible );
}

kaMap.prototype.setLayerOpacity = function( name, opacity )
{

    this.aMaps[this.currentMap].setLayerOpacity( name, opacity );
}

kaMap.prototype.registerEventID = function( eventID )
{

    return this.eventManager.registerEventID(eventID);
}

kaMap.prototype.registerForEvent = function( eventID, obj, func )
{

    return this.eventManager.registerForEvent(eventID, obj, func);
}

kaMap.prototype.deregisterForEvent = function( eventID, obj, func )
{

    return this.eventManager.deregisterForEvent(eventID, obj, func);
}

kaMap.prototype.triggerEvent = function( eventID /*pass additional arguments*/ )
{

    return this.eventManager.triggerEvent.apply( this.eventManager, arguments );
}


/**
 * special helper function to parse an integer value safely in case
 * it is represented in IEEE format (scientific notation).
 */
function safeParseInt( val )
{

    return Math.round(parseFloat(val));
}

/******************************************************************************
 * _map
 *
 * internal class used to store map objects coming from the init script
 *
 * szName - string, the layer name (or group name, in this case ;))
 *
 * szTitle - string, the human-readable title of the map
 *
 * nCurrentScale - integer, the current scale as an index into aszScales;
 *
 * aszScales - array, an array of scale values for zooming.  The first scale is
 *             assumed to be the default scale of the map
 *
 * aszLayers - array, an array of layer names and statuses.  The array is indexed by
 *             the layer name and the value is true or false for the status.
 *
 *****************************************************************************/
function _map(szName,szTitle,nCurrentScale, units, aszScales )
{

    this.name = szName;
    this.title = szTitle;
    this.aScales = aszScales;
    this.currentScale = parseFloat(nCurrentScale);
    this.units = units;
    this.resolution = 72; //used in scale calculations
    this.aLayers = [];
    this.defaultExtents = [];
    this.currentExtents = [];
    this.maxExtents = [];
    this.backgroundColor = '#ffffff';
    this.version = "0"; //to be used for versioning the map file ...
    
    this.aZoomTo = [];

    this.kaMap = null;
}

_map.prototype.addLayer = function( layer )
{
    layer._map = this;
    layer.zIndex = this.aLayers.length;
    this.aLayers.push( layer );
}

_map.prototype.getQueryableLayers = function()
{
	var r = [];
	for( var i=0; i<this.aLayers.length; i++)
	{
		if (this.aLayers[i].isQueryable())
			r.push(this.aLayers[i]);
	}
	return r;
}

_map.prototype.getLayers = function()
{

    return this.aLayers;
}

_map.prototype.getLayer = function( name )
{

    for (var i=0; i<this.aLayers.length; i++)
    {
        if (this.aLayers[i].name == name)
        {
            return this.aLayers[i];
        }
    }
}

_map.prototype.getScales = function()
{

    return this.aScales;
}


_map.prototype.zoomIn = function()
{

    var nZoomFactor = 1;
    if (this.currentScale < this.aScales.length - 1)
    {
        nZoomFactor = this.aScales[this.currentScale]/this.aScales[this.currentScale+1];
        this.currentScale = this.currentScale + 1;
    }
    return nZoomFactor;
}

_map.prototype.zoomOut = function()
{

    var nZoomFactor = 1;
    if (this.currentScale > 0)
    {
        nZoomFactor = this.aScales[this.currentScale]/this.aScales[this.currentScale-1];
        this.currentScale = this.currentScale - 1;
    }
    return nZoomFactor;
}

_map.prototype.zoomToScale = function( scale )
{

    var nZoomFactor = 1;
    for (var i=0; i<this.aScales.length; i++)
    {
        if (this.aScales[i] == scale)
        {
            nZoomFactor = this.aScales[this.currentScale]/scale;
            this.currentScale = parseInt(i);
        }
    }
    return nZoomFactor;
}

_map.prototype.setLayerQueryable = function( name, bQueryable )
{
    var layer = this.getLayer( name );
    layer.setQueryable( bQueryable );
}

_map.prototype.setLayerVisibility = function( name, bVisible )
{

    var layer = this.getLayer( name );
    layer.setVisibility( bVisible );
}

_map.prototype.setLayerOpacity = function( name, opacity )
{

    var layer = this.getLayer( name );
    layer.setOpacity( opacity );
}

_map.prototype.setDefaultExtents = function( minx, miny, maxx, maxy )
{

    this.defaultExtents = [minx, miny, maxx, maxy];
    if (this.currentExtents.length == 0)
        this.setCurrentExtents( minx, miny, maxx, maxy );
}

_map.prototype.setCurrentExtents = function( minx, miny, maxx, maxy )
{

    this.currentExtents = [minx, miny, maxx, maxy];
}

_map.prototype.setMaxExtents = function( minx, miny, maxx, maxy )
{

    this.maxExtents = [minx, miny, maxx, maxy];
}

_map.prototype.setBackgroundColor = function( szBgColor )
{

    this.backgroundColor = szBgColor;
}

/******************************************************************************
 * _layer
 *
 * internal class used to store map layers within a map.  Map layers track
 * visibility of the layer in the user interface.
 *
 * szName - string, the name of the layer
 * bVisible - boolean, the current state of the layer (true is visible)
 * opacity - integer, between 0 (transparent) and 100 (opaque), controls opacity
 *           of the layer as a whole
 * imageformat - string, the format to request the tiles in for this layer.  Can
 *               be used to optimize file sizes for different layer types 
 *               by using GIF for images with fewer colours and JPEG or PNG24
 *               for high-colour layers (such as raster imagery).
 *
 * bQueryable - boolean, is the layer queryable?  This is different from the
 *              layer being included in queries.  bQueryable marks a layer as
 *              being capable of being queried.  The layer also has to have
 *              it's query state turned on using setQueryable
 *
 *****************************************************************************/
function _layer( szName, bVisible, opacity, imageformat, bQueryable )
{

    this.name = szName;
    this.visible = bVisible;
    this.opacity = opacity;
    this.domObj = null;
    this._map = null;
    this.imageformat = imageformat;
    this.queryable = bQueryable;
    this.queryState = bQueryable;
}

_layer.prototype.isQueryable = function()
{
    return this.queryState;
}

_layer.prototype.setQueryable = function( bQueryable )
{
	if (this.queryable)
		this.queryState = bQueryable;
}
    
/**
 * layer.setOpacity( amount )
 *
 * set a layer to be semi transparent.  Amount is a number between
 * 0 and 100 where 0 is fully transparent and 100 is fully opaque
 */
_layer.prototype.setOpacity = function( amount )
{
	this.opacity = amount;
	if (this.domObj)
	{
		this.domObj.style.opacity = amount/100;
		this.domObj.style.mozOpacity = amount/100;
		//Nasty IE effect (or bug?) when you apply a filter
		//to a layer, it clips the layer and we rely on the
		//contents being visible outside the layer bounds
		//for 'railroading' the tiles
		if (this.isIE4)
		{
			for(var i=0;i<this.domObj.childNodes.length;i++)
			{
				this.domObj.childNodes[i].style.filter = "Alpha(opacity="+amount+")";
			}
		}
	}
}

_layer.prototype.setTile = function(img)
{

	var szForce = '';
	var szLayers = '';
	if (arguments[1])
		szForce = '&force=true';
	var szGroup = "&g="+img.layer.domObj.id;
	var szScale = '&s='+this._map.aScales[this._map.currentScale];
	
	// dynamic imageformat
	var szImageformat = '';
	var image_format = '';
	if (img.layer.imageformat && img.layer.imageformat != '')
	{
		image_format = img.layer.imageformat;
		szImageformat = '&i='+image_format;
	}
	
	var l = safeParseInt(img.style.left) + this._map.kaMap.xOrigin;
	var t = safeParseInt(img.style.top) + this._map.kaMap.yOrigin;
	var src = this._map.kaMap.server+
			  this._map.kaMap.tileURL+'/s.'+ this._map.aScales[this._map.currentScale] + '.t.' + t + '.l.' + l + '.png';
				//'?map='+this._map.name+ '&t='+t+ '&l='+l+ szScale+szForce+szGroup+szImageformat

	 if ((this.isIE4) && (image_format.toLowerCase() == "png24"))
	 {
		 //apply png24 hack for IE
		 img.style.visibility = 'hidden';
		 img.src = this._map.kaMap.aPixel.src;
		 img.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+src+"', sizingMethod='scale')";
	 }
	 else
	 {
		 if (img.src != src)
		 {
			 img.style.visibility = 'hidden';
			 img.src = this._map.kaMap.server+
			      this._map.kaMap.tileURL+'/s.'+ this._map.aScales[this._map.currentScale] + '.t.' + t + '.l.' + l + '.png';
				   //this._map.kaMap.tileURL+'?map='+this._map.name+'&t='+t+'&l='+l+szScale+szForce+szGroup+szImageformat
		 }
	 }
}

_layer.prototype.setVisibility = function( bVisible )
{

	this.visible = bVisible;
	if (this.domObj)
	{
		this.domObj.style.visibility = bVisible?'visible':'hidden';
		//horrid hack - this is needed in case any element contained
		//within the div has its visibility set ... it overrides the
		//style of the container!!!
		this.domObj.style.display = bVisible?'block':'none';
	}
	for( var i=0; i<this.domObj.childNodes.length; i++)
	{
		this.setTile(this.domObj.childNodes[i]);
	}
}

_layer.prototype.setZIndex = function( zIndex )
{
	this.zIndex = zIndex;
	if (this.domObj)
	{
		this.domObj.style.zIndex = zIndex;
	}
}

/******************************************************************************
 * Event Manager class
 *
 * an internal class for managing generic events.  kaMap! uses the event
 * manager internally and exposes certain events to the application.
 *
 * the kaMap class provides wrapper functions that hide this implementation
 * useage:
 *
 * myKaMap.registerForEvent( gnSomeEventID, myObject, myFunction );
 * myKaMap.registerForEvent( 'SOME_EVENT', myObject, myFunction );
 *
 * myKaMap.deregisterForEvent( gnSomeEventID, myObject, myFunction );
 * myKaMap.deregisterForEvent( 'SOME_EVENT', myObject, myFunction );
 *
 * myObject is normally null but can be a javascript object to have myFunction
 * executed within the context of an object (becomes 'this' in the function).
 *
 *****************************************************************************/
function _eventManager( )
{
    this.events = [];
    this.lastEventID = 0;
}

_eventManager.prototype.registerEventID = function( eventID )
{

    var ev = new String(eventID);
    if (!this.events[eventID])
    {
        this.events[eventID] = [];
    }
}

_eventManager.prototype.registerForEvent = function(eventID, obj, func)
{

    var ev = new String(eventID);
    this.events[eventID].push( [obj, func] );
}

_eventManager.prototype.deregisterForEvent = function( eventID, obj, func )
{

    var ev = new String(eventID);
    var bResult = false;
    if (!this.events[eventID]) return false;

    for (var i=0;i<this.events[eventID].length;i++)
    {
        if (this.events[eventID][i][0] == obj &&
            this.events[eventID][i][1] == func)
        {
            this.events[eventID].splice(i,1);
            bResult = true;
        }
    }
    return bResult;
}

_eventManager.prototype.triggerEvent = function( eventID )
{

   var ev = new String(eventID);
   if (!this.events[eventID]) return false;

    var args = new Array();
    for(i=1; i<arguments.length; i++)
    {
        args[args.length] = arguments[i];
    }

    for (var i=0; i<this.events[eventID].length; i++)
    {
        this.events[eventID][i][1].apply( this.events[eventID][i][0],
                                          arguments );
    }
    return true;
}

/******************************************************************************
 * Queue Manager class
 *
 * an internal class for managing delayed execution of code.  This uses the
 * window.setTimeout interface but adds support for execution of functions
 * on objects
 *
 * The problem with setTimeout is that you need a reference to a global object
 * to do something useful in an object-oriented environment, and we don't
 * really have that here.  So the Queue Manager handles a stack of pending
 * delayed execution code and evaluates it when it comes due.  It can be
 * used exactly like window.setTimeout in that it returns an id that can
 * subsequently be used to clear the delayed code.
 *
 * To add something to the queue, call
 * var id = goQueueManager.enqueue( timeout, obj, func, args );
 *
 * timeout - time to delay (milliseconds)
 * obj - the object to execute the function within.  Can be null for global
 *       scope
 * func - the function to execute.  Note this is the function, not a string
 *        containing the function.
 * args - an array of values to be passed to the function.
 *
 * To remove a function from the queue, call goQueueManager.dequeue( id );
 *****************************************************************************/
var goQueueManager = new _queueManager();

function _queueManager()
{
    this.queue = new Array();
}

_queueManager.prototype.enqueue = function( timeout, obj, func, args )
{

    var pos = this.queue.length;
    for (var i=0; i< this.queue.length; i++)
    {
        if (this.queue[i] == null)
        {
            pos = i;
            break;
        }
    }
    var id = window.setTimeout( "_queueManager_execute("+pos+")", timeout );
    this.queue[pos] = new Array( id, obj, func, args );
    return pos;
}

_queueManager.prototype.dequeue = function( pos )
{

    if (this.queue[pos] != null)
    {
        window.clearTimeout( this.queue[pos][0] );
        this.queue[pos] = null;
    }
}

function _queueManager_execute( pos )
{

    if (goQueueManager.queue[pos] != null)
    {
        var obj = goQueueManager.queue[pos][1];
        var func = goQueueManager.queue[pos][2];
        if (goQueueManager.queue[pos][3] != null)
            func.apply( obj, goQueueManager.queue[pos][3] );
        else
            func.apply( obj );
        goQueueManager.queue[pos] = null;
    }
}
/******************************************************************************
 * kaKeymap - a simple query tool class
 *
 * copyright DM Solutions Group Inc.
 *
 * $Id: kaKeymap.js,v 1.12 2005/11/04 15:23:14 pspencer Exp $
 *
 ******************************************************************************
 *
 * kaKeymap provides an overview or reference for navigational aid to the user.
 * It works by displaying an image and overlaying a rectangular box that
 * indicates the current extents of the main kaMap view.  To accomplish this,
 * the image is associated with a set of geographic extents that it represents.
 * A keymap image is normally a small image that is representative of the full
 * area of the application's data, but with reduced detail (typically just
 * polygons and lines for countries and political boundaries).
 *
 * The default mode of operation uses MapServer only to get the reference
 * object image and extents from the map file.  Tracking of extents is done
 * purely on the client side.
 *
 * The original kaKeymap code was written by DM Solutions Group.  Lorenzo
 * Becchi contributed the code to make the keymap clickable and draggable.
 * 
 *****************************************************************************/

/******************************************************************************
 * kaKeymap
 *
 * class to handle the keymap
 *
 * oKaMap - the ka-Map instance to draw the keymap for
 * szID - string, the id of a div that will contain the keymap
 *
 *****************************************************************************/
function kaKeymap(oKaMap, szID )
{
    this.kaMap = oKaMap;
    this.domObj = this.kaMap.getRawObject(szID);
    this.domObj.kaKeymap=this;
    this.width=getObjectWidth(szID)+"px";
    this.height=getObjectHeight(szID)+"px";
    this.pxExtent =null;
    this.domExtents = null;
    this.domEvent = null;
    this.aExtents = null;
    this.domImg = null;
    this.imgSrc = null;
    this.imgWidth = null;
    this.imgHeight = null;

    this.cellWidth = null;
    this.cellHeight = null;
    this.initialExtents = null;

    this.domObj.ondblclick= this.onclick;

    if ( this.domObj.captureEvents){
        this.domObj.captureEvents(Event.DBLCLICK);
}
    this.kaMap.registerForEvent( KAMAP_EXTENTS_CHANGED, this, this.update );
    this.kaMap.registerForEvent( KAMAP_MAP_INITIALIZED, this, this.initialize );
}

kaKeymap.prototype.initialize = function(id)
{
 
    this.pxExtent =null;
    this.initialExtents=this.kaMap.getGeoExtents();
    call(this.kaMap.server+'/keymap.php?map='+this.kaMap.currentMap,this,this.draw);
}

kaKeymap.prototype.draw = function( szResult )
{
    eval( szResult );

    this.cellWidth = (this.aExtents[2] - this.aExtents[0]) / this.imgWidth;
    this.cellHeight = (this.aExtents[3] - this.aExtents[1]) / this.imgHeight;
    //clear old keymap
    for(var i = this.domObj.childNodes.length - 1; i >= 0; i--)
    this.domObj.removeChild (this.domObj.childNodes[i]);
    
    //create an image to hold the keymap
    this.domImg = document.createElement( 'img' );
    this.domImg.src = this.imgSrc;
    this.domImg.width = this.imgWidth;
    this.domImg.height = this.imgHeight;
    this.domObj.appendChild( this.domImg );
    //create a div to track the current extents
    this.domExtents = document.createElement( 'div' );

    this.domExtents.id="keymapDomExtents";
    this.domExtents.style.position = 'absolute';
    this.domExtents.style.border = '1px solid red';
    this.domExtents.style.top = "1px";
    this.domExtents.style.left = "1px";
    this.domExtents.style.width = "1px";
    this.domExtents.style.height = "1px";
    this.domExtents.style.backgroundColor = 'transparent';
    this.domExtents.style.visibility = 'hidden';
    this.domObj.appendChild(this.domExtents);

    //create a div to allow click/drag of extents for nav
    this.domEvent = document.createElement( 'div' );
    this.domEvent.kaKeymap=this;

    this.domEvent.onmousedown= this.mousedown;
    this.domEvent.onmouseup= this.mouseup;
    this.domEvent.onmousemove= this.mousemove;
    this.domEvent.onmouseout= this.mouseup;
    if (this.domEvent.captureEvents)
    {
       this.domEvent.captureEvents(Event.MOUSEDOWN);
       this.domEvent.captureEvents(Event.MOUSEUP);
       this.domEvent.captureEvents(Event.MOUSEMOVE);
       this.domEvent.captureEvents(Event.MOUSEOUT);
    }

    this.domEvent.style.position = 'absolute';
    this.domEvent.id = 'keymapDomEvent';
    this.domEvent.style.border = '1px solid red';
    this.domEvent.style.top = "0px";
    this.domEvent.style.left = "0px";
    this.domEvent.style.width = "1px"
    this.domEvent.style.height = "1px"
    this.domEvent.style.backgroundColor = 'white';
    this.domEvent.style.visibility = 'visible';
    this.domEvent.style.opacity=0.01;
    this.domEvent.style.mozOpacity=0.01;
    this.domEvent.style.filter = "Alpha(opacity=1)";
    //this.domEvent.style.zIndex = 100;
    this.domObj.appendChild(this.domEvent);

    //changed use an image insetd divs to drow the cross air
    var d = document.createElement( 'div' );
    d.id="keymapCrossImage"
    d.src = this.kaMap.server+"images/Cross.gif";
    d.style.position='absolute';
    d.style.width = "11px";
    d.style.height = "11px";
    d.style.visibility = 'hidden';	
    this.domExtents.appendChild(d);

    if (this.initialExtents != null)
    {
        this.update( null, this.initialExtents);
    }
}

kaKeymap.prototype.update = function( eventID, extents )
{
    if (!this.aExtents || !this.domExtents)
    {
        this.initialExtents = extents;
        return;
    }

 if(this.pxExtent)
  { /*evaluate if div position is different from map position*/
	mgcX=(((extents[2]-extents[0])/2)+extents[0]);
	mgcY=(((extents[3]-extents[1])/2)+extents[1]);
	kgc=this.geoCentCoord();
	if((mgcX-kgc[0])== 0 && (mgcY-kgc[1])==0) return;

 }

    var left = (extents[0] - this.aExtents[0]) / this.cellWidth;
    var width = (extents[2] - extents[0]) / this.cellWidth;
    var top = -1 * (extents[3] - this.aExtents[3]) / this.cellHeight;
    var height = (extents[3] - extents[1]) / this.cellHeight;

    this.pxExtent = new Array(left,top,width,height);
    this.domExtents.style.top = parseInt(top+0.5)+"px";
    this.domExtents.style.left = parseInt(left+0.5)+"px";
    this.domEvent.style.top = parseInt(top+0.5)+"px";
    this.domEvent.style.left = parseInt(left+0.5)+"px";

    if (parseInt(width+0.5) < parseInt(this.domExtents.childNodes[0].style.width) ||
        parseInt(height+0.5) < parseInt(this.domExtents.childNodes[0].style.height) )
    {
        d = this.domExtents.childNodes[0];
        this.domExtents.style.width = d.style.width;
        this.domExtents.style.height = d.style.height;
        this.domEvent.style.width = d.style.width;
        this.domEvent.style.height = d.style.height; 
	this.domExtents.style.border = 'none';
	this.domEvent.style.border = 'none';
	this.domExtents.childNodes[0].style.visibility = 'visible';
    }
    else
    {
    this.domExtents.style.width = parseInt(width+0.5) + "px";
    this.domExtents.style.height = parseInt(height+0.5) + "px";
    this.domEvent.style.width = parseInt(width+0.5) + "px";
    this.domEvent.style.height = parseInt(height+0.5) + "px";
     this.domExtents.style.border = '1px solid red';
     this.domEvent.style.border = '1px solid red';
    this.domEvent.style.visibility = 'visible';
    this.domExtents.style.visibility = 'visible';
    this.domExtents.childNodes[0].style.visibility = 'hidden';
     }
}
/*click event on div kaKeymap*/
kaKeymap.prototype.onclick = function(e)
{
    e = (e)?e:((event)?event:null); 
    this.kaKeymap.centerMap(e);
}
/*call aPixPos to calculate geografic position of click and recenter kamap map*/
kaKeymap.prototype.centerMap = function(e)
{
    var pos= this.aPixPos( e.clientX, e.clientY );
    this.kaMap.zoomTo(pos[0],pos[1]);
}
/**
 * kaKeymap_aPixPos( x, y )
 *
 * try to calculate geoposition in kaKeymap
 *
 * x - int, the x page coord
 * y - int, the y page coord
 *
 * returns an array with geo positions
 */
kaKeymap.prototype.aPixPos = function( x, y )
{
    var obj = this.domObj.offsetParent;
    var offsetLeft = 0;
    var offsetTop = 0;
    while (obj)
    {
        offsetLeft += parseFloat(obj.offsetLeft);
        offsetTop += parseFloat(obj.offsetTop);
        obj = obj.offsetParent;
    }
    var pX = x  - offsetLeft  ;
    var pY = y  -  offsetTop  ;
     pX = parseFloat(this.aExtents[0] + (this.cellWidth *pX)+0.5); 
     pY = parseFloat(this.aExtents[3] - (this.cellHeight *pY)+0.5);
    return [pX,pY];

}

kaKeymap.prototype.mousedown = function(e)
{

     e = (e)?e:((event)?event:null); 
     this.kaKeymap.domEvent.style.top= "0px";
     this.kaKeymap.domEvent.style.left= "0px";
     this.kaKeymap.domEvent.style.width = this.kaKeymap.width;
     this.kaKeymap.domEvent.style.height = this.kaKeymap.height;

    this.kaKeymap.domExtents.init=1;
    this.kaKeymap.domExtents.oX=e.clientX;
    this.kaKeymap.domExtents.oY=e.clientY;
    var amount= 50;
    this.kaKeymap.domExtents.style.backgroundColor = 'pink';
    this.kaKeymap.domExtents.style.opacity=amount/100;

//     this.kaKeymap.domObj.style.mozOpacity = amount/100;
    //Nasty IE effect (or bug?) when you apply a filter
    //to a layer, it clips the layer and we rely on the
    //contents being visible outside the layer bounds
    //for 'railroading' the tiles
    if (this.kaKeymap.kaMap.isIE4)
        this.kaKeymap.domExtents.style.filter = "Alpha(opacity="+amount+")";
}
kaKeymap.prototype.mouseup = function(e)
{

    if(this.kaKeymap.domExtents.init)
    {
        e = (e)?e:((event)?event:null); 
        this.kaKeymap.domExtents.style.backgroundColor = 'transparent';
        this.kaKeymap.domExtents.style.opacity=1;
        if (this.kaKeymap.kaMap.isIE4) 
            this.kaKeymap.domExtents.style.filter = "Alpha(opacity=100)";
        this.kaKeymap.domExtents.init=0;

        cG=this.kaKeymap.geoCentCoord();
        this.kaKeymap.kaMap.zoomTo(cG[0],cG[1]);
    }
}

kaKeymap.prototype.mousemove = function(e)
{
    e = (e)?e:((event)?event:null); 
    if(this.kaKeymap.domExtents.init)
    {
        var xMov=(this.kaKeymap.domExtents.oX-e.clientX);
        var yMov=(this.kaKeymap.domExtents.oY-e.clientY);
        var oX=this.kaKeymap.pxExtent[0];
        var oY=this.kaKeymap.pxExtent[1];
        var nX = oX-xMov;
        var nY = oY-yMov;
        this.kaKeymap.domExtents.oX= e.clientX;
        this.kaKeymap.domExtents.oY= e.clientY;
        this.kaKeymap.pxExtent[0] = nX;
        this.kaKeymap.pxExtent[1] = nY;
        this.kaKeymap.domExtents.style.top = parseInt(nY+0.5) + "px";
        this.kaKeymap.domExtents.style.left = parseInt(nX+0.5) + "px";
    }
}
/**calculate the geografic position of div's center
* Use pxExtent left top width height because the 
div's top left width and heigth (casted to int)
this avoid in calculation error due to ins casting
**/
kaKeymap.prototype.geoCentCoord=function(){ 
       var cpX = this.pxExtent[0] + this.pxExtent[2]/2;
       var cpY = this.pxExtent[1] +  this.pxExtent[3]/2;
       var cX = this.aExtents[0] + (this.cellWidth *cpX); 
       var cY = this.aExtents[3] - (this.cellHeight *cpY); 
       return [cX,cY];
}
/*
 * kaTool API
 *
 * an API for building tools that work with kaMap
 *
 * To create a new tool, you need to have included this file first.  Next
 * create a function to instantiate your new tool.  All object construction
 * functions must include a parameter that references the kaMap object on which
 * they operate
 *
 * The object construction function must call the kaTool constructor using the
 * following syntax:
 *
 * kaTool.apply( this, [oKaMap] );
 *
 * where oKaMap is the name of the parameter to the constructor function.
 *
 * You should then set the tool's name (this.name) and overload any functions
 * for mouse handling etc
 */

//globally 
var kaCurrentTool = null;

function kaTool( oKaMap )
{
    this.kaMap = oKaMap;
    this.kaMap.registerTool( this );
    this.name = 'kaTool';
}

kaTool.prototype.activate = function()
{
    this.kaMap.activateTool( this );
    document.kaCurrentTool = this;
}

kaTool.prototype.deactivate = function()
{
    this.kaMap.deactivateTool( this );
    document.kaCurrentTool = null;
}

kaTool.prototype.onmousemove = function(e)
{
    return false;
}

kaTool.prototype.onmousedown = function(e)
{
    return false;
}

kaTool.prototype.onmouseup = function(e)
{
    return false;
}

kaTool.prototype.ondblclick = function(e)
{
    return false;
}

kaTool.prototype.onmousewheel = function(e)
{
    e = (e)?e:((event)?event:null);
    var wheelDelta = e.wheelDelta ? e.wheelDelta : e.detail*-1;
    if (wheelDelta > 0)
        this.kaMap.zoomIn();
    else
        this.kaMap.zoomOut();
}

/**
 * kaTool.adjustPixPosition( x, y )
 *
 * adjust a page-relative pixel position into a kaMap relative
 * pixel position
 *
 * x - int, the x page coord
 * y - int, the y page coord
 *
 * returns an array with the adjusted pixel positions
 */
kaTool.prototype.adjustPixPosition = function( x, y )
{
    var obj = this.kaMap.domObj;
    var offsetLeft = 0;
    var offsetTop = 0;
    while (obj)
    {
        offsetLeft += parseInt(obj.offsetLeft);
        offsetTop += parseInt(obj.offsetTop);
        obj = obj.offsetParent;
    }
    
    var pX = parseInt(this.kaMap.theInsideLayer.style.left) + 
             offsetLeft - this.kaMap.xOrigin - x;
    var pY = parseInt(this.kaMap.theInsideLayer.style.top) + 
             offsetTop - this.kaMap.yOrigin - y;
             
    return [pX,pY];
}

/*
 * key press events are directed to the HTMLDocument rather than the
 * div on which we really wanted them to happen.  So we set the document
 * keypress handler to this function and redirect it to the kaMap core
 * keypress handler, which will eventually reach the onkeypress handler
 * of our current tool ... which by default is the keyboard navigation.
 *
 * To get the keyboard events in the first place, add the following when you
 * want the keypress events to be captured
 *
 * if (isIE4) document.onkeydown = kaTool_redirect_onkeypress;
 * document.onkeypress = kaTool_redirect_onkeypress;
 */
function kaTool_redirect_onkeypress(e)
{
    if (document.kaCurrentTool)
        document.kaCurrentTool.onkeypress(e);
}

kaTool.prototype.onkeypress = function(e)
{
    e = (e)?e:((event)?event:null);
    if(e)
    {
        var charCode=(e.charCode)?e.charCode:e.keyCode;
        var b=true;
        var nStep = 16;
        switch(charCode)
        {
          case 38://up
            this.kaMap.moveBy(0,nStep);
            this.kaMap.triggerEvent( KAMAP_EXTENTS_CHANGED, this.kaMap.getGeoExtents() );
            break;
          case 40:
            this.kaMap.moveBy(0,-nStep);
            this.kaMap.triggerEvent( KAMAP_EXTENTS_CHANGED, this.kaMap.getGeoExtents() );
            break;
          case 37:
            this.kaMap.moveBy(nStep,0);
            this.kaMap.triggerEvent( KAMAP_EXTENTS_CHANGED, this.kaMap.getGeoExtents() );
            break;
          case 39:
            this.kaMap.moveBy(-nStep,0);
            this.kaMap.triggerEvent( KAMAP_EXTENTS_CHANGED, this.kaMap.getGeoExtents() );
            break;
          case 33:
            this.kaMap.slideBy(0, this.kaMap.viewportHeight/2);
            break;
          case 34:
            this.kaMap.slideBy(0,-this.kaMap.viewportHeight/2);
            break;
          case 36:
            this.kaMap.slideBy(this.kaMap.viewportWidth/2,0);
            break;
          case 35:
            this.kaMap.slideBy(-this.kaMap.viewportWidth/2,0);
            break;
          case 43:
            this.kaMap.zoomIn();
            break;
         case 45:
            this.kaMap.zoomOut();
            break;
          default:
            b=false;
        }
        if (b)
        {
            return this.cancelEvent(e);
        }
        return true;
    }
}

kaTool.prototype.onmouseover = function(e)
{
    return false;
}
kaTool.prototype.onmouseout = function(e)
{
    if (this.kaMap.isIE4) document.onkeydown = null;
    document.onkeypress = null;
    return false;
}

kaTool.prototype.cancelEvent = function(e)
{
    e = (e)?e:((event)?event:null);
    e.cancelBubble = true;
    e.returnValue = false;
    if (e.stopPropogation) e.stopPropogation();
    if (e.preventDefault) e.preventDefault();
    return false;
}

function kaNavigator( oKaMap )
{
    kaTool.apply( this, [oKaMap] );
    this.name = 'kaNavigator';
    this.cursor = 'move';

    this.activeImage = this.kaMap.server + 'va-images/button_pan_3.png';
    this.disabledImage = this.kaMap.server + 'va-images/button_pan_2.png';
    
    this.lastx = null;
    this.lasty = null;
    this.bMouseDown = false;
    
    for (var p in kaTool.prototype)
    {
        if (!kaNavigator.prototype[p])
            kaNavigator.prototype[p]= kaTool.prototype[p];
    }
}

kaNavigator.prototype.onmouseout = function(e)
{
    e = (e)?e:((event)?event:null);
    if (!e.target) e.target = e.srcElement;

    if (!this.kaMap) return;
    if (!this.kaMap.domObj) return;
    if (!this.kaMap.domObj.id) return;
    if (!e.target.id) return;
    if (e.target.id == this.kaMap.domObj.id)
    {
        this.bMouseDown = false;
        return kaTool.prototype.onmouseout.apply(this, [e]);
    }
}

kaNavigator.prototype.onmousemove = function(e)
{
    e = (e)?e:((event)?event:null);
    
    if (!this.bMouseDown)
    {
        return false;
    }
    
    if (!this.kaMap.layersHidden)
        this.kaMap.hideLayers();

    var newTop = safeParseInt(this.kaMap.theInsideLayer.style.top);
    var newLeft = safeParseInt(this.kaMap.theInsideLayer.style.left);

    newTop = newTop - this.lasty + e.clientY;
    newLeft = newLeft - this.lastx + e.clientX;

    this.kaMap.theInsideLayer.style.top=newTop + 'px';
    this.kaMap.theInsideLayer.style.left=newLeft + 'px';

    this.kaMap.checkWrap.apply(this.kaMap, []);

    this.lastx=e.clientX;
    this.lasty=e.clientY;
    return false;
}

kaNavigator.prototype.onmousedown = function(e)
{
    e = (e)?e:((event)?event:null);
    if (e.button==2)
    {
        return this.cancelEvent(e);
    }
    else
    {
        if (this.kaMap.isIE4) document.onkeydown = kaTool_redirect_onkeypress;
        document.onkeypress = kaTool_redirect_onkeypress;
        
        this.bMouseDown=true;
        this.lastx=e.clientX;
        this.lasty=e.clientY;
        
        e.cancelBubble = true;
        e.returnValue = false;
        if (e.stopPropogation) e.stopPropogation();
        if (e.preventDefault) e.preventDefault();
        return false;
    }
}

kaNavigator.prototype.onmouseup = function(e)
{
    e = (e)?e:((event)?event:null);
    this.bMouseDown=false;
    /* unnecessary according to Steve Lime */
    //this.lastx=null;
    //this.lasty=null;
    this.kaMap.showLayers();
    this.kaMap.triggerEvent(KAMAP_EXTENTS_CHANGED, this.kaMap.getGeoExtents());
    return false;
}

kaNavigator.prototype.ondblclick = function(e)
{
    e = (e)?e:((event)?event:null);

    var aPixPos = this.adjustPixPosition( e.clientX, e.clientY );
    
    var vpX = this.kaMap.viewportWidth/2;
    var vpY = this.kaMap.viewportHeight/2;
    
    var dx = parseInt(this.kaMap.theInsideLayer.style.left) - this.kaMap.xOrigin - vpX - aPixPos[0];
    var dy = parseInt(this.kaMap.theInsideLayer.style.top) - this.kaMap.yOrigin - vpY - aPixPos[1];

    this.kaMap.slideBy(-dx, -dy);
}


/* This notice must be untouched at all times.

wz_dragdrop.js    v. 4.62
The latest version is available at
http://www.walterzorn.com
or http://www.devira.com
or http://www.walterzorn.de

Copyright (c) 2002-2003 Walter Zorn. All rights reserved.
Created 26. 8. 2002 by Walter Zorn (Web: http://www.walterzorn.com )
Last modified: 30. 5. 2005

This DHTML & Drag&Drop Library adds Drag&Drop functionality
to the following types of html-elements:
- images, even if not positioned via layers,
  nor via stylesheets or any other kind of "hard-coding"
- relatively and absolutely positioned layers (DIV elements).
Moreover, it provides extended DHTML abilities.

LICENSE: LGPL

This library is free software; you can redistribute it and/or
modify it under the terms of the GNU Lesser General Public
License (LGPL) as published by the Free Software Foundation; either
version 2.1 of the License, or (at your option) any later version.

This library is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

For more details on the GNU Lesser General Public License,
see http://www.gnu.org/copyleft/lesser.html
*/


// PATH TO THE TRANSPARENT 1*1 PX IMAGE (required by NS 4 as spacer)
var spacer = 'transparentpixel.gif';




//window.onerror = new Function('return true;');


// Optional commands passed to SET_DHTML() on the html-page (g: may be applied globally, i: individually)
var CLONE            = 'C10nE';   // i  img      clone image
var COPY             = 'C0pY';    // i  img      create copies
var DETACH_CHILDREN  = 'd37aCH';  // i  lyr      detach images
var HORIZONTAL       = 'H0r1Z';   // i  img,lyr  horizontally draggable only
var MAXHEIGHT        = 'm7x8I';   // i  img,lyr  maximum height limit, "
var MAXOFFBOTTOM     = 'm7xd0wN'; // i  img,lyr  downward offset limit
var MAXOFFLEFT       = 'm7x23Ft'; // i  img,lyr  leftward offset limit
var MAXOFFRIGHT      = 'm7x0Ff8'; // i  img,lyr  rightward offset limit
var MAXOFFTOP        = 'm7xu9';   // i  img,lyr  upward offset limit
var MAXWIDTH         = 'm7xW1';   // i  img,lyr  maximum width limit, use with resizable or scalable
var MINWIDTH         = 'm1nw1';   // i  img,lyr  minimum width limit, "
var MINHEIGHT        = 'm1n8I';   // i  img,lyr  minimum height limit, "
var NO_ALT           = 'no81T';   // gi img      disable alt and title attributes
var NO_DRAG          = 'N0d4Ag';  // i  img,lyr  disable draggability
var RESET_Z          = 'r35E7z';  // gi img,lyr  reset z-index when dropped
var RESIZABLE        = 'r5IZbl';  // gi img,lyr  resizable if <ctrl> or <shift> pressed
var SCALABLE         = 'SCLbl';   // gi img,lyr  scalable           "
var SCROLL           = 'sC8lL';   // gi img,lyr  enable auto scroll functionality
var TRANSPARENT      = 'dIApHAn'; // gi img,lyr  translucent while dragged
var VERTICAL         = 'V3Rt1C';  // i  img,lyr  vertically draggable only

var dd_cursors = new Array(
	'c:default',
	'c:crosshair',
	'c:e-resize',
	'c:hand',
	'c:help',
	'c:move',
	'c:n-resize',
	'c:ne-resize',
	'c:nw-resize',
	'c:s-resize',
	'c:se-resize',
	'c:sw-resize',
	'c:text',
	'c:w-resize',
	'c:wait'
);
var dd_i = dd_cursors.length; while(dd_i--)
	eval('var CURSOR_' + (dd_cursors[dd_i].substring(2).toUpperCase().replace('-', '_')) + ' = "' + dd_cursors[dd_i] + '";');



function WZDD()
{
	this.elements = new Array(0);
	this.obj = null;
	this.n = navigator.userAgent.toLowerCase();
	this.db = (document.compatMode && document.compatMode.toLowerCase() != "backcompat")?
		document.documentElement
		: (document.body || null);
	this.op = !!(window.opera && document.getElementById);
	this.op6 = !!(this.op && !(this.db && this.db.innerHTML));
	if (this.op && !this.op6) document.onmousedown = new Function('e',
		'if (((e = e || window.event).target || e.srcElement).tagName == "IMAGE") return false;');
	this.ie = !!(this.n.indexOf("msie") >= 0 && document.all && this.db && !this.op);
	this.iemac = !!(this.ie && this.n.indexOf("mac") >= 0);
	this.ie4 = !!(this.ie && !document.getElementById);
	this.n4 = !!(document.layers && typeof document.classes != "undefined");
	this.n6 = !!(typeof window.getComputedStyle != "undefined" && typeof document.createRange != "undefined");
	this.w3c = !!(!this.op && !this.ie && !this.n6 && document.getElementById);
	this.ce = !!(document.captureEvents && document.releaseEvents);
	this.px = (this.n4 || this.op6)? '' : 'px';
	this.tiv = this.w3c? 40 : 10;
}
var dd = new WZDD();

dd.Int = function(d_x, d_y)
{
	return isNaN(d_y = parseInt(d_x))? 0 : d_y;
};

dd.getWndW = function()
{
	return dd.Int(
		(dd.db && !dd.op && !dd.w3c && dd.db.clientWidth)? dd.db.clientWidth
		: (window.innerWidth || 0)
	);
};

dd.getWndH = function()
{
	return dd.Int(
		(dd.db && !dd.op && !dd.w3c && dd.db.clientHeight)? dd.db.clientHeight
		: (window.innerHeight || 0)
	);
};

dd.getScrollX = function()
{
	return dd.Int(window.pageXOffset || (dd.db? dd.db.scrollLeft : 0));
};

dd.getScrollY = function()
{
	return dd.Int(window.pageYOffset || (dd.db? dd.db.scrollTop : 0));
};

dd.getPageXY = function(d_o)
{
	if (dd.n4 && d_o)
	{
		dd.x = d_o.pageX || 0;
		dd.y = d_o.pageY || 0;
	}
	else
	{
		dd.x = dd.y = 0; //global helper vars
		while (d_o)
		{
			dd.x += dd.Int(d_o.offsetLeft);
			dd.y += dd.Int(d_o.offsetTop);
			d_o = d_o.offsetParent || null;
		}
	}
};

dd.getCssXY = function(d_o)
{
	if (d_o.div)
	{
		if (dd.n4)
		{
			d_o.cssx = d_o.div.x;
			d_o.cssy = d_o.div.y;
		}
		else if (dd.ie4)
		{
			d_o.cssx = d_o.css.pixelLeft;
			d_o.cssy = d_o.css.pixelTop;
		}
		else
		{
			d_o.css.left = d_o.css.top = 0 + dd.px;
			dd.getPageXY(d_o.div);
			d_o.cssx = d_o.x - dd.x;
			d_o.cssy = d_o.y - dd.y;
			d_o.css.left = d_o.cssx + dd.px;
			d_o.css.top = d_o.cssy + dd.px;
		}
	}
	else
	{
		d_o.cssx = 0;
		d_o.cssy = 0;
	}
};

dd.getImgW = function(d_o)
{
	return d_o? dd.Int(d_o.width) : 0;
};

dd.getImgH = function(d_o)
{
	return d_o? dd.Int(d_o.height) : 0;
};

dd.getDivW = function(d_o)
{
	return dd.Int(
		dd.n4? (d_o.div? d_o.div.clip.width : 0)
		: d_o.div? (d_o.div.offsetWidth || d_o.css.pixelWidth || d_o.css.width || 0)
		: 0
	);
};

dd.getDivH = function(d_o)
{
	return dd.Int(
		dd.n4? (d_o.div? d_o.div.clip.height : 0)
		: d_o.div? (d_o.div.offsetHeight || d_o.css.pixelHeight || d_o.css.height || 0)
		: 0
	);
};

dd.getWH = function(d_o)
{
	d_o.w = dd.getDivW(d_o);
	d_o.h = dd.getDivH(d_o);
	if (d_o.css)
	{
		d_o.css.width = d_o.w + dd.px;
		d_o.css.height = d_o.h + dd.px;
		d_o.dw = dd.getDivW(d_o)-d_o.w;
		d_o.dh = dd.getDivH(d_o)-d_o.h;
		d_o.css.width = (d_o.w-d_o.dw) + dd.px;
		d_o.css.height = (d_o.h-d_o.dh) + dd.px;
	}
	else d_o.dw = d_o.dh = 0;
};

dd.getCssProp = function(d_o, d_pn6, d_pstyle, d_pn4)
{
	if (d_o && dd.n6) return ''+window.getComputedStyle(d_o, null).getPropertyValue(d_pn6);
	if (d_o && d_o.currentStyle) return ''+eval('d_o.currentStyle.'+d_pstyle);
	if (d_o && d_o.style) return ''+eval('d_o.style.'+d_pstyle);
	if (d_o && dd.n4) return ''+eval('d_o.'+d_pn4);
	return '';
};

dd.getDiv = function(d_x, d_d)
{
	d_d = d_d || document;
	if (dd.n4)
	{
		if (d_d.layers[d_x]) return d_d.layers[d_x];
		for (var d_i = d_d.layers.length; d_i--;)
		{
			var d_y = dd.getDiv(d_x, d_d.layers[d_i].document);
			if (d_y) return d_y;
		}
	}
	if (dd.ie) return d_d.all[d_x] || null;
	if (d_d.getElementById) return d_d.getElementById(d_x) || null;
	return null;
};

dd.getImg = function(d_o, d_nm, d_xy, d_w)
{
	d_w = d_w || window;
	var d_img;
	if (document.images && (d_img = d_w.document.images[d_nm]) && d_img.name == d_nm)
	{
		if (d_xy)
		{
			if (dd.n4)
			{
				dd.getPageXY(d_w);
				d_o.defx = d_img.x + dd.x;
				d_o.defy = d_img.y + dd.y;
			}
			else
			{
				dd.getPageXY(d_img);
				d_o.defx = dd.x;
				d_o.defy = dd.y;
			}
		}
		return d_img;
	}
	if (dd.n4) for (var d_i = d_w.document.layers.length; d_i--;)
	{
		var d_y = dd.getImg(d_o, d_nm, d_xy, d_w.document.layers[d_i]);
		if (d_y) return d_y;
	}
	return null;
};

dd.getParent = function(d_o, d_p)
{
	if (dd.n4)
	{
		for (d_p, d_i = dd.elements.length; d_i--;)
		{
			if (!((d_p = dd.elements[d_i]).is_image) && d_p.div && (d_p.div.document.layers[d_o.name] || d_o.oimg && d_p.div.document.images[d_o.oimg.name]))
				d_p.addChild(d_o, d_p.detach, 1);
		}
	}
	else
	{
		d_p = d_o.is_image? dd.getImg(d_o, d_o.oimg.name) : (d_o.div || null);
		while (d_p && !!(d_p = d_p.offsetParent || d_p.parentNode || null))
		{
			if (d_p.ddObj)
			{
				d_p.ddObj.addChild(d_o, d_p.ddObj.detach, 1);
				break;
			}
		}
	}
};

dd.getCmd = function(d_o, d_cmd, d_cmdStr)
{
	var d_i = d_o.id.indexOf(d_cmd), d_j,
	d_y = (d_i >= 0)*1;
	if (d_y)
	{
		d_j = d_i+d_cmd.length;
		if (d_cmdStr) d_o.cmd += d_o.id.substring(d_i, d_j);
		d_o.id = d_o.id.substring(0, d_i) + d_o.id.substring(d_j);
	}
	return d_y;
};

dd.getCmdVal = function(d_o, d_cmd, d_cmdStr, int0)
{
	var d_i = d_o.id.indexOf(d_cmd), d_j,
	d_y = (d_o.id.indexOf(d_cmd) >= 0)? dd.Int(d_o.id.substring(d_o.id.indexOf(d_cmd)+d_cmd.length)) : int0? -1 : 0;
	if (!int0 && d_y || int0 && d_y >= 0)
	{
		d_j = d_i+d_cmd.length+(""+d_y).length;
		if (d_cmdStr) d_o.cmd += d_o.id.substring(d_i, d_j);
		d_o.id = d_o.id.substring(0, d_i) + d_o.id.substring(d_j);
	}
	return d_y;
};

dd.addElt = function(d_o, d_p)
{
	dd.elements[d_o.name] = dd.elements[d_o.index = dd.elements.length] = d_o;
	if (d_p) d_p.copies[d_o.name] = d_p.copies[d_p.copies.length] = d_o;
};

dd.mkWzDom = function()
{
	var d_o, d_i = dd.elements.length; while(d_i--) dd.getParent(dd.elements[d_i]);
	d_i = dd.elements.length; while(d_i--)
	{
		d_o = dd.elements[d_i];
		if (d_o.children && !d_o.parent)
		{
			var d_j = d_o.children.length; while(d_j--)
				d_o.children[d_j].setZ(d_o.z+d_o.children[d_j].z, 1);
		}
	}
};

dd.addProps = function(d_o)
{
	var d_i, d_c;
	if (d_o.is_image)
	{
		d_o.div = dd.getDiv(d_o.id);
		if (d_o.div && typeof d_o.div.style != "undefined") d_o.css = d_o.div.style;
		d_o.nimg = (dd.n4 && d_o.div)? d_o.div.document.images[0] : (document.images[d_o.id+'NImG'] || null);
		if (d_o.nimg && !d_o.noalt && !dd.noalt)
		{
			d_o.nimg.alt = d_o.oimg.alt || '';
			if (d_o.oimg.title) d_o.nimg.title = d_o.oimg.title;
		}
		d_o.bgColor = '';
	}
	else
	{
		d_o.bgColor = dd.getCssProp(d_o.div, 'background-color','backgroundColor','bgColor').toLowerCase();
		if (dd.n6 && d_o.div)
		{
			if ((d_c = d_o.bgColor).indexOf('rgb') >= 0)
			{
				d_c = d_c.substring(4, d_c.length-1).split(',');
				d_o.bgColor = '#';
				for (d_i = 0; d_i < d_c.length; d_i++) d_o.bgColor += parseInt(d_c[d_i]).toString(0x10);
			}
			else d_o.bgColor = d_c;
		}
	}
	if (dd.scalable) d_o.scalable = d_o.resizable^1;
	else if (dd.resizable) d_o.resizable = d_o.scalable^1;
	d_o.setZ(d_o.defz);
	d_o.cursor = d_o.cursor || dd.cursor || 'auto';
	d_o._setCrs(d_o.nodrag? 'auto' : d_o.cursor);
	d_o.diaphan = d_o.diaphan || dd.diaphan || 0;
	d_o.opacity = 1.0;
	if (dd.ie && !dd.iemac && d_o.div)
		d_o.div.style.filter = "Alpha(opacity=100)";
	d_o.visible = true;
};

dd.initz = function()
{
	if (!(dd && (dd.n4 || dd.n6 || dd.ie || dd.op || dd.w3c))) return;
	if (dd.op6) WINSZ(2);
	else if (dd.n6 || dd.ie || dd.op && !dd.op6 || dd.w3c) dd.recalc(1);
	var d_drag = (document.onmousemove == DRAG),
	d_resize = (document.onmousemove == RESIZE);
	if (dd.loadFunc) dd.loadFunc();
	if (d_drag && document.onmousemove != DRAG) dd.setEvtHdl(1, DRAG);
	else if (d_resize && document.onmousemove != RESIZE) dd.setEvtHdl(1, RESIZE);
	if ((d_drag || d_resize) && document.onmouseup != DROP) dd.setEvtHdl(2, DROP);
	dd.setEvtHdl(0, PICK);
};

dd.finlz = function()
{
	if (dd.ie && dd.elements)
	{
		var d_i = dd.elements.length; while (d_i--)
			dd.elements[d_i].del();
	}
};

dd.setEvtHdl = function(d_typ, d_func)
{
	if (!d_typ)
	{
		if (document.onmousedown != d_func) dd.downFunc = document.onmousedown || null;
		document.onmousedown = d_func;
	}
	else if (d_typ&1)
	{
		if (document.onmousemove != d_func) dd.moveFunc = document.onmousemove || null;
		document.onmousemove = d_func;
	}
	else
	{
		if (document.onmouseup != d_func) dd.upFunc = document.onmouseup || null;
		document.onmouseup = d_func;
	}
	if (dd.ce)
	{
		var d_e = (!d_typ)? Event.MOUSEDOWN : (d_typ&1)? Event.MOUSEMOVE : Event.MOUSEUP;
		d_func? document.captureEvents(d_e) : document.releaseEvents(d_e);
	}
};

dd.evt = function(d_e)
{
	this.but = (this.e = d_e || window.event).which || this.e.button || 0;
	this.button = (this.e.type == 'mousedown')? this.but
		: (dd.e && dd.e.button)? dd.e.button
		: 0;
	this.src = this.e.target || this.e.srcElement || null;
	this.src.tag = ("" + (this.src.tagName || this.src)).toLowerCase();
	this.x = dd.Int(this.e.pageX || this.e.clientX || 0);
	this.y = dd.Int(this.e.pageY || this.e.clientY || 0);
	if (dd.ie)
	{
		this.x += dd.getScrollX() - (dd.ie && !dd.iemac)*1;
		this.y += dd.getScrollY() - (dd.ie && !dd.iemac)*1;
	}
	this.modifKey = this.e.modifiers? this.e.modifiers&Event.SHIFT_MASK : (this.e.shiftKey || false);
};

dd.recalc = function(d_x)
{
	var d_o, d_i = dd.elements.length; while(d_i--)
	{
		if (!(d_o = dd.elements[d_i]).is_image && d_o.div)
		{
			dd.getWH(d_o);
			if (d_o.div.pos_rel)
			{
				dd.getPageXY(d_o.div);
				var d_dx = dd.x - d_o.x, d_dy = dd.y - d_o.y;
				d_o.defx += d_dx;
				d_o.x += d_dx;
				d_o.defy += d_dy;
				d_o.y += d_dy;
				var d_p, d_j = d_o.children.length; while(d_j--)
				{
					if (!(d_p = d_o.children[d_j]).detached && (d_o != d_p.defparent || !(d_p.is_image && dd.getImg(d_p, d_p.oimg.name, 1))))
					{
						d_p.defx += d_dx;
						d_p.defy += d_dy;
						d_p.moveBy(d_dx, d_dy);
					}
				}
			}
		}
		else if (d_o.is_image && !dd.op6 && !dd.n4)
		{
			if (dd.n6 && d_x && !d_o.defw) d_o.resizeTo(d_o.defw = dd.getImgW(d_o.oimg), d_o.defh = dd.getImgH(d_o.oimg));
			var d_defx = d_o.defx, d_defy = d_o.defy;
			if (!(d_o.parent && d_o.parent != d_o.defparent) && (d_x || !d_o.detached || d_o.horizontal || d_o.vertical) && dd.getImg(d_o, d_o.oimg.name, 1))
				d_o.moveBy(d_o.defx-d_defx, d_o.defy-d_defy);
		}
	}
};



function WINSZ(d_x)
{
	if (d_x)
	{
		if (dd.n4 || dd.op6 && d_x&2)
		{
			dd.iW = innerWidth;
			dd.iH = innerHeight;
			if (dd.op6) setTimeout("WINSZ()", 0x1ff);
		}
		window.onresize = new Function('WINSZ();');
	}
	else if ((dd.n4 || dd.op6) && (innerWidth != dd.iW || innerHeight != dd.iH)) location.reload();
	else if (dd.op6) setTimeout("WINSZ()", 0x1ff);
	else if (!dd.n4) setTimeout('dd.recalc()', 0xa);
}
WINSZ(1);



function DDObj(d_o, d_i)
{
	this.id = d_o;
	this.cmd = '';
	this.cpy_n = dd.getCmdVal(this, COPY);
	this.maxoffb = dd.getCmdVal(this, MAXOFFBOTTOM, 0, 1);
	this.maxoffl = dd.getCmdVal(this, MAXOFFLEFT, 0, 1);
	this.maxoffr = dd.getCmdVal(this, MAXOFFRIGHT, 0, 1);
	this.maxofft = dd.getCmdVal(this, MAXOFFTOP, 0, 1);
	var d_j = dd_cursors.length; while(d_j--)
		if (dd.getCmd(this, dd_cursors[d_j], 1)) this.cursor = dd_cursors[d_j].substring(2);
	this.clone = dd.getCmd(this, CLONE, 1);
	this.detach = dd.getCmd(this, DETACH_CHILDREN);
	this.scalable = dd.getCmd(this, SCALABLE, 1);
	this.horizontal = dd.getCmd(this, HORIZONTAL);
	this.noalt = dd.getCmd(this, NO_ALT, 1);
	this.nodrag = dd.getCmd(this, NO_DRAG);
	this.scroll = dd.getCmd(this, SCROLL, 1);
	this.resizable = dd.getCmd(this, RESIZABLE, 1);
	this.re_z = dd.getCmd(this, RESET_Z, 1);
	this.diaphan = dd.getCmd(this, TRANSPARENT, 1);
	this.vertical = dd.getCmd(this, VERTICAL);
	this.maxw = dd.getCmdVal(this, MAXWIDTH, 1, 1);
	this.minw = Math.abs(dd.getCmdVal(this, MINWIDTH, 1, 1));
	this.maxh = dd.getCmdVal(this, MAXHEIGHT, 1, 1);
	this.minh = Math.abs(dd.getCmdVal(this, MINHEIGHT, 1, 1));

	this.name = this.id + (d_i || '');
	this.oimg = dd.getImg(this, this.id, 1);
	this.is_image = !!this.oimg;
	this.copies = new Array();
	this.children = new Array();
	this.parent = this.original = null;
	if (this.oimg)
	{
		this.id = this.name + 'div';
		this.w = dd.getImgW(this.oimg);
		this.h = dd.getImgH(this.oimg);
		this.dw = this.dh = 0;
		this.defz = dd.Int(dd.getCssProp(this.oimg, 'z-index','zIndex','zIndex')) || 1;
		this.defsrc = this.src = this.oimg.src;
		this.htm = '<img name="' + this.id + 'NImG"'+
			' src="' + this.oimg.src + '" '+
			'width="' + this.w + '" height="' + this.h + '">';
		this.t_htm = '<div id="' + this.id +
			'" style="position:absolute;'+
			'left:' + (this.cssx = this.x = this.defx) + 'px;'+
			'top:' + (this.cssy = this.y = this.defy) + 'px;'+
			'width:' + this.w + 'px;'+
			'height:' + this.h + 'px;">'+
			this.htm + '<\/div>';
	}
	else
	{
		if (!!(this.div = dd.getDiv(this.id)) && typeof this.div.style != "undefined") this.css = this.div.style;
		dd.getWH(this);
		if (this.div)
		{
			this.div.ddObj = this;
			this.div.pos_rel = ("" + (this.div.parentNode? this.div.parentNode.tagName : this.div.parentElement? this.div.parentElement.tagName : '').toLowerCase().indexOf('body') < 0);
		}
		dd.getPageXY(this.div);
		this.defx = this.x = dd.x;
		this.defy = this.y = dd.y;
		dd.getCssXY(this);
		this.defz = dd.Int(dd.getCssProp(this.div, 'z-index','zIndex','zIndex'));
	}
	this.defw = this.w || 0;
	this.defh = this.h || 0;
}

DDObj.prototype.moveBy = function(d_x, d_y, d_kds, d_o)
{
	if (!this.div) return;
	this.x += (d_x = dd.Int(d_x));
	this.y += (d_y = dd.Int(d_y));
	if (!d_kds || this.is_image || this.parent != this.defparent)
	{
		(d_o = this.css || this.div).left = (this.cssx += d_x) + dd.px;
		d_o.top = (this.cssy += d_y) + dd.px;
	}
	var d_i = this.children.length; while (d_i--)
	{
		if (!(d_o = this.children[d_i]).detached) d_o.moveBy(d_x, d_y, 1);
		d_o.defx += d_x;
		d_o.defy += d_y;
	}
};

DDObj.prototype.moveTo = function(d_x, d_y)
{
	this.moveBy(dd.Int(d_x)-this.x, dd.Int(d_y)-this.y);
};

DDObj.prototype.hide = function(d_m, d_o, d_p)
{
	if (this.div && this.visible)
	{
		d_p = this.css || this.div;
		if (d_m && !dd.n4)
		{
			this.display = dd.getCssProp(this.div, "display", "display", "display");
			if (this.oimg)
			{
				this.oimg.display = dd.getCssProp(this.oimg, "display", "display", "display");
				this.oimg.style.display = "none";
			}
			d_p.display = "none";
			dd.recalc();
		}
		else d_p.visibility = "hidden";
	}
	this.visible = false;
	var d_i = this.children.length; while (d_i--)
		if (!(d_o = this.children[d_i]).detached) d_o.hide(d_m);
};

DDObj.prototype.show = function(d_o, d_p)
{
	if (this.div)
	{
		d_p = this.css || this.div;
		if (d_p.display && d_p.display == "none")
		{
			d_p.display = this.display || "block";
			if (this.oimg) this.oimg.style.display = this.oimg.display || "inline";
			dd.recalc();
		}
		else d_p.visibility = "visible";
	}
	this.visible = true;
	var d_i = this.children.length; while (d_i--)
		if (!(d_o = this.children[d_i]).detached) d_o.show();
};

DDObj.prototype.resizeTo = function(d_w, d_h, d_o)
{
	if (!this.div) return;
	d_w = (this.w = dd.Int(d_w))-this.dw;
	d_h = (this.h = dd.Int(d_h))-this.dh;
	if (dd.n4)
	{
		this.div.resizeTo(d_w, d_h);
		if (this.is_image)
		{
			this.write('<img src="' + this.src + '" width="' + d_w + '" height="' + d_h + '">');
			(this.nimg = this.div.document.images[0]).src = this.src;
		}
	}
	else if (typeof this.css.pixelWidth != "undefined")
	{
		this.css.pixelWidth = d_w;
		this.css.pixelHeight = d_h;
		if (this.is_image)
		{
			(d_o = this.nimg.style).pixelWidth = d_w;
			d_o.pixelHeight = d_h;
		}
	}
	else
	{
		this.css.width = d_w + dd.px;
		this.css.height = d_h + dd.px;
		if (this.is_image)
		{
			(d_o = this.nimg).width = d_w;
			d_o.height = d_h;
			if (!d_o.complete) d_o.src = this.src;
		}
	}
};

DDObj.prototype.resizeBy = function(d_dw, d_dh)
{
	this.resizeTo(this.w+dd.Int(d_dw), this.h+dd.Int(d_dh));
};

DDObj.prototype.swapImage = function(d_x, d_cp)
{
	if (!this.nimg) return;
	this.nimg.src = d_x;
	this.src = this.nimg.src;
	if (d_cp)
	{
		var d_i = this.copies.length; while (d_i--)
			this.copies[d_i].src = this.copies[d_i].nimg.src = this.nimg.src;
	}
};

DDObj.prototype.setBgColor = function(d_x)
{
	if (dd.n4 && this.div) this.div.bgColor = d_x;
	else if (this.css) this.css.background = d_x;
	this.bgColor = d_x;
};

DDObj.prototype.write = function(d_x, d_o)
{
	this.text = d_x;
	if (!this.div) return;
	if (dd.n4)
	{
		(d_o = this.div.document).open();
		d_o.write(d_x);
		d_o.close();
		dd.getWH(this);
	}
	else if (!dd.op6)
	{
		this.css.height = 'auto';
		this.div.innerHTML = d_x;
		if (!dd.ie4) dd.recalc();
		if (dd.ie4 || dd.n6) setTimeout('dd.recalc();', 0); // n6.0: recalc twice
	}
};

DDObj.prototype.copy = function(d_n, d_p)
{
	if (!this.oimg) return;
	d_n = d_n || 1;
	while (d_n--)
	{
		var d_l = this.copies.length,
		d_o = new DDObj(this.name+this.cmd, d_l+1);
		if (dd.n4)
		{
			d_o.id = (d_p = new Layer(d_o.w)).name;
			d_p.clip.height = d_o.h;
			d_p.visibility = 'show';
			(d_p = d_p.document).open();
			d_p.write(d_o.htm);
			d_p.close();
		}
		else if (dd.db.insertAdjacentHTML) dd.db.insertAdjacentHTML("AfterBegin", d_o.t_htm);
		else if (document.createElement && dd.db && dd.db.appendChild)
		{
			dd.db.appendChild(d_p = document.createElement('div'));
			d_p.innerHTML = d_o.htm;
			d_p.id = d_o.id;
			d_p.style.position = 'absolute';
			d_p.style.width = d_o.w + 'px';
			d_p.style.height = d_o.h + 'px';
		}
		else if (dd.db && dd.db.innerHTML) dd.db.innerHTML += d_o.t_htm;
		d_o.defz = this.defz+1+d_l;
		dd.addProps(d_o);
		d_o.original = this;
		dd.addElt(d_o, this);
		if (this.parent)
		{
			this.parent.addChild(d_o, this.detached);
			d_o.defparent = this.defparent;
		}
		d_o.moveTo(d_o.defx = this.defx, d_o.defy = this.defy);
		if (dd.n4) d_o.defsrc = d_o.src = this.defsrc;
		d_o.swapImage(this.src);
	}
};

DDObj.prototype.addChild = function(d_kd, detach, defp)
{
	if (typeof d_kd != "object") d_kd = dd.elements[d_kd];
	if (d_kd.parent && d_kd.parent == this || d_kd == this || !d_kd.is_image && d_kd.defparent && !defp) return;

	this.children[this.children.length] = this.children[d_kd.name] = d_kd;
	d_kd.detached = detach || 0;
	if (defp) d_kd.defparent = this;
	else if (this == d_kd.defparent && d_kd.is_image) dd.getImg(this, d_kd.oimg.name, 1);
	if (!d_kd.defparent || this != d_kd.defparent)
	{
		d_kd.defx = d_kd.x;
		d_kd.defy = d_kd.y;
	}
	if (!detach)
	{
		d_kd.defz = d_kd.defz+this.defz-(d_kd.parent? d_kd.parent.defz : 0)+(!d_kd.is_image*1);
		d_kd.setZ(d_kd.z+this.z-(d_kd.parent? d_kd.parent.z : 0)+(!d_kd.is_image*1), 1);
	}
	if (d_kd.parent) d_kd.parent._removeChild(d_kd, 1);
	d_kd.parent = this;
};

DDObj.prototype._removeChild = function(d_kd, d_newp)
{
	if (typeof d_kd != "object") d_kd = this.children[d_kd];
	var d_oc = this.children, d_nc = new Array();
	for (var d_i = 0; d_i < d_oc.length; d_i++)
		if (d_oc[d_i] != d_kd) d_nc[d_nc.length] = d_oc[d_i];
	this.children = d_nc;
	d_kd.parent = null;
	if (!d_newp)
	{
		d_kd.detached = d_kd.defp = 0;
		if (d_kd.is_image) dd.getImg(d_kd, d_kd.oimg.name, 1);
	}
};

DDObj.prototype.attachChild = function(d_kd)
{
	(d_kd = (typeof d_kd != "object")? this.children[d_kd]: d_kd).detached = 0;
	d_kd.setZ(d_kd.defz + this.z-this.defz, 1);
};

DDObj.prototype.detachChild = function(d_kd)
{
	(d_kd = (typeof d_kd != "object")? this.children[d_kd]: d_kd).detached = 1;
};

DDObj.prototype.setZ = function(d_x, d_kds, d_o)
{
	if (d_kds)
	{
		var d_dz = d_x-this.z,
		d_i = this.children.length; while (d_i--)
			if (!(d_o = this.children[d_i]).detached) d_o.setZ(d_o.z+d_dz, 1);
	}
	dd.z = Math.max(dd.z, this.z = this.div? ((this.css || this.div).zIndex = d_x) : 0);
};

DDObj.prototype.maximizeZ = function()
{
	this.setZ(dd.z+1, 1);
};

DDObj.prototype._resetZ = function(d_o)
{
	if (this.re_z || dd.re_z)
	{
		this.setZ(this.defz);
		var d_i = this.children.length; while (d_i--)
			if (!(d_o = this.children[d_i]).detached) d_o.setZ(d_o.defz);
	}
};

DDObj.prototype.setOpacity = function(d_x)
{
	this.opacity = d_x;
	this._setOpaRel(1.0, 1);
};

DDObj.prototype._setOpaRel = function(d_x, d_kd, d_y, d_o)
{
	if (this.diaphan || d_kd)
	{
		d_y = this.opacity*d_x;
		if (dd.n6) this.css.MozOpacity = d_y;
		else if (dd.ie && !dd.iemac && typeof this.div.filters != "undefined")
			this.div.filters[0].opacity = parseInt(100*d_y);
		else if (this.css) this.css.opacity = d_y;
		var d_i = this.children.length; while (d_i--)
			if (!(d_o = this.children[d_i]).detached) d_o._setOpaRel(d_x, 1);
	}
};

DDObj.prototype.setCursor = function(d_x)
{
	this._setCrs(this.cursor = (d_x.indexOf('c:')+1)? d_x.substring(2) : d_x);
};

DDObj.prototype._setCrs = function(d_x)
{
	if (this.css) this.css.cursor = ((!dd.ie || dd.iemac) && d_x == 'hand')? 'pointer' : d_x;
};

DDObj.prototype.setDraggable = function(d_x)
{
	this.nodrag = !d_x*1;
	this._setCrs(d_x? this.cursor : 'auto');
};

DDObj.prototype.setResizable = function(d_x)
{
	this.resizable = d_x*1;
	if (d_x) this.scalable = 0;
};

DDObj.prototype.setScalable = function(d_x)
{
	this.scalable = d_x*1;
	if (d_x) this.resizable = 0;
};

DDObj.prototype.del = function(d_os, d_o)
{
	var d_i;
	if (this.parent && this.parent._removeChild) this.parent._removeChild(this);
	if (this.original)
	{
		this.hide();
		if (this.original.copies)
		{
			d_os = new Array();
			for (d_i = 0; d_i < this.original.copies.length; d_i++)
				if ((d_o = this.original.copies[d_i]) != this) d_os[d_o.name] = d_os[d_os.length] = d_o;
			this.original.copies = d_os;
		}
	}
	else if (this.is_image)
	{
		this.hide();
		if (this.oimg)
		{
		  if (dd.n4) this.oimg.src = this.defsrc;
		  else this.oimg.style.visibility = 'visible';
		}
	}
	else if (this.moveTo)
	{
		if (this.css) this.css.cursor = 'default';
		this.moveTo(this.defx, this.defy);
		this.resizeTo(this.defw, this.defh);
	}
	d_os = new Array();
	for (d_i = 0; d_i < dd.elements.length; d_i++)
	{
		if ((d_o = dd.elements[d_i]) != this) d_os[d_o.name] = d_os[d_o.index = d_os.length] = d_o;
		else d_o._free();
	}
	dd.elements = d_os;
	if (!dd.op6 && !dd.n4) dd.recalc();
};

DDObj.prototype._free = function()
{
	for (var d_i in this)
		this[d_i] = null;
	dd.elements[this.name] = null;
};



dd.n4RectVis = function(vis)
{
	for (var d_i = 4; d_i--;)
	{
		dd.rectI[d_i].visibility = dd.rectA[d_i].visibility = vis? 'show' : 'hide';
		if (vis) dd.rectI[d_i].zIndex = dd.rectA[d_i].zIndex = dd.z+2;
	}
};

dd.n4RectPos = function(d_o, d_x, d_y, d_w, d_h)
{
	d_o.x = d_x;
	d_o.y = d_y;
	d_o.clip.width = d_w;
	d_o.clip.height = d_h;
};

// NN4: draw img resize rectangle
dd.n4Rect = function(d_w, d_h)
{
	var d_i;
	if (!dd.rectI)
	{
		dd.rectI = new Array();
		dd.rectA = new Array();
	}
	if (!dd.rectI[0])
	{
		for (d_i = 4; d_i--;)
		{
			(dd.rectI[d_i] = new Layer(1)).bgColor = '#000000';
			(dd.rectA[d_i] = new Layer(1)).bgColor = '#ffffff';
		}
	}
	if (!dd.rectI[0].visibility || dd.rectI[0].visibility == 'hide') dd.n4RectVis(1);
	dd.obj.w = d_w;
	dd.obj.h = d_h;
	for (d_i = 4; d_i--;)
	{
		dd.n4RectPos(dd.rectI[d_i], dd.obj.x + (!(d_i-1)? (dd.obj.w-1) : 0), dd.obj.y + (!(d_i-2)? (dd.obj.h-1) : 0), d_i&1 || dd.obj.w, !(d_i&1) || dd.obj.h);
		dd.n4RectPos(dd.rectA[d_i], !(d_i-1)? dd.rectI[1].x+1 : (dd.obj.x-1), !(d_i-2)? dd.rectI[2].y+1 : (dd.obj.y-1), d_i&1 || dd.obj.w+2, !(d_i&1) || dd.obj.h+2);
	}
};

dd.reszTo = function(d_w, d_h)
{
	if (dd.n4 && dd.obj.is_image) dd.n4Rect(d_w, d_h);
	else dd.obj.resizeTo(d_w, d_h);
};

dd.embedVis = function(d_vis)
{
	var d_o = new Array('iframe', 'applet', 'embed', 'object');
	var d_i = d_o.length; while (d_i--)
	{
		var d_p = dd.ie? document.all.tags(d_o[d_i]) : document.getElementsByTagName? document.getElementsByTagName(d_o[d_i]) : null;
		if (d_p)
		{
			var d_j = d_p.length; while (d_j--)
			{
				var d_q = d_p[d_j];
				while (d_q.offsetParent || d_q.parentNode)
				{
					if ((d_q = d_q.parentNode || d_q.offsetParent || null) == dd.obj.div)
					{
						d_p[d_j].style.visibility = d_vis;
						break;
					}
				}
			}
		}
	}
};

dd.maxOffX = function(d_x, d_y)
{
	return (
		(dd.obj.maxoffl+1 && (d_y = dd.obj.defx-dd.obj.maxoffl)-d_x > 0
		|| dd.obj.maxoffr+1 && (d_y = dd.obj.defx+dd.obj.maxoffr)-d_x < 0)? d_y
		: d_x
	);
};

dd.maxOffY = function(d_x, d_y)
{
	return (
		(dd.obj.maxofft+1 && (d_y = dd.obj.defy-dd.obj.maxofft)-d_x > 0
		|| dd.obj.maxoffb+1 && (d_y = dd.obj.defy+dd.obj.maxoffb)-d_x < 0)? d_y
		: d_x
	);
};

dd.inWndW = function(d_x, d_y)
{
	var d_wx = dd.getScrollX(),
	d_ww = dd.getWndW();
	return (
		((d_y = d_wx+2)-d_x > 0) || ((d_y = d_wx+d_ww+dd.obj.w-2)-d_x < 0)? d_y
		: d_x
	);
};

dd.inWndH = function(d_x, d_y)
{
	var d_wy = dd.getScrollY(),
	d_wh = dd.getWndH();
	return (
		((d_y = d_wy+2)-d_x > 0) || ((d_y = d_wy+d_wh+dd.obj.h-2)-d_x < 0)? d_y
		: d_x
	);
};

// These two funcs limit the size of element when mouseresized.
// Implemented 22.5.2003 by Gregor L?tolf <gregor@milou.ch>, modified by Walter Zorn
dd.limW = function(d_w)
{
	return (
		(dd.obj.minw-d_w > 0)? dd.obj.minw
		: (dd.obj.maxw > 0 && dd.obj.maxw-d_w < 0)? dd.obj.maxw
		: d_w
	);
};

dd.limH = function(d_h)
{
	return (
		(dd.obj.minh-d_h > 0)? dd.obj.minh
		: (dd.obj.maxh > 0 && dd.obj.maxh-d_h < 0)? dd.obj.maxh
		: d_h
	);
};


// Optional autoscroll-page functionality. Courtesy Cedric Savarese.
// Implemented by Walter Zorn
function DDScroll()
{
	if (!dd.obj || !dd.obj.scroll && !dd.scroll || dd.op || dd.ie4 || dd.whratio)
	{
		dd.scrx = dd.scry = 0;
		return;
	}
	var d_bnd = 0x1c,
	d_wx = dd.getScrollX(), d_wy = dd.getScrollY();
	if (dd.msmoved)
	{
		var d_ww = dd.getWndW(), d_wh = dd.getWndH(), d_y;
		dd.scrx = ((d_y = dd.e.x-d_ww-d_wx+d_bnd) > 0)? (d_y>>=2)*d_y
			: ((d_y = d_wx+d_bnd-dd.e.x) > 0)? -(d_y>>=2)*d_y
			: 0;
		dd.scry = ((d_y = dd.e.y-d_wh-d_wy+d_bnd) > 0)? (d_y>>=2)*d_y
			: ((d_y = d_wy+d_bnd-dd.e.y) > 0)? -(d_y>>=2)*d_y
			: 0;
	}
	if (dd.scrx || dd.scry)
	{
		window.scrollTo(
			d_wx + (dd.scrx = dd.obj.is_resized? dd.limW(dd.obj.w+dd.scrx)-dd.obj.w : dd.obj.vertical? 0 : (dd.maxOffX(dd.obj.x+dd.scrx)-dd.obj.x)),
			d_wy + (dd.scry = dd.obj.is_resized? dd.limH(dd.obj.h+dd.scry)-dd.obj.h : dd.obj.horizontal? 0 : (dd.maxOffY(dd.obj.y+dd.scry)-dd.obj.y))
		);
		dd.obj.is_dragged? dd.obj.moveTo(dd.obj.x+dd.getScrollX()-d_wx, dd.obj.y+dd.getScrollY()-d_wy)
			: dd.reszTo(dd.obj.w+dd.getScrollX()-d_wx, dd.obj.h+dd.getScrollY()-d_wy);
	}
	dd.msmoved = 0;
	window.setTimeout('DDScroll()', 0x33);
}



function PICK(d_ev)
{
	dd.e = new dd.evt(d_ev);
	if (dd.e.x >= dd.getWndW()+dd.getScrollX() || dd.e.y >= dd.getWndH()+dd.getScrollY()) return true; // on scrollbar
	var d_o, d_cmp = -1, d_i = dd.elements.length; while (d_i--)
	{
		d_o = dd.elements[d_i];
		if (dd.n4 && dd.e.but > 1 && dd.e.src == d_o.oimg && !d_o.clone) return false;
		if (d_o.visible && dd.e.but <= 1 && dd.e.x >= d_o.x && dd.e.x <= d_o.x+d_o.w && dd.e.y >= d_o.y && dd.e.y <= d_o.y+d_o.h)
		{
			if (d_o.z > d_cmp && dd.e.src.tag.indexOf('input') < 0 && dd.e.src.tag.indexOf('textarea') < 0 && dd.e.src.tag.indexOf('select') < 0 && dd.e.src.tag.indexOf('option') < 0)
			{
				d_cmp = d_o.z;
				dd.obj = d_o;
			}
		}
	}
	if (dd.obj)
	{
		if (dd.obj.nodrag) dd.obj = null;
		else
		{
			dd.e.e.cancelBubble = true;
			var d_rsz = dd.e.modifKey && (dd.obj.resizable || dd.obj.scalable);
			if (dd.op && !dd.op6)
			{
				(d_o = document.getElementById('OpBlUr')).style.pixelLeft = dd.e.x;
				d_o.style.pixelTop = dd.e.y;
				(d_o = d_o.children[0].children[0]).focus();
				d_o.blur();
			}
			else if (dd.ie && !dd.ie4)
			{
				if (document.selection && document.selection.empty) document.selection.empty();
				dd.db.onselectstart = function()
				{
					event.returnValue = false;
				};
			}
			if (d_rsz)
			{
				dd.obj._setCrs('se-resize');
				dd.obj.is_resized = 1;
				dd.whratio = dd.obj.scalable? dd.obj.defw/dd.obj.defh : 0;
				if (dd.ie)
				{
					if (dd.ie4)
					{
						window.dd_x = dd.getScrollX();
						window.dd_y = dd.getScrollY();
					}
					setTimeout(
						'if (dd.obj && document.selection && document.selection.empty)'+
						'{'+
							'document.selection.empty();'+
							'if (dd.ie4) window.scrollTo(window.dd_x, window.dd_y);'+
						'}'
					,0);
				}
				dd.setEvtHdl(1, RESIZE);
				dd.reszTo(dd.obj.w, dd.obj.h);
			}
			else
			{
				dd.obj.is_dragged = 1;
				dd.setEvtHdl(1, DRAG);
			}
			dd.setEvtHdl(2, DROP);
			dd.embedVis('hidden');
			dd.obj._setOpaRel(0.7);
			dd.obj.maximizeZ();
			dd.ofx = dd.obj.x+dd.obj.w-dd.e.x;
			dd.ofy = dd.obj.y+dd.obj.h-dd.e.y;
			if (window.my_PickFunc) my_PickFunc();
			DDScroll();
			return !(
				dd.obj.is_resized
				|| dd.n4 && dd.obj.is_image
				|| dd.n6 || dd.w3c
			);
		}
	}
	if (dd.downFunc) return dd.downFunc(d_ev);
	return true;
}

function DRAG(d_ev)
{
	if (!dd.obj || !dd.obj.visible) return true;
	if (dd.ie4 || dd.w3c || dd.n6 || dd.obj.children.length > 0xf)
	{
		if (dd.wait) return false;
		dd.wait = 1;
		setTimeout('dd.wait = 0;', dd.tiv);
	}
	dd.e = new dd.evt(d_ev);
	if (dd.ie && !dd.e.but)
	{
		DROP(d_ev);
		return true;
	}
	dd.msmoved = 1;
	dd.obj.moveTo(
		dd.obj.vertical? dd.obj.x : dd.maxOffX(dd.inWndW(dd.ofx+dd.e.x)-dd.obj.w),
		dd.obj.horizontal? dd.obj.y : dd.maxOffY(dd.inWndH(dd.ofy+dd.e.y)-dd.obj.h)
	);

	if (window.my_DragFunc) my_DragFunc();
	return false;
}

function RESIZE(d_ev)
{
	if (!dd.obj || !dd.obj.visible) return true;
	if (dd.wait) return false;
	dd.wait = 1;
	setTimeout('dd.wait = 0;', dd.tiv);
	dd.e = new dd.evt(d_ev);
	if (dd.ie && !dd.e.but)
	{
		DROP(d_ev);
		return true;
	}
	dd.msmoved = 1;
	var d_w = dd.limW(dd.inWndW(dd.ofx+dd.e.x)-dd.obj.x), d_h;
	if (!dd.whratio) d_h = dd.limH(dd.inWndH(dd.ofy+dd.e.y)-dd.obj.y);
	else
	{
		d_h = dd.limH(dd.inWndH(Math.round(d_w/dd.whratio)+dd.obj.y)-dd.obj.y);
		d_w = Math.round(d_h*dd.whratio);
	}
	dd.reszTo(d_w, d_h);
	if (window.my_ResizeFunc) my_ResizeFunc();
	return false;
}

function DROP(d_ev)
{
	if (dd.obj)
	{
		if (dd.obj.is_dragged)
		{
			if (!dd.obj.is_image) dd.getWH(dd.obj);
		}
		else if (dd.n4)
		{
			if (dd.obj.is_image)
			{
				dd.n4RectVis(0);
				dd.obj.resizeTo(dd.obj.w, dd.obj.h);
			}
		}
		if (!dd.n4 && !dd.op6 || !dd.obj.is_image) dd.recalc();
		dd.setEvtHdl(1, dd.moveFunc);
		dd.setEvtHdl(2, dd.upFunc);
		if (dd.db) dd.db.onselectstart = null;
		dd.obj._setOpaRel(1.0);
		dd.obj._setCrs(dd.obj.cursor);
		dd.embedVis('visible');
		dd.obj._resetZ();
		if (window.my_DropFunc)
		{
			dd.e = new dd.evt(d_ev);
			my_DropFunc();
		}
		dd.msmoved = dd.obj.is_dragged = dd.obj.is_resized = dd.whratio = 0;
		dd.obj = null;
	}
	dd.setEvtHdl(0, PICK);
}



function SET_DHTML()
{
	var d_a = arguments, d_ai, d_htm = '', d_o, d_i = d_a.length; while (d_i--)
	{
		if (dd.op6)
		{
			var d_t0 = (new Date()).getTime();
			while ((new Date()).getTime()-d_t0 < 0x99);
		}
		if (!(d_ai = d_a[d_i]).indexOf('c:')) dd.cursor = d_ai.substring(2);
		else if (d_ai == NO_ALT) dd.noalt = 1;
		else if (d_ai == SCROLL) dd.scroll = 1;
		else if (d_ai == RESET_Z) dd.re_z = 1;
		else if (d_ai == RESIZABLE) dd.resizable = 1;
		else if (d_ai == SCALABLE) dd.scalable = 1;
		else if (d_ai == TRANSPARENT) dd.diaphan = 1;
		else
		{
			d_o = new DDObj(d_ai);
			dd.addElt(d_o);
			d_htm += d_o.t_htm || '';
			if (d_o.oimg && d_o.cpy_n)
			{
				var d_j = 0; while (d_j < d_o.cpy_n)
				{
					var d_p = new DDObj(d_o.name+d_o.cmd, ++d_j);
					dd.addElt(d_p, d_o);
					d_p.defz = d_o.defz+d_j;
					d_p.original = d_o;
					d_htm += d_p.t_htm;
				}
			}
		}
	}
	if (dd.n4 || dd.n6 || dd.ie || dd.op || dd.w3c) document.write(
		(dd.n4? '<div style="position:absolute;"><\/div>\n'
		: (dd.op && !dd.op6)? '<div id="OpBlUr" style="position:absolute;visibility:hidden;width:0px;height:0px;"><form><input type="text" style="width:0px;height:0px;"><\/form><\/div>'
		: '') + d_htm
	);
	dd.z = 0x33;
	d_i = dd.elements.length; while (d_i--)
	{
		dd.addProps(d_o = dd.elements[d_i]);
		if (d_o.is_image && !d_o.original && !d_o.clone)
			dd.n4? d_o.oimg.src = spacer : d_o.oimg.style.visibility = 'hidden';
	}
	dd.mkWzDom();
	if (window.onload) dd.loadFunc = window.onload;
	document.onmousedown = document.onmousedown||null;
	document.onmousemove = document.onmousemove||null;
	document.onmouseup = document.onmouseup||null;
	window.onload = dd.initz;
	window.onunload = dd.finlz;
	dd.setEvtHdl(0, PICK);
}

function ADD_DHTML(d_o) // layers only!
{
	d_o = new DDObj(d_o);
	dd.addElt(d_o);
	dd.addProps(d_o);
	dd.mkWzDom();
}




////////////////////////////////////////////////////////////
// If not needed, all code below this line may be removed


// For backward compatibility
dd.d = document;            // < v. 2.72
var RESET_ZINDEX = RESET_Z; // < 3.44
var KEYDOWN_RESIZE = RESIZABLE; // < 4.43
var CURSOR_POINTER = CURSOR_HAND; // < 4.44
var NO_SCROLL = '';         // < v. 4.49




////////////////////////////////////////////////////////////
// FUNCTIONS FOR EXTENDED SCRIPTING
// Use these for your own extensions,
// or to call functions defined elsewhere



/* my_PickFunc IS AUTOMATICALLY CALLED WHEN AN ITEM STARTS TO BE DRAGGED.
The following objects/properties are accessible from here:

- dd.e: current mouse event
- dd.e.property: access to a property of the current mouse event.
  Mostly requested properties:
  - dd.e.x: document-related x co-ordinate
  - dd.e.y: document-related y co-ord
  - dd.e.src: target of mouse event (not identical with the drag drop object itself).
  - dd.e.button: currently pressed mouse button. Left button: dd.e.button <= 1

- dd.obj: reference to currently dragged item.
- dd.obj.property: access to any property of that item.
- dd.obj.method(): for example dd.obj.resizeTo() or dd.obj.swapImage() .
  Mostly requested properties:
	- dd.obj.name: image name or layer ID passed to SET_DHTML();
	- dd.obj.x and dd.obj.y: co-ordinates;
	- dd.obj.w and dd.obj.h: size;
	- dd.obj.is_dragged: 1 while item is dragged, else 0;
	- dd.obj.is_resized: 1 while item is resized, i.e. if <ctrl> or <shift> is pressed, else 0

For more properties and details, visit the API documentation
at http://www.walterzorn.com/dragdrop/api_e.htm (english) or
http://www.walterzorn.de/dragdrop/api.htm (german)    */
//function my_PickFunc()
//{
//}




/* my_DragFunc IS CALLED WHILE AN ITEM IS DRAGGED
See the description of my_PickFunc above for what's accessible from here. */
//function my_DragFunc()
//{
	//window.status = 'dd.elements.' + dd.obj.name + '.x  = ' + dd.obj.x + '     dd.elements.' + dd.obj.name + '.y = ' + dd.obj.y;
//}




/* my_ResizeFunc IS CALLED WHILE AN ITEM IS RESIZED
See the description of my_PickFunc above for what's accessible from here. */
//function my_ResizeFunc()
//{
	//window.status = 'dd.elements.' + dd.obj.name + '.w  = ' + dd.obj.w + '     dd.elements.' + dd.obj.name + '.h = ' + dd.obj.h;
//}




/* THIS ONE IS CALLED ONCE AN ITEM IS DROPPED
See the description of my_PickFunc for what's accessible from here.
Here may be investigated, for example, what's the name (dd.obj.name)
of the dropped item, and where (dd.obj.x, dd.obj.y) it has been dropped... */
//function my_DropFunc()
//{
//}

function my_PickFunc()
{
    if (dd.obj.my_PickFunc)
    {
        dd.obj.my_PickFunc();
    }
}

function my_DragFunc()
{
    if (dd.obj.my_DragFunc)
    {
        dd.obj.my_DragFunc();
    }
}

function my_ResizeFunc()
{
    if (dd.obj.my_ResizeFunc)
    {
        dd.obj.my_ResizeFunc();
    }
}

function my_DropFunc()
{
    if (dd.obj.my_DropFunc)
    {
        dd.obj.my_DropFunc();
    }
}
/**********************************************************************
 *
 * $Id: kaZoomer.js,v 1.3 2006/11/16 20:32:19 yassefa Exp $
 *
 * purpose: a sliding zoom control intended to be put in the map
 *
 * author: Paul Spencer (pspencer@dmsolutions.ca)
 *
 * The original kaZoomer code was written by DM Solutions Group.
 *
 * TODO:
 * 
 **********************************************************************
 *
 * Copyright (c) 2005, DM Solutions Group Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
 * DEALINGS IN THE SOFTWARE.
 *
 **********************************************************************/

/******************************************************************************
 * kaZoomer
 *
 * class to handle the zoom overlay
 *
 * oKaMap - the ka-Map instance to draw the zoomer on
 *
 *****************************************************************************/
function kaZoomer(oKaMap)
{
    this.kaMap = oKaMap;
    //get the viewport
    this.domObj = oKaMap.domObj;    
    //configure slider.
    this.nZoomImageHeight = 17;
    
    this.opacity = 50;
    
    this.left = 3;
    this.top = 3;
    this.right = null;
    this.bottom = null;
    
    this.zoomControlObj = null;

    //prototypes
    this.draw = kaZoomer_draw;
    this.update = kaZoomer_update;
    
    this.kaMap.registerForEvent( KAMAP_MAP_INITIALIZED, this, this.draw );
}

function kaZoomer_setPosition( left, top, right, bottom )
{
    this.left = left;
    this.top = top;
    this.right = right;
    this.bottom = bottom;
    
    if (this.zoomControlObj != null)
    {
        if (this.left != null)
        {
            oZoomControl.style.left = this.left + 'px';
        }
        else if (this.right != null)
        {
            oZoomControl.style.right = this.right + 'px';
        }
        if (this.top != null)
        {
            oZoomControl.style.top = this.top + 'px';
        }
        else if (this.bottom != null)
        {
            oZoomControl.style.bottom = this.bottom + 'px';
        }
    }
}

//handle a map zoom change from another tool
function kaZoomer_update()
{
    
    var nThumbHeight = dd.elements.zoomTrack.div.elementHeight;
    var nTrackTop = dd.elements.zoomTrack.y;
    
    var oKaMap = dd.elements.zoomTrack.div.kaZoomer.kaMap;
    var oMap = oKaMap.getCurrentMap();
    var nCurrentScale = parseInt(oMap.currentScale) + 1; //array is zero based
    var nScales = oMap.getScales().length;
    var nTrackHeight = this.nZoomImageHeight * nScales;
    var nPos = (nScales-nCurrentScale)*nThumbHeight;
    dd.elements.zoomThumb.moveTo(dd.elements.zoomThumb.x,nTrackTop + nPos);
}

//set up the slider UI.
function kaZoomer_draw()
{
    //get scale info for the current map.
    var oMap = this.kaMap.getCurrentMap();
   
    var nScales = oMap.getScales().length;
    var nCurrentScale = oMap.currentScale;
    var nTrackHeight = this.nZoomImageHeight * nScales;
    var nTrackMaxPosition = this.nZoomImageHeight * (nScales - 1);
    var nInitialPosition = dd.Int(this.nZoomImageHeight * 
                                  (nScales - nCurrentScale - 1));

    //widget images
    var szThumbImg = this.kaMap.server + 'images/slider_button.png';
    var szTrackTopImg =  this.kaMap.server + 'images/slider_tray_top.png';
    var szTrackBottomImg =  this.kaMap.server + 'images/slider_tray_bottom.png';
    
 
   //container div
    this.zoomControlObj = document.createElement('div');
    this.zoomControlObj.id = 'zoomControl';
    this.zoomControlObj.style.position = 'absolute';

    if (this.left != null)
    {
       if (this.left == '') {
         this.zoomControlObj.style.left = '';
       } else {
        this.zoomControlObj.style.left = this.left + 'px';
       }
    }
    else if (this.right != null)
    {
        if (this.right == '') {
          this.zoomControlObj.style.right = '';
        } else {
          this.zoomControlObj.style.right = this.right + 'px';
        }
    }
    if (this.top != null)
    {
      if (this.top == '') {
        this.zoomControlObj.style.top = '';
      } else {
        this.zoomControlObj.style.top = this.top + 'px';
      }
    }
    else if (this.bottom != null)
    {
      if (this.bottom == '') {
        this.zoomControlObj.style.bottom = '';
      } else {
        this.zoomControlObj.style.bottom = this.bottom + 'px';
      }
    }

    this.zoomControlObj.style.width = 17 + "px";
    this.zoomControlObj.style.height = (nTrackHeight + 2 * this.nZoomImageHeight + 6) + "px";
    this.zoomControlObj.style.opacity = this.opacity/100;
    this.zoomControlObj.style.mozOpacity = this.opacity/100;
    this.zoomControlObj.style.filter = "Alpha(opacity="+this.opacity+")";    this.zoomControlObj.style.cursor = 'auto';    
    this.zoomControlObj.style.zIndex = 300;
    this.zoomControlObj.onmouseover = kaZoomer_onmouseover;
    this.zoomControlObj.onmouseout = kaZoomer_onmouseout;
    this.zoomControlObj.kaZoomer = this;
    this.kaMap.domObj.appendChild(this.zoomControlObj);
    
    //draw the widget
    var oZoomTrack = document.createElement( 'div' );
    oZoomTrack.id = 'zoomTrack';
    oZoomTrack.kaZoomer = this;
    oZoomTrack.style.position = 'absolute';
    oZoomTrack.style.left = '0px';
    oZoomTrack.style.top = '20px';
    oZoomTrack.style.height = parseInt(nTrackHeight) + 'px';
    oZoomTrack.style.width = '17px';
    oZoomTrack.style.backgroundColor = "#acacac";
    oZoomTrack.style.backgroundImage = 'url(' + this.kaMap.server + 'images/slider_tray_fill.png)';
    oZoomTrack.elementHeight = this.nZoomImageHeight;
    oZoomTrack.onclick = kaZoomer_zoomTo;
    this.zoomControlObj.appendChild(oZoomTrack);
    
    var oZoomThumb = document.createElement( 'div' );
    oZoomThumb.id = 'zoomThumb';
    oZoomThumb.style.position = 'absolute';
    oZoomThumb.style.height = '17px';
    oZoomThumb.style.width = '17px';
    oZoomThumb.style.backgroundColor = "#888888";
    oZoomThumb.innerHTML = '<img src="' + szThumbImg +'" border="0" width="17" height="17">';
    this.zoomControlObj.appendChild(oZoomThumb);

    var oZoomTrackTop = document.createElement( 'div' );
    oZoomTrackTop.id = 'zoomTrackTop';
    oZoomTrackTop.style.position = 'absolute';
    oZoomTrackTop.style.left = '0px';
    oZoomTrackTop.style.top = '17px';
    oZoomTrackTop.style.width = '17px';
    oZoomTrackTop.style.height = '3px';
    oZoomTrackTop.innerHTML = '<img src="' + szTrackTopImg +'" border="0" width="17" height="3">';
    this.zoomControlObj.appendChild(oZoomTrackTop);
    
    var oZoomTrackBottom = document.createElement( 'div' );
    oZoomTrackBottom.id = 'zoomTrackBottom';
    oZoomTrackBottom.style.position = 'absolute';
    oZoomTrackBottom.style.left = '0px';
    oZoomTrackBottom.style.top = 20 + nTrackHeight + 'px';
    oZoomTrackBottom.style.width = '17px';
    oZoomTrackBottom.style.height = '3px';
    oZoomTrackBottom.innerHTML = '<img src="' + szTrackBottomImg +'" border="0" width="17" height="3">';
    this.zoomControlObj.appendChild(oZoomTrackBottom);

    //add +/- labels
    var oZoomIn = document.createElement('div');
    oZoomIn.id = 'zoomIn';
    oZoomIn.style.position = 'absolute';
    oZoomIn.style.top = '0px';
    oZoomIn.style.left = '0px';
    oZoomIn.style.width = '17px';
    oZoomIn.style.height = '17px';
    oZoomIn.kaZoomer = this;
    oZoomIn.onclick = kaZoomer_zoomIn;
    oZoomIn.innerHTML= "<img src='" + this.kaMap.server + "images/slider_button_zoomin.png' border='0' width='17' height='17'>";
    this.zoomControlObj.appendChild(oZoomIn);

    var oZoomOut = document.createElement('div');
    oZoomOut.id = 'zoomOut';
    oZoomOut.style.position = 'absolute';
    oZoomOut.style.top = 23 + nTrackHeight + 'px';
    oZoomOut.style.left = '0px';
    oZoomOut.style.width = '17px';
    oZoomOut.style.height = '17px';
    oZoomOut.kaZoomer = this;
    oZoomOut.onclick = kaZoomer_zoomOut;
    oZoomOut.innerHTML= "<img src='" + this.kaMap.server + "images/slider_button_zoomout.png' border='0' width='17' height='17'>";
    this.zoomControlObj.appendChild(oZoomOut);

    //set up drag and drop
    ADD_DHTML('zoomThumb'+MAXOFFTOP+0+MAXOFFBOTTOM+nTrackMaxPosition+VERTICAL);
    ADD_DHTML('zoomTrack'+NO_DRAG);

    dd.elements.zoomThumb.moveTo(dd.elements.zoomTrack.x, dd.elements.zoomTrack.y + nInitialPosition);
    dd.elements.zoomThumb.setZ(dd.elements.zoomTrack.z+1);

    dd.elements.zoomTrack.addChild('zoomThumb');

    dd.elements.zoomThumb.defx = dd.elements.zoomTrack.x;
    dd.elements.zoomThumb.defy = dd.elements.zoomTrack.y;
    
    dd.elements.zoomThumb.my_DropFunc = kaZoomer_DropFunc;
    
    this.kaMap.registerForEvent( KAMAP_SCALE_CHANGED, this, this.update );
}

//wz_dragdrop.js overriden function for responding to a release of the slider
function kaZoomer_DropFunc()
{
    //move thumb to closest scale marker
    var nTrackTop = dd.elements.zoomTrack.y;
    
    var nThumbTop = dd.elements.zoomThumb.y - nTrackTop;
    var nThumbHeight = dd.elements.zoomTrack.div.elementHeight;
    
    var nNearestIndex = Math.round(nThumbTop / nThumbHeight);
    dd.elements.zoomThumb.moveTo(dd.elements.zoomThumb.x,nTrackTop +(nNearestIndex*nThumbHeight));

    //perform zoom
    var oKaMap = dd.elements.zoomTrack.div.kaZoomer.kaMap;
    var oMap = oKaMap.getCurrentMap();
    var nCurrentScale = oMap.getScales()[oMap.aScales.length - nNearestIndex - 1];
    oKaMap.zoomToScale(nCurrentScale);
}

//zoom to the level clicked in the track
function kaZoomer_zoomTo( e )
{
    e = (e)?e:((event)?event:null);
    var nClickTop = (e.layerY)?e.layerY:e.offsetY;
    //find current track height
    var oKaZoomer = dd.elements.zoomTrack.div.kaZoomer;
    var oKaMap = oKaZoomer.kaMap;
    var oMap = oKaMap.getCurrentMap();
    var nScales = oMap.getScales().length;
    var nTrackHeight = dd.Int(oKaZoomer.nZoomImageHeight) * nScales;
    
    //zoome to closest scale
    var nNearestIndex = Math.floor(nClickTop / nTrackHeight * nScales);
    var nNewScale = oMap.getScales()[oMap.aScales.length - nNearestIndex - 1];
    oKaMap.zoomToScale(nNewScale);
}

function kaZoomer_onmouseover( e )
{
    this.style.opacity = 1;
    this.style.mozOpacity = 1;
    this.style.filter = "Alpha(opacity=100)";
}

function kaZoomer_onmouseout( e )
{
    this.style.opacity = this.kaZoomer.opacity/100;
    this.style.mozOpacity = this.kaZoomer.opacity/100;
    this.style.filter = "Alpha(opacity="+this.kaZoomer.opacity+")";
}

function kaZoomer_zoomIn()
{
    this.kaZoomer.kaMap.zoomIn();
}

function kaZoomer_zoomOut()
{
    this.kaZoomer.kaMap.zoomOut();
}

function kaZoomer_alert()
{
    alert('here');
}
