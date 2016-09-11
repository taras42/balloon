app.classes.SceneController = function(options) {
    this.initialize(options);
};

app.classes.SceneController.prototype = {

    settings: {
        sceneCenter: 45,
        ballonInitialYPos: 0.65,
        nextSceneStep: 8,
        lastScenePosition: 40,
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
        this.waterController = options.waterController;
        this.birdsController = options.birdsController;
        this.compositeText = options.compositeText;
        this.eventBus = options.eventBus;
        this.flatClouds = options.flatClouds;
        this.water = options.water;

        this._addObjectsToTheScene();
        this._setObjectsInitialPosition();
        this._setShadowLightTarget();

        this.camera.setSceneCenter({
            sceneCenter: this.settings.sceneCenter
        });

        this.currentScenePosition = this.settings.ballonInitialYPos;
        this.compositeText.fadeIn();

        this._initEvents();
    },

    _setObjectsInitialPosition: function() {
        this._setLightsPosition();
        this._setFlatCloudsPosition();
        this._setWaterPosition();
        this._setBallonPosition();
        this._setMountainPosition();
        this._setCameraPosition();
    },

    _setLightsPosition: function() {
        this.lights.setShadowLightPosition({
            x: 100,
            y: 120,
            z: 20
        });
    },

    _setFlatCloudsPosition: function() {
        this.flatClouds.setPosition({
            x: -5.5,
            y: 2,
            z: 40
        });
    },

    _setWaterPosition: function() {
        this.water.setPosition({
            x: 0.3,
            y: -2.7,
            z: this.settings.sceneCenter
        });

        this.water.rotateByY(-Math.PI/2);
    },

    _setBallonPosition: function() {
        this.ballonController.setBallonPosition({
            x: 5,
            y: this.settings.ballonInitialYPos,
            z: 50
        });
    },

    _setMountainPosition: function() {
        this.mountain.setPosition({
            x: 0,
            y: -2.75,
            z: this.settings.sceneCenter
        });

        this.mountain.rotateByY(-Math.PI/2);
    },

    _setCameraPosition: function() {
        this.camera.setPosition({
          x: 55,
          y: 45,
          z: 100
        });

        this.camera.rotate({
            order: 'YXZ',
            y: Math.PI/4,
            x: -Math.PI/6
        });
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

        var clouds = this.cloudsController.generateClouds({
            cameraFrustum: this.camera.getFrustum()
        });

        var birds = this.birdsController.generateBirds({
            cameraFrustum: this.camera.getFrustum()
        });

        birds.forEach(function(bird) {
            self.scene.add(bird.getMesh());
        });

        clouds.forEach(function(cloud) {
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
        this.cloudsController.animateClouds({
            camera: this.camera
        });
        this.birdsController.animateBirds({
            camera: this.camera
        });
        this.waterController.animateWater();
        this.flatClouds.rotateByY(this.settings.flatCloudsRotationFactor);
    },

    renderScene: function() {
        this.renderer.render(this.scene, this.camera.getCamera());
    },

    resizeScene: function() {
        this.camera.update();
        this.renderer.setSize( window.innerWidth, window.innerHeight );
    }
};

app.createSceneController = function(options) {
    this.sceneController = new this.classes.SceneController(options);
};
