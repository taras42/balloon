app.classes.WaterController = function(options) {
    this.water = options.water;
    this.initialize();
}

app.classes.WaterController.prototype = {

    settings: {
        surfaceVertexY: 0.7,
        fluctuationStep: 0.08,
        fluctuationSpeed: 240,
        disturtionValue: 5
    },

    initialize: function() {
        this.surfaceVertices = [];
        this.disturtionValues = [];
        this._collectSurfaceVertices();
    },

    _collectSurfaceVertices: function() {
        var vertices = this.water.getMesh().geometry.vertices;

        for (var i = 0; i < vertices.length; i++) {
            var vertex = vertices[i];

            if (vertex.y >= this.settings.surfaceVertexY) {
                this.surfaceVertices.push(vertex);
                this.disturtionValues.push(Math.random() * this.settings.disturtionValue);
            }
        }
    },

    animateWater: function() {
        for (var i = 0; i < this.surfaceVertices.length; i++) {
            var vertex = this.surfaceVertices[i];

            vertex.y += Math.cos(this.disturtionValues[i]) / this.settings.fluctuationSpeed;
            this.disturtionValues[i] += this.settings.fluctuationStep;
        }

        this.water.update();
    }

}
