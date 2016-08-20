app.createScene = function() {
    var scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xffffff, 0.015, 0.6);

    return scene;
};
