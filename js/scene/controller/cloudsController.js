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

    generateClouds: function(options) {
        var self = this;

        this.clouds = this.cloudsGenerator.generateClouds(options);

        return this.clouds;
    },

    setCameraFrustum: function(cameraFrustum) {
        this.cameraFrustum = cameraFrustum;
    },

    setCameraRotation: function(cameraRotation) {
        this.cameraRotation = cameraRotation;
    },

    calculateFrustumDiagonal: function() {
        var x = this.cameraFrustum.right * 2,
            y = this.cameraFrustum.top * 2;


        this.frustumDiagonal = (Math.sqrt((x * x) + (y * y)) / 2) / this.cameraRotation.y;
    },

    animateClouds: function() {
        var self = this;

        this.clouds.forEach(function(cloud) {
            //self._inverseCloudPositionByYIfCloudIsOutOfScreen(cloud);
            self._inverseCloudMoveDirectionIfCloudIsOutOfScreen(cloud);

            cloud.moveByXAxis();
        });
    },

    _isCloudOutOfScreen: function(cloud) {
        var cloudPosition = cloud.getPosition(),
            outOfScreenPadding = cloud.getWidth(),
            isDirectionPositive = cloud.moveByXAxisStep > 0,
            isDirectionNegative = !isDirectionPositive;

        var xToX = this.cameraRotation.y * cloudPosition.x;

        if (isDirectionPositive) {
            return xToX > this.frustumDiagonal + outOfScreenPadding;
        }

        if (isDirectionNegative) {
            return xToX < -this.frustumDiagonal - outOfScreenPadding;
        }
    },

    _inverseCloudMoveDirectionIfCloudIsOutOfScreen: function(cloud) {
        if (this._isCloudOutOfScreen(cloud)) {
            cloud.inverseMoveByXAxisStep();
        }
    },

    _inverseCloudPositionByYIfCloudIsOutOfScreen: function(cloud) {
        if (this._isCloudOutOfScreen(cloud)) {
            cloud.inversePositionByY();
        }
    }
}
