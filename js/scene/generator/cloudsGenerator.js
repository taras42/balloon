app.classes.CloudsGenerator = function(options) {
    this.cloudFactory = options.cloudFactory;
    this.clouds = [];
    this.currentSceneBoundary = 0;
    this.currentSceneCloudsCount = 0;
};

app.classes.CloudsGenerator.prototype = {

    generateClouds: function(options) {
        var cloud,
            cloudOptions,
            cloudsCount = options.cloudsCount || 2;
            topBoundary = options.topBoundary || 8,
            sceneHeigh = options.sceneHeigh || 4,
            sceneCount = Math.ceil(topBoundary/sceneHeigh),
            cloudsPerScene = Math.floor(cloudsCount/sceneCount);

        this.currentSceneBoundary = options.bottomBoundary;
        this.currentSceneCloudsCount = 0;

        for (var index = 0; index < cloudsCount; index++) {
            cloudOptions = this._getCloudOptions(options);

            cloud = this._addCloud(cloudOptions);

            this._setInverseYByModifier(cloud, options);
            this._scaleIfZPositionIsNegative(cloud, options);

            this._moveToNextSceneIfNecessary({
                cloudsPerScene: cloudsPerScene,
                sceneHeigh: sceneHeigh
            });
        }

        return this.clouds;
    },

    _addCloud: function(cloudOptions) {
        var cloud = this.cloudFactory.create(cloudOptions);

        this.clouds.push(cloud);
        this.currentSceneCloudsCount += 1;

        return cloud;
    },

    _scaleIfZPositionIsNegative: function(cloud, options) {
        var cloudZPosition = cloud.getPosition().z;

        if (cloudZPosition === options.zPosition.min) {
            cloud.scale(options.minScale);
        }
    },

    _setInverseYByModifier: function(cloud, options) {
        var sceneHeigh = options.sceneHeigh,
            halfScene = sceneHeigh / 2
            cloudYPosition = cloud.getPosition().y,
            currentSceneCenter = (this.currentSceneBoundary + sceneHeigh) - halfScene;

        cloud.setInverseYByModifier(((currentSceneCenter - Math.round(cloudYPosition)) * 2) * -1);
    },

    _getCloudOptions: function(options) {
        var xPosition = this._getXPosition(options);
        var yPosition = this._getYPosition(options);
        var zPosition = this._getZPosition(options);
        var moveModifier = this._getInversionModifier();
        var moveByXAxisStep = this._getMoveByXAxisStep(options, moveModifier);
        var moveByZAxisStep = this._getMoveByZAxisStep(options, moveModifier);

        return {
            moveByXAxisStep: moveByXAxisStep,
            moveByZAxisStep: moveByZAxisStep,
            initialPosition: {
                x: xPosition,
                y: yPosition,
                z: zPosition
            },
            initialRotation: options.initialRotation
        }
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
        if (this.currentSceneCloudsCount === options.cloudsPerScene) {
            this.currentSceneBoundary += options.sceneHeigh;
            this.currentSceneCloudsCount = 0;
        }
    },

    _getInversionModifier: function() {
        return Math.round(Math.random()) ? 1 : -1;
    }
}
