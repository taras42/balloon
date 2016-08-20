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

    animateClouds: function() {
        var self = this;

        this.clouds.forEach(function(cloud) {
            self._inverseCloudPositionByYIfCloudIsOutOfScreen(cloud);
            self._inverseCloudMoveDirectionIfCloudIsOutOfScreen(cloud);

            cloud.moveByXAxis();
            cloud.moveByZAxis();
        });
    },

    _isCloudOutOfScreen: function(cloud) {
        var cloudPosition = cloud.getPosition(),
            outOfScreenPadding = cloud.getWidth() / this.settings.outOfScreenModifier,
            isDirectionPositive = cloud.moveByXAxisStep > 0,
            isDirectionNegative = !isDirectionPositive;

        if (isDirectionPositive && (cloudPosition.x > this.cameraFrustum.right + outOfScreenPadding)) {
            return true;
        }

        if (isDirectionNegative && (cloudPosition.x < this.cameraFrustum.left - outOfScreenPadding)) {
            return true;
        }
    },

    _inverseCloudMoveDirectionIfCloudIsOutOfScreen: function(cloud) {
        if (this._isCloudOutOfScreen(cloud)) {
            cloud.inverseMoveByXAxisStep();
            cloud.inverseMoveByZAxisStep();
        }
    },

    _inverseCloudPositionByYIfCloudIsOutOfScreen: function(cloud) {
        if (this._isCloudOutOfScreen(cloud)) {
            cloud.inversePositionByY();
        }
    }
}
