app.classes.Bird = function(options) {
    var geometry = options.geometry,
        materials = options.materials;

    this.mesh = new THREE.Mesh(geometry, new THREE.MultiMaterial(materials));
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = false;

    this.moveByXAxisStep = options.moveByXAxisStep || 0.009;

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
};

app.classes.Bird.prototype = {

    getMesh: function() {
        return this.mesh;
    },

    rotate: function(options) {
        options = options || {};

        this.mesh.rotation.set(options.x, options.y, options.z);
    },

    rotateByY: function(factor) {
        this.mesh.rotation.y += factor;
    },

    setPosition: function(options) {
        options = options || {};

        this.mesh.position.set(options.x, options.y, options.z);
    },

    getPosition: function() {
        return this.mesh.position;
    },

    scale: function(scaleFactor) {},

    getWidth: function() {
        return this.mesh.geometry.boundingSphere.radius * 2;
    },

    resetToInitialPosition: function() {
        this.setPosition(this.initialPosition);
    },

    rotateToInitialPosition: function() {
        this.initialRotation && this.rotate(this.initialRotation);
    },

    setInverseYByModifier: function(inverseYByModifier) {
        this.inverseYByModifier = inverseYByModifier;
    },

    inversePositionByY: function() {
        var position = this.getPosition();

        this.setYPosition(position.y - this.inverseYByModifier);
        this.setInverseYByModifier(this.inverseYByModifier * -1);
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
