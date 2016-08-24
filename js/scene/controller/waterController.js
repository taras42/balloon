app.classes.WaterController = function(options) {
    this.water = options.water;
    this.initialize();
}

app.classes.WaterController.prototype = {

    settings: {
        surfaceVertexY: 1.18,
        fluctuationStep: 0.1,
        fluctuationSpeed: 240,
        value: 0
    },

    initialize: function() {
        this.surfaceVertices = [];
        this._collectSurfaceVertices();
    },

    _collectSurfaceVertices: function() {
        var vertices = this.water.getMesh().geometry.vertices;

        for (var i = 0; i < vertices.length; i++) {
            var vertex = vertices[i];

            if (vertex.y >= this.settings.surfaceVertexY) {
                this.surfaceVertices.push(vertex);
            }
        }
    },


    animateWater: function() {
        for (var i = 0; i < this.surfaceVertices.length; i++) {
            var vertex = this.surfaceVertices[i];

            vertex.y += Math.cos(this.settings.value) / this.settings.fluctuationSpeed;
            this.settings.value += this.settings.fluctuationStep;
        }

        this.water.getMesh().geometry.verticesNeedUpdate = true;
    }

}
