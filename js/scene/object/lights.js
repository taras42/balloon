app.createLights = function () {
    var hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x494949, .5);

    var ambientLight = new THREE.AmbientLight(0xffffff, 0.3);

    var shadowLight = new THREE.DirectionalLight(0xf7d9aa, 1.5);
    shadowLight.castShadow = true;

    shadowLight.position.set(100, 100, 70);

    return {
        ambientLight: ambientLight,
        hemisphereLight: hemisphereLight,
        shadowLight: shadowLight
    }
}
