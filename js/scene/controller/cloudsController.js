app.classes.CloudsController = function(options) {
    this.cloudsGenerator = options.cloudsGenerator;
    this.clouds = [];
}

app.classes.CloudsController.prototype = {

    generateClouds: function(options) {
        var self = this;

        this.clouds = this.cloudsGenerator.generateObjects({
            topBoundary: 34,
            bottomBoundary: 2,
            objectsCount: 10,
            sceneHeigh: 8,
            zPosition: {
                min: [25, 30, 35],
                max: [60, 65, 70]
            },
            minScale: 0.7,
            paddingFromCenterByX: 2,
            viewPortBoundaryByX: options.cameraFrustum.right,
            moveByXAxisStep: 0.005,
            initialRotation: {
                x: 0,
                y: 0,
                z: 0
            }
        });

        return this.clouds;
    },

    animateClouds: function(options) {
        var self = this;

        this.clouds.forEach(function(cloud) {
            self._inverseCloudMoveDirectionIfCloudIsOutOfScreen(cloud, options);
            cloud.moveByXAxis();
        });
    },

    _inverseCloudMoveDirectionIfCloudIsOutOfScreen: function(cloud, options) {
        var camera = options.camera;

        if (camera.isObjectOutOfCameraView(cloud)) {
            cloud.inverseMoveByXAxisStep();
        }
    }
}
