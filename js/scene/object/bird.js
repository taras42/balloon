app.classes.Bird = function(options) {
    var geometry = options.geometry,
        materials = options.materials;

    this.mesh = new THREE.Mesh(geometry, new THREE.MultiMaterial(materials));
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = false;

    this.mesh.material.materials.forEach(function(material) {
        material.side = THREE.DoubleSide;
    });

    this.moveByXAxisStep = options.moveByXAxisStep || 0.01;

    this.initialPosition = options.initialPosition || {
        x: 0,
        y: 3,
        z: -3
    }

    this.initialRotation = options.initialRotation || {
        x: 0,
        y: 0,
        z: 0
    }

    this.resetToInitialPosition();
    this.rotateToInitialPosition();

    this.identifyWings();

    this.swingStep = options.swingStep || 0.2;
    this.swingSpeed = options.swingSpeed || 100;
    this.swingValue = 0;
};

app.classes.Bird.prototype = {

    identifyWings: function() {
        var verticesCopy = [].concat(this.mesh.geometry.vertices);
        var sorterArray = verticesCopy.sort(function(a, b) {
            return a.z - b.z;
        });

        var length = sorterArray.length;

        this.firstWing = [sorterArray[0], sorterArray[1]];
        this.secondWing = [sorterArray[length - 1], sorterArray[length - 2]];
    },

    fly: function() {
        var delta = Math.cos(this.swingValue) / this.swingSpeed;

        this.firstWing[0].y += delta;
        this.firstWing[1].y += delta;
        this.secondWing[0].y += delta;
        this.secondWing[1].y += delta;

        this.swingValue += this.swingStep;

        this.mesh.geometry.verticesNeedUpdate = true;
    },

    turnAroundByY: function() {
        this.mesh.rotation.y = Math.PI;
    },

    getMesh: function() {
        return this.mesh;
    },

    rotate: function(options) {
        options = options || {};

        this.mesh.rotation.set(options.x, options.y, options.z);
    },

    setPosition: function(options) {
        options = options || {};

        this.mesh.position.set(options.x, options.y, options.z);
    },

    getPosition: function() {
        return this.mesh.position;
    },

    getWidth: function() {
        return this.mesh.geometry.boundingSphere.radius * 2;
    },

    resetToInitialPosition: function() {
        this.setPosition(this.initialPosition);
    },

    rotateToInitialPosition: function() {
        this.initialRotation && this.rotate(this.initialRotation);
    },

    inverseMoveByXAxisStep: function() {
        this.moveByXAxisStep = this.moveByXAxisStep * -1;
    },

    setYPosition: function(y) {
        this.mesh.position.y = y;
    },

    moveByXAxis: function(factor) {
        factor = factor || this.moveByXAxisStep;

        this.mesh.position.x += factor;
    }
};

app.classes.BirdFactory = function(options) {
    this.options = options;
};

app.classes.BirdFactory.prototype = {
    create: function(birdOptions) {
        birdOptions = birdOptions || {};

        app.util.extend(birdOptions || {}, this.options);

        return new app.classes.Bird(birdOptions);
    }
};
