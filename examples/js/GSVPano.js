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

    this.loadFromMetadata = function ({ panoId, heading, pitch, fov }) {
        this.setProgress(0);
        console.log('Loading panorama for panoId:', panoId);
    
        const url = `https://maps.googleapis.com/maps/api/streetview?pano=${panoId}&size=640x640&heading=${heading}&pitch=${pitch}&fov=${fov}&key=YOUR_KEY`;
    
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            _ctx.drawImage(img, 0, 0, _canvas.width, _canvas.height);
            this.canvas = _canvas;
            this.setProgress(100);
    
            if (this.onPanoramaLoad) {
                this.onPanoramaLoad();
            }
        };
        img.onerror = () => {
            this.throwError('Failed to load panorama image.');
        };
        img.src = url;
    };    

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
    
    this.composePanorama = function (heading = 0, pitch = 0, fov = 90) {
        this.setProgress(0);
        console.log('Loading panorama for panoId:', _panoId);
    
        const url = `https://maps.googleapis.com/maps/api/streetview?pano=${_panoId}&size=640x640&heading=${heading}&pitch=${pitch}&fov=${fov}&key=YOUR_KEY`;
    
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
    

    this.load = function (location) {
        console.log('Loading panorama for location:', location);
    
        const self = this;
    
        // Fetch panorama metadata
        fetch(`https://maps.googleapis.com/maps/api/streetview/metadata?location=${location.lat()},${location.lng()}&key=YOUR_KEY`)
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