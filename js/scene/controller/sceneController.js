app.classes.SceneController = function(options) {
    this.initialize(options);
};

app.classes.SceneController.prototype = {

    settings: {
        ballonInitialYPos: 0.65,
        nextSceneStep: 8,
        lastScenePosition: 32,
        flatCloudsRotationFactor: 0.004,
        startMoveCameraPosition: 0
    },

    initialize: function(options) {
        this.scene = options.scene;
        this.lights = options.lights;
        this.ballon = options.ballon;
        this.mountain = options.mountain;
        this.camera = options.camera;
        this.renderer = options.renderer;
        this.ballonController = options.ballonController;
        this.cloudsController = options.cloudsController;
        this.compositeText = options.compositeText;
        this.eventBus = options.eventBus;
        this.flatClouds = options.flatClouds;
        this.water = options.water;

        this.cameraFrustum = this.camera.getFrustum();

        this._addObjectsToTheScene();
        this._setObjectsInitialPosition();
        this._setShadowLightTarget();

        this.cloudsController.setCameraRotation(this.camera.getRotation());
        this.cloudsController.calculateFrustumDiagonal();

        this.currentScenePosition = this.settings.ballonInitialYPos;
        this.compositeText.fadeIn();

        this._initEvents();
    },

    _setObjectsInitialPosition: function() {

        this.lights.setShadowLightPosition({
            x: 100,
            y: 120,
            z: 20
        });

        this.flatClouds.setPosition({
            x: -5.5,
            y: 2,
            z: 40
        });

        this.water.setPosition({
            x: 1.6,
            y: -3.25,
            z: 45.5
        });

        this.water.rotateByY(-Math.PI/2);

        this.ballonController.setBallonPosition({
            x: 5,
            y: this.settings.ballonInitialYPos,
            z: 50
        });

        this.mountain.setPosition({
            x: 0,
            y: -2.75,
            z: 45
        });

        this.mountain.rotateByY(-Math.PI/2);

        this.camera.setPosition({
          x: 100,
          y: 80,
          z: 150
        });

        this.camera.getCamera().lookAt(new THREE.Vector3(0, -2.75, 45));
    },

    _addObjectsToTheScene: function() {
        this.scene.add(this.camera.getCamera());
        this.scene.add(this.lights.hemisphereLight);
        this.scene.add(this.lights.shadowLight);
        this.scene.add(this.lights.ambientLight);
        this.scene.add(this.ballon.getMesh());
        this.scene.add(this.mountain.getMesh());
        this.scene.add(this.flatClouds.getMesh());
        this.scene.add(this.water.getMesh());

        this._generateClouds();
    },

    _generateClouds: function() {
        var self = this;

        this.cloudsController.setCameraFrustum(this.cameraFrustum);

        this.clouds = this.cloudsController.generateClouds({
            topBoundary: 34,
            bottomBoundary: 2,
            cloudsCount: 10,
            sceneHeigh: 8,
            zPosition: {
                min: [20, 25, 30],
                max: [70, 75, 80]
            },
            minScale: 0.7,
            paddingFromCenterByX: 2,
            viewPortBoundaryByX: this.camera.getFrustum().right,
            moveByXAxisStep: 0.005,
            initialRotation: {
                x: 0,
                y: 0,
                z: 0
            }
        }),

        this.clouds.forEach(function(cloud) {
            self.scene.add(cloud.getMesh());
        });
    },

    _setShadowLightTarget: function() {
        this.lights.shadowLight.target = this.ballon.getMesh();
    },

    _initEvents: function() {
        var self = this;

        window.addEventListener("click", this._onSceneClick.bind(this));

        this.eventBus.on("ballon:inIdle", function() {
            self.compositeText.next().fadeIn();
        });
    },

    _onSceneClick: function(e) {
        var cameraFrustum = this.camera.getFrustum(),
            sceneCenter = this.camera.getSceneCenterInPx(),
            currentX = e.clientX,
            currentY = e.clientY;

        var coordinates = {
            x: ((currentX - sceneCenter.x) * cameraFrustum.right) / sceneCenter.x,
            y: ((currentY - sceneCenter.y) * cameraFrustum.bottom) / sceneCenter.y
        };

        this._switchSceneIfNecessary();
    },

    _hideText: function() {
        this.compositeText.fadeOut();
    },

    _moveToNextScene: function() {
        this.currentScenePosition += this.settings.nextSceneStep;
    },

    _switchSceneIfNecessary: function() {
        var shouldMoveToNextScene = this._ifShouldMoveToTheNextScene(),
            lastScene = this._isLastScene();

        if (shouldMoveToNextScene && !lastScene) {
            this._moveToNextScene();
            this._hideText();
        }
    },

    _ifShouldMoveToTheNextScene: function() {
        return Math.ceil(this.ballon.getPosition().y) >= Math.ceil(this.currentScenePosition);
    },

    _isLastScene: function() {
        return (this.currentScenePosition + this.settings.nextSceneStep) > this.settings.lastScenePosition;
    },

    _isBallonInInitialPosition: function() {
        return this.ballon.getPosition().y === this.settings.ballonInitialYPos;
    },

    _moveCameraToFollowBallon: function() {
        var shouldFollowBallon = Math.floor(this.ballon.getPosition().y) >= this.settings.startMoveCameraPosition;

        if (shouldFollowBallon && this.ballonController.isBallonInMotion()) {
            this.camera.moveUp();
        }
    },

    updateScene: function() {
        this.ballonController.animateBallon(this.currentScenePosition);
        this._moveCameraToFollowBallon();
        this.cloudsController.animateClouds();
        this.flatClouds.rotateByY(this.settings.flatCloudsRotationFactor);
    },

    renderScene: function() {
        this.renderer.render(this.scene, this.camera.getCamera());
    },

    resizeScene: function() {
        this.camera.update();
        this.cameraFrustum = this.camera.getFrustum();
        this.cloudsController.setCameraFrustum(this.cameraFrustum);
        this.cloudsController.calculateFrustumDiagonal();
        this.renderer.setSize( window.innerWidth, window.innerHeight );
    }
};

app.createSceneController = function(options) {
    this.sceneController = new this.classes.SceneController(options);
};
