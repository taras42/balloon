app.classes.BirdsController = function(options) {
    this.initialize(options);
}

app.classes.BirdsController.prototype =  {

    initialize: function(options) {
        this.birdsGenerator = options.birdsGenerator;
    },

    generateBirds: function(options) {
        this.birds = this.birdsGenerator.generateObjects({
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
            moveByXAxisStep: 0.2,
            getOptions: function(generatedOptions) {
                var moveByXAxisStep = generatedOptions.moveByXAxisStep;

                var yRotation = moveByXAxisStep > 0
                    ? Math.PI
                    : 0;

                return {
                    initialRotation: {
                        x: 0,
                        y: yRotation,
                        z: 0
                    }
                }
            }
        });

        return this.birds;
    },

    animateBirds: function(options) {
        var self = this;

        this.birds.forEach(function(bird) {
            self._changeFlyDirectionIfBirdIsOutOfCameraView(bird, options);
            bird.moveByXAxis();
            bird.fly();
        });
    },

    _changeFlyDirectionIfBirdIsOutOfCameraView: function(bird, options) {
        var camera = options.camera;

        if (camera.isObjectOutOfCameraView(bird)) {
            bird.inverseMoveByXAxisStep();
            bird.turnAround();
        }
    }
}
