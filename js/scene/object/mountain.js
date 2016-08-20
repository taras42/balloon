app.classes.Mountain = function(options) {
    var geometry = options.geometry,
        materials = options.materials;

    this.mesh = new THREE.Mesh(geometry, new THREE.MultiMaterial(materials));
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;

    this.mesh.material.materials.forEach(function(material) {
        material.side = THREE.DoubleSide;
    });
};

app.classes.Mountain.prototype = {
    setPosition: function(options) {
        options = options || {
            x: 0,
            y: 0,
            z: 0
        }

        this.mesh.position.set(options.x, options.y, options.z);
    },

    rotateByY: function(value) {
        this.mesh.rotation.y = value;
    },

    getMesh: function() {
        return this.mesh;
    }
}
