app.classes.BirdsController = function(options) {
    this.initialize(options);
}

app.classes.BirdsController.prototype =  {

    initialize: function(options) {
        this.birdsGenerator = options.birdsGenerator;
    },

    generateBirds: function(options) {
        return this.birdsGenerator.generateObjects({
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
            moveByXAxisStep: 0.5,
            initialRotation: {
                x: 0,
                y: 0,
                z: 0
            }
        });
    }

}
