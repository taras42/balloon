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
        this.frustumDiagonal = 0;

        var frustum = this.getFrustum();

        this._camera = new THREE.OrthographicCamera(
            frustum.left,
            frustum.right,
            frustum.top,
            frustum.bottom,
            this.settings.near,
            this.settings.far);
    },

    setSceneCenter: function(options) {
        this.sceneCenter = options.sceneCenter;
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

        this.calculateFrustumDiagonal();
    },

    setPosition: function(position) {
        position = position || {
          x: 0,
          y: 0,
          z: 0
        };

        this._camera.position.set(position.x, position.y, position.z);
    },

    isObjectOutOfCameraView: function(object) {
        var objectPosition = object.getPosition(),
            outOfScreenPadding = object.getWidth(),
            isDirectionPositive = object.moveByXAxisStep > 0,
            isDirectionNegative = !isDirectionPositive;

        var objectPlanePositiveShift,
            objectPlaneNegativeShift,
            cameraYPos = this._getCameraNormalizedPosition(),
            objectZShift = this._getObjectZShift(objectPosition, cameraYPos),
            objectYShift = this._getObjectYShift(objectPosition, cameraYPos);

        if (isDirectionPositive) {
            objectPlanePositiveShift = this.frustumDiagonal +
                outOfScreenPadding + cameraYPos + objectZShift + objectYShift;

            return objectPosition.x > objectPlanePositiveShift;
        }

        if (isDirectionNegative) {
            objectPlaneNegativeShift = -this.frustumDiagonal
                - outOfScreenPadding - cameraYPos - objectZShift - objectYShift;

            return objectPosition.x < objectPlaneNegativeShift;
        }
    },

    _getObjectZShift: function(objectPosition, cameraNormalizedYPos) {
        var delta = this.sceneCenter - objectPosition.z,
            modifier = 1;

        if (cameraNormalizedYPos > objectPosition.y) {
            delta = Math.sqrt(delta * delta);
        } else {
            modifier = -1;
        }

        return delta * modifier;
    },

    _getObjectYShift: function(objectPosition, cameraNormalizedYPos) {
        var delta = objectPosition.y - cameraNormalizedYPos;

        return delta;
    },

    _getCameraNormalizedPosition: function() {
        var position = this.getPosition();

        return position.y - this.sceneCenter;
    },

    calculateFrustumDiagonal: function() {
        var frustum = this.getFrustum(),
            rotation = this.getRotation();

        var x = frustum.right * 2,
            y = frustum.top * 2;

        var rotAngle = rotation.x * -1;
        var yProjection = y / rotAngle;

        this.frustumDiagonal = Math.sqrt((x * x) + (yProjection * yProjection)) / 2;
    },

    rotate: function(options) {
        options = options || {};

        if (options.order) {
            this._camera.rotation.order = options.order;
        }

        this._camera.rotation.set(options.x || 0, options.y || 0, options.z || 0);
        this.calculateFrustumDiagonal();
    },

    _calculateAspect: function() {
        return window.innerWidth / window.innerHeight;
    }
}

app.createCamera = function() {
    return new this.classes.Camera();
}
