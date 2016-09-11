var app = {

    classes: {},

    init: function(models) {
        var eventBus = new this.classes.EventBus();

        var scene = this.createScene();
        var camera = this.createCamera();
        var lights = this.createLights();
        var ballon = this.createBallon(models[0]);
        var ballonController = new this.classes.BallonController({
            ballon: ballon,
            eventBus: eventBus
        });

        var compositeText = new this.classes.CompositeText({
            textSequence: [
                "Здоров, цімборе! Як оно? " +
                "У мене тоже йов! Чуєш шо? - прийди до ня на свадьбу!",
                "Пак на другий тиждень 18 числа. Айно, то буде неділя))",
                "Пак чого передумаю? Уже ся тулькі годи знаєме! Любиме ся) Всьо буде чотко!",
                "Конкретний таймінг розписаний у запрошенні, аш кить щось не до кунця розумієш - дзвони ми))",
                "Но главноє - приходи! Дуже тя бду чекати))"],
            textDisplayZones: [
                $('#textContainer_1'),
                $('#textContainer_2')
            ]
        });

        var cloudFactory = new this.classes.CloudFactory(models[1]);
        var birdFactory = new this.classes.BirdFactory(models[5]);

        var cloudsGenerator = new this.classes.ObjectsGenerator({
            objectFactory: cloudFactory
        });
        var birdsGenerator = new this.classes.ObjectsGenerator({
            objectFactory: birdFactory
        });
        var cloudsController = new this.classes.CloudsController({
            cloudsGenerator: cloudsGenerator
        });
        var mountain = new this.classes.Mountain(models[2]);
        var flatCloudsFactory = new this.classes.CloudFactory(models[3]);

        var water = new this.classes.Water(models[4]);

        var waterController = new this.classes.WaterController({
            water: water
        });

        var birdsController = new this.classes.BirdsController({
            birdsGenerator: birdsGenerator
        });

        var renderer = this.createRenderer(document.getElementById("world"));

        this.createSceneController({
            eventBus: eventBus,
            compositeText: compositeText,
            birdsController: birdsController,
            cloudsController: cloudsController,
            ballonController: ballonController,
            waterController: waterController,
            ballon: ballon,
            mountain: mountain,
            water: water,
            flatClouds: flatCloudsFactory.create(),
            camera: camera,
            lights: lights,
            renderer: renderer,
            scene: scene
        });

        this.render();
    },

    loader: new THREE.JSONLoader(),

    onWindowResize: function() {
        this.sceneController.resizeScene();
    },

    render: function() {
        requestAnimationFrame(this.render.bind(this));

        this.sceneController.updateScene();
        this.sceneController.renderScene();
    }
};
