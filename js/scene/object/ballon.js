app.classes.Ballon = function(options) {
    var geometry = options.geometry,
        materials = options.materials;

    this.mesh = new THREE.Mesh(geometry, new THREE.MultiMaterial(materials));
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;

    this.mesh.material.materials.forEach(function(material) {
        material.side = THREE.DoubleSide;
    });

    this.initialize(options);
}

app.classes.Ballon.prototype = {
    initialize: function(options) {
        this.setPosition(options);
    },

    setPosition: function(options) {
        var position = options && options.position
            ? options.position
            : {
                x: 0,
                y: 0,
                z: 0
            }

        this.mesh.position.set(position.x, position.y, position.z);
    },

    getMesh: function() {
        return this.mesh;
    },

    getPosition: function() {
        return this.getMesh().position;
    },

    moveUp: function(factor) {
        factor = factor || 0.01;
        this.getMesh().position.y += factor;
    },

    rotateY: function(factor) {
        factor = factor || 0.01;
        this.getMesh().rotation.y += factor;
    }
}

app.createBallon = function(options) {
    return new app.classes.Ballon(options);
}
