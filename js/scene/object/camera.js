app.classes.Camera = function() {
    this.settings = {
        left: -12,
        right: 12,
        top: 12,
        bottom: -12,
        near: 0.01,
        far: 1000,
        FOV: 60
    };

    this.initialize();
}

app.classes.Camera.prototype = {
    initialize: function() {
        var frustum = this.getFrustum();

        this._camera = new THREE.OrthographicCamera(
            frustum.left,
            frustum.right,
            frustum.top,
            frustum.bottom,
            this.settings.near,
            this.settings.far);
    },

    getCamera: function() {
        return this._camera;
    },

    getSceneCenterInPx: function() {
        return {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2
        }
    },

    getFrustum: function() {
        var aspect = this._calculateAspect();

        return {
            left: this.settings.left * aspect,
            right: this.settings.right * aspect,
            top: this.settings.top,
            bottom: this.settings.bottom
        };
    },

    getRotation: function() {
        return this._camera.rotation;
    },

    getPosition: function() {
        return this._camera.position;
    },

    moveUp: function(factor) {
        factor = factor || 0.01;
        this._camera.position.y += factor;
    },

    update: function() {
        var aspect = this._calculateAspect();

        this._camera.left = this.settings.left * aspect;
        this._camera.right = this.settings.right * aspect;
        this._camera.top = this.settings.top;
        this._camera.bottom = this.settings.bottom;

        this._camera.updateProjectionMatrix();
    },

    setPosition: function(position) {
        position = position || {
          x: 0,
          y: 0,
          z: 0
        };

        this._camera.position.set(position.x, position.y, position.z);
    },

    rotate: function(rotation) {
        rotation = rotation || {
          x: 0,
          y: 0,
          z: 0
        };

        this._camera.rotation.set(rotation.x, rotation.y, rotation.z);
    },

    _calculateAspect: function() {
        return window.innerWidth / window.innerHeight;
    }
}

app.createCamera = function() {
    return new this.classes.Camera();
}
