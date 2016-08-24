app.classes.Water = function(options) {
    var geometry = options.geometry,
        materials = options.materials;

    this.mesh = new THREE.Mesh(geometry, new THREE.MultiMaterial(materials));
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
}

app.classes.Water.prototype = {

    getMesh: function() {
        return this.mesh;
    },

    setPosition: function(options) {
        options = options || {};

        this.mesh.position.set(options.x, options.y, options.z);
    },

    rotateByY: function(rotation) {
        this.mesh.rotation.y = rotation;
    },

    update: function() {
        this.getMesh().geometry.verticesNeedUpdate = true;
    }
}
