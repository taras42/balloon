app.classes.ObjectsGenerator = function(options) {
    this.objectFactory = options.objectFactory;
    this.objects = [];
    this.currentSceneBoundary = 0;
    this.currentSceneObjectsCount = 0;
};

app.classes.ObjectsGenerator.prototype = {

    generateObjects: function(options) {
        var object,
            objectOptions,
            objectsCount = options.objectsCount || 2;
            topBoundary = options.topBoundary || 8,
            sceneHeigh = options.sceneHeigh || 4,
            sceneCount = Math.ceil(topBoundary/sceneHeigh),
            objectsPerScene = Math.floor(objectsCount/sceneCount);

        this.currentSceneBoundary = options.bottomBoundary;
        this.currentSceneObjectsCount = 0;

        for (var index = 0; index < objectsCount; index++) {
            objectOptions = this._getObjectOptions(options);

            object = this._addObject(objectOptions);

            this._scaleIfZPositionIsNegative(object, options);

            this._moveToNextSceneIfNecessary({
                objectsPerScene: objectsPerScene,
                sceneHeigh: sceneHeigh
            });
        }

        return this.objects;
    },

    _addObject: function(objectOptions) {
        var object = this.objectFactory.create(objectOptions);

        this.objects.push(object);
        this.currentSceneObjectsCount += 1;

        return object;
    },

    _scaleIfZPositionIsNegative: function(object, options) {
        var objectZPosition = object.getPosition().z;

        if (objectZPosition === options.zPosition.min) {
            object.scale(options.minScale);
        }
    },

    _getObjectOptions: function(options) {
        var xPosition = this._getXPosition(options);
        var yPosition = this._getYPosition(options);
        var zPosition = this._getZPosition(options);
        var moveModifier = this._getInversionModifier();
        var moveByXAxisStep = this._getMoveByXAxisStep(options, moveModifier);

        var generatedOptions = {
            moveByXAxisStep: moveByXAxisStep,
            initialPosition: {
                x: xPosition,
                y: yPosition,
                z: zPosition
            }
        };

        var objectOptions = options.getOptions
            ?  options.getOptions(generatedOptions)
            : {};

        return app.util.extend(objectOptions, generatedOptions);
    },

    _getZPosition: function(options) {
        var zPosition = options.zPosition || {
            min: [2],
            max: [4]
        },
            minZPositionIndex = Math.floor(Math.random() * zPosition.min.length),
            maxZPositionIndex = Math.floor(Math.random() * zPosition.max.length);

        zPosition = Math.round(Math.random())
            ? zPosition.max[maxZPositionIndex]
            : zPosition.min[minZPositionIndex];

        return zPosition;
    },

    _getYPosition: function(options) {
        var sceneHeigh = options.sceneHeigh || 4;

        return (Math.random() * sceneHeigh) + this.currentSceneBoundary;
    },

    _getXPosition: function(options) {
        var paddingFromCenterByX = options.paddingFromCenterByX || 0,
            viewPortBoundaryByX = options.viewPortBoundaryByX || 4,
            xInversion = this._getInversionModifier();

        return xInversion * ((Math.random() * (viewPortBoundaryByX - paddingFromCenterByX)) + paddingFromCenterByX);
    },

    _getMoveByXAxisStep: function(options, moveModifier) {
        var moveByXAxisStep = options.moveByXAxisStep || 0.001;
        return moveByXAxisStep * moveModifier;
    },

    _getMoveByZAxisStep: function(options, moveModifier) {
        var moveByZAxisStep = options.moveByZAxisStep || 0.001;
        return moveByZAxisStep * moveModifier;
    },

    _moveToNextSceneIfNecessary: function(options) {
        if (this.currentSceneObjectsCount === options.objectsPerScene) {
            this.currentSceneBoundary += options.sceneHeigh;
            this.currentSceneObjectsCount = 0;
        }
    },

    _getInversionModifier: function() {
        return Math.round(Math.random()) ? 1 : -1;
    }
}
