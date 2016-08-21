app.createLights = function () {
    var hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x494949, .5);

    var ambientLight = new THREE.AmbientLight(0xffffff, 0.3);

    var shadowLight = new THREE.DirectionalLight(0xf7d9aa, 1.5);
    shadowLight.castShadow = true;

	shadowLight.shadow.camera.left = -12;
	shadowLight.shadow.camera.right = 12;
	shadowLight.shadow.camera.top = 12;
	shadowLight.shadow.camera.bottom = -12;
	shadowLight.shadow.camera.near = 1;
	shadowLight.shadow.camera.far = 200;

	shadowLight.shadow.mapSize.width = 2048;
	shadowLight.shadow.mapSize.height = 2048;

    shadowLight.position.set(100, 100, 70);

    return {
        ambientLight: ambientLight,
        hemisphereLight: hemisphereLight,
        shadowLight: shadowLight
    }
}
