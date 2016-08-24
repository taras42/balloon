app.classes.Water = function(options) {
    var geometry = options.geometry,
        materials = options.materials;

    this.mesh = new THREE.Mesh(geometry, new THREE.MultiMaterial(materials));
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;

    // this.mesh.material.materials.forEach(function(material) {
    //     material.side = THREE.DoubleSide;
    // });

    this.initialize(options);
}

app.classes.Water.prototype = {

    initialize: function(options) {},

    getMesh: function() {
        return this.mesh;
    },

    setPosition: function(options) {
        options = options || {};

        this.mesh.position.set(options.x, options.y, options.z);
    },

    rotateByY: function(rotation) {
        this.mesh.rotation.y = rotation;
    }
}
