app.classes.CloudsController = function(options) {
    this.cloudsGenerator = options.cloudsGenerator;
    this.clouds = [];
}

app.classes.CloudsController.prototype = {

    settings: {
        moveByXAxisStep: 0.009,
        maxCloudsPerScene: 3,
        outOfScreenModifier: 1.5
    },

    setSceneCenter: function(sceneCenter) {
        this.sceneCenter = sceneCenter;
    },

    generateClouds: function(options) {
        var self = this;

        this.clouds = this.cloudsGenerator.generateObjects(options);

        return this.clouds;
    },

    calculateFrustumDiagonal: function(camera) {
        var cameraFrustum = camera.getFrustum(),
            cameraRotation = camera.getRotation();

        var x = cameraFrustum.right * 2,
            y = cameraFrustum.top * 2;

        var rotAngle = cameraRotation.x * -1;
        var yProjection = y / rotAngle;

        this.frustumDiagonal = Math.sqrt((x * x) + (yProjection * yProjection)) / 2;
    },

    animateClouds: function(options) {
        var self = this;

        this.clouds.forEach(function(cloud) {
            self._inverseCloudMoveDirectionIfCloudIsOutOfScreen(cloud, options);
            cloud.moveByXAxis();
        });
    },

    _isCloudOutOfScreen: function(cloud, options) {
        var cloudPosition = cloud.getPosition(),
            outOfScreenPadding = cloud.getWidth(),
            isDirectionPositive = cloud.moveByXAxisStep > 0,
            isDirectionNegative = !isDirectionPositive;

        var cloudPlanePositiveShift,
            cloudPlaneNegativeShift,
            cameraYPos = this._getCameraNormalizedPosition(options),
            cloudZShift = this._getCloudZShift(cloudPosition, cameraYPos),
            cloudYShift = this._getCloudYShift(cloudPosition, cameraYPos);

        if (isDirectionPositive) {
            cloudPlanePositiveShift = this.frustumDiagonal +
                outOfScreenPadding + cameraYPos + cloudZShift + cloudYShift;

            return cloudPosition.x > cloudPlanePositiveShift;
        }

        if (isDirectionNegative) {
            cloudPlaneNegativeShift = -this.frustumDiagonal
                - outOfScreenPadding - cameraYPos - cloudZShift - cloudYShift;

            return cloudPosition.x < cloudPlaneNegativeShift;
        }
    },

    _inverseCloudMoveDirectionIfCloudIsOutOfScreen: function(cloud, options) {
        if (this._isCloudOutOfScreen(cloud, options)) {
            cloud.inverseMoveByXAxisStep();
        }
    },

    _inverseCloudPositionByYIfCloudIsOutOfScreen: function(cloud) {
        if (this._isCloudOutOfScreen(cloud)) {
            cloud.inversePositionByY();
        }
    },

    // TODO plane shift compensation
    _getCloudZShift: function(cloudPosition, cameraYPos) {
        var delta = this.sceneCenter - cloudPosition.z,
            modifier = 1;

        if (cameraYPos > cloudPosition.y) {
            delta = Math.sqrt(delta * delta);
        } else {
            modifier = -1;
        }

        return delta * modifier;
    },

    _getCloudYShift: function(cloudPosition, cameraPosition) {
        var delta = cloudPosition.y - cameraPosition;

        return delta;
    },

    _getCameraNormalizedPosition: function(options) {
        var cameraPosition = options.camera.getPosition();

        return cameraPosition.y - this.sceneCenter;
    }
}
