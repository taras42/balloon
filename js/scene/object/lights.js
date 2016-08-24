app.createLights = function () {
    var hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x494949, .5);

    var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);

    var shadowLight = new THREE.DirectionalLight(0xf7d9aa, 1.5);
    shadowLight.castShadow = true;

	shadowLight.shadow.camera.left = -30;
	shadowLight.shadow.camera.right = 30;
	shadowLight.shadow.camera.top = 30;
	shadowLight.shadow.camera.bottom = -30;
	shadowLight.shadow.camera.near = 1;
	shadowLight.shadow.camera.far = 200;

	shadowLight.shadow.mapSize.width = 2048;
	shadowLight.shadow.mapSize.height = 2048;

    return {
        ambientLight: ambientLight,
        hemisphereLight: hemisphereLight,
        shadowLight: shadowLight,
        setShadowLightPosition: function(position) {
            position = position || {
                x: 0,
                y: 0,
                z: 0
            }

            shadowLight.position.set(position.x, position.y, position.z);
        }
    }
}
