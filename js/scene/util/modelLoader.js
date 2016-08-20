app.loadModels = function(models) {
    return Promise.mapSeries(models, function(model) {
        return app.promisifiedModelLoader(model);
    });
};

app.promisifiedModelLoader = function(url) {
    return new Promise(function(resolve, reject) {
        app.loader.load(url, function(geometry, materials) {
            resolve({
                geometry: geometry,
                materials: materials
            });
        });
    });
};
