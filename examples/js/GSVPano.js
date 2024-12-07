var GSVPANO = GSVPANO || {};
GSVPANO.PanoLoader = function (parameters) {

    'use strict';

    var _parameters = parameters || {},
        _location,
        _zoom,
        _panoId,
        _panoClient = new google.maps.StreetViewService(),
        _count = 0,
        _total = 0,
        _canvas = document.createElement('canvas'),
        _ctx = _canvas.getContext('2d'),
        rotation = 0,
        copyright = '',
        onSizeChange = null,
        onPanoramaLoad = null;
        
    this.setProgress = function (p) {
    
        if (this.onProgress) {
            this.onProgress(p);
        }
        
    };

    this.throwError = function (message) {
    
        if (this.onError) {
            this.onError(message);
        } else {
            console.error(message);
        }
        
    };

    this.adaptTextureToZoom = function () {
    
        var w = 416 * Math.pow(2, _zoom),
            h = (416 * Math.pow(2, _zoom - 1));
        _canvas.width = w;
        _canvas.height = h;
        _ctx.translate( _canvas.width, 0);
        _ctx.scale(-1, 1);
    };

    // this.composeFromTile = function (x, y, texture) {
    
    //     _ctx.drawImage(texture, x * 512, y * 512);
    //     _count++;
        
    //     var p = Math.round(_count * 100 / _total);
    //     this.setProgress(p);
        
    //     if (_count === _total) {
    //         this.canvas = _canvas;
    //         if (this.onPanoramaLoad) {
    //             this.onPanoramaLoad();
    //         }
    //     }
        
    // };
    this.composeFromTile = function (x, y, texture) {
        _ctx.drawImage(texture, x * 512, y * 512);
        _count++;
    
        const progress = Math.round((_count / _total) * 100);
        this.setProgress(progress);
    
        if (_count === _total) {
            this.canvas = _canvas;
            if (this.onPanoramaLoad) {
                this.onPanoramaLoad();
            }
        }
    };
    
    // this.composePanorama = function () {
    
    //     this.setProgress(0);
    //     console.log('Loading panorama for zoom ' + _zoom + '...');
        
    //     var w = Math.pow(2, _zoom),
    //         h = Math.pow(2, _zoom - 1),
    //         self = this,
    //         url,
    //         x,
    //         y;
            
    //     _count = 0;
    //     _total = w * h;
        
    //     for( y = 0; y < h; y++) {
    //         for( x = 0; x < w; x++) {
    //             // url = 'http://maps.google.com/cbk?output=tile&panoid=' + _panoId + '&zoom=' + _zoom + '&x=' + x + '&y=' + y + '&' + Date.now();
    //             url = `https://maps.googleapis.com/maps/api/streetview?pano=${_panoId}&size=640x640&heading=${rotation}&key=YOUR_API_KEY`;
    //             (function (x, y) { 
    //                 var img = new Image();
    //                 img.addEventListener('load', function () {
    //                     self.composeFromTile(x, y, this);
    //                 });
    //                 img.crossOrigin = '';
    //                 img.src = url;
    //             })(x, y);
    //         }
    //     }
        
    // };
    this.composePanorama = function () {
        this.setProgress(0);
        console.log('Loading panorama for panoId:', _panoId);
    
        const self = this;
    
        // Set heading, pitch, and fov
        const heading = 317.3532968686251; // Replace with dynamic or user-defined values if needed
        const pitch = 0;
        const fov = 90;
    
        // Construct the URL with heading, pitch, and fov
        const url = `https://maps.googleapis.com/maps/api/streetview?pano=${_panoId}&size=640x640&heading=${heading}&pitch=${pitch}&fov=${fov}&key=API_KEY`;
    
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = function () {
            _ctx.drawImage(img, 0, 0, _canvas.width, _canvas.height);
            self.canvas = _canvas;
            self.setProgress(100);
    
            if (self.onPanoramaLoad) {
                self.onPanoramaLoad();
            }
        };
        img.onerror = function () {
            self.throwError('Failed to load panorama image.');
        };
        img.src = url;
    };
    
    

    // this.load = function (location) {
    
    //     console.log('Load for', location);
    //     var self = this;
    //     _panoClient.getPanoramaByLocation(location, 50, function (result, status) {
    //         if (status === google.maps.StreetViewStatus.OK) {
    //             if( self.onPanoramaData ) self.onPanoramaData( result );
    //             var h = google.maps.geometry.spherical.computeHeading(location, result.location.latLng);
    //             rotation = (result.tiles.centerHeading - h) * Math.PI / 180.0;
    //             copyright = result.copyright;
    //             self.copyright = result.copyright;
    //             _panoId = result.location.pano;
    //             self.panoId = _panoId;
    //             self.location = location;
    //             self.composePanorama();
    //         } else {
    //             if( self.onNoPanoramaData ) self.onNoPanoramaData( status );
    //             self.throwError('Could not retrieve panorama for the following reason: ' + status);
    //         }
    //     });
        
    // };
    // this.load = function (location) {
    //     console.log('Load for', location);
    //     var self = this;
    //     // _panoClient.getPanoramaByLocation(location, 50, function (result, status) {
    //     //     if (status === google.maps.StreetViewStatus.OK) {
    //     //         console.log('Panorama metadata:', result);
    //     //         if (self.onPanoramaData) self.onPanoramaData(result);
    //     //         var h = google.maps.geometry.spherical.computeHeading(location, result.location.latLng);
    //     //         rotation = (result.tiles.centerHeading - h) * Math.PI / 180.0;
    //     //         copyright = result.copyright;
    //     //         self.copyright = result.copyright;
    //     //         _panoId = result.location.pano;
    //     //         self.panoId = _panoId;
    //     //         self.location = location;
    //     //         self.composePanorama();
    //     //     } else {
    //     //         console.error('Panorama retrieval failed with status:', status);
    //     //         if (self.onNoPanoramaData) self.onNoPanoramaData(status);
    //     //         self.throwError('Could not retrieve panorama for the following reason: ' + status);
    //     //     }
    //     // });
    //     fetch(`https://maps.googleapis.com/maps/api/streetview/metadata?pano=${_panoId}&key=AIzaSyDl-P622itJNDKC2xTIbfXiDwlGq7UURCA`)
    //         .then(response => response.json())
    //         .then(data => {
    //             if (data.status === 'OK') {
    //                 rotation = data.heading || 0;
    //                 _panoId = data.pano_id;
    //                 self.panoId = _panoId;
    //                 self.composePanorama();
    //             } else {
    //                 self.throwError('Could not retrieve panorama metadata.');
    //             }
    //         })
    //         .catch(err => {
    //             self.throwError('Error fetching panorama metadata: ' + err.message);
    //         });

    // };
    this.load = function (location) {
        console.log('Loading panorama for location:', location);
    
        const self = this;
    
        // Fetch panorama metadata
        fetch(`https://maps.googleapis.com/maps/api/streetview/metadata?location=${location.lat()},${location.lng()}&key=API_KEY`)
            .then(response => response.json())
            .then(data => {
                if (data.status === 'OK') {
                    console.log('Panorama metadata:', data);
    
                    // Set pano_id and proceed to load the panorama
                    _panoId = data.pano_id;
                    self.panoId = _panoId;
                    self.composePanorama();
                } else {
                    self.throwError('Could not retrieve panorama metadata. Status: ' + data.status);
                }
            })
            .catch(error => {
                self.throwError('Error fetching panorama metadata: ' + error.message);
            });
    };    
    
    
    this.setZoom = function( z ) {
        _zoom = z;
        this.adaptTextureToZoom();
    };

    this.setZoom( _parameters.zoom || 1 );

};