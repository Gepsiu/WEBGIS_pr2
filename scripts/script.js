require([
    "esri/Map",
    "esri/views/SceneView",
    "esri/layers/FeatureLayer",
    "esri/layers/GraphicsLayer"
    ],(Map, SceneView, FeatureLayer, GraphicsLayer) => {

        const layerRenderer = new FeatureLayer({
            url: "https://services.arcgis.com/ue9rwulIoeLEI9bj/ArcGIS/rest/services/Earthquakes/FeatureServer/0"
        });

        let graphLayer = new GraphicsLayer();

        const layerQuery = new FeatureLayer({
            url: "https://services.arcgis.com/ue9rwulIoeLEI9bj/ArcGIS/rest/services/Earthquakes/FeatureServer/0"
        });

        const map = new Map({
            basemap: "streets-night-vector",
            layers: [layerRenderer , graphLayer]
        });

        const view = new SceneView({
            map: map,
            container: "content",
            zoom: 5,
            center: [-95,40]
        });

        let query = layerQuery.createQuery();
        query.where = "MAGNITUDE > '4'";
        query.outFields = ['*'];
        query.returnGeometry = true;

        layerQuery.queryFeatures(query)
        .then(response =>{
            console.log(response);
            getResults(response.features);
        });

        function getResults(features){
            const symbol = {
                type: 'picture-marker',
                color: 'blue',
                size: 30
            };

            features.map(elem =>{
                elem.symbol = symbol;
            });

        graphLayer.addMany(features);
        }

        let simpleRenderer = {
            type: 'simple',
            symbol: {
                type: 'point-3d',
                symbolLayers: [
                    {
                        type: "object",
                        resource: {
                            primitive: "cylinder"
                        },
                        width: 1000
                    }
                ]
            },
            visualVariables: [
                {
                    type: "color",
                    field: "MAGNITUDE",
                    stops: [
                        {
                            value: 0.5,
                            color: "green",
                        },
                        {
                            value: 4.48,
                            color: "red"
                        }
                    ]
                },
                {
                    type: "size",
                    field: "DEPTH",
                    stops: [{
                        value: -3.39,
                        size: 1200
                    },
                    {
                        value: 30.97,
                        size: 120000
                    }]
                }
            ]
        };

        layerRenderer.renderer = simpleRenderer;
    });
