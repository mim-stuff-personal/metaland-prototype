mapboxgl.accessToken = 'pk.eyJ1Ijoiamlob29ucGFyayIsImEiOiJja2h6djd6aTcwbzN1MzRvYXM0a25sMGQ4In0.wW1kvXU8R_sn0PUMh6nmIA';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/jihoonpark/ckssk2lbdtllk17lytxaqjevr',
    center: [126.99017577700266, 37.55397103093888],
    zoom: 14,
    maxZoom: 18,
    minZoom: 10,
    pitch: 55,
    bearing: 0,
    antialias: true
});

// Fly to Song-Do
document.getElementById('flysd').addEventListener('click', () => {
    map.flyTo({
        center: [126.6480101000828, 37.38264755320518],
        essential: true
    });
});

// Fly to a Jung-Gu
document.getElementById('flyjg').addEventListener('click', () => {
    map.flyTo({
        center: [126.99017577700266, 37.55397103093888],
        essential: true
    });
});

// Change basemap style
const layerList = document.getElementById('menu');
const inputs = layerList.getElementsByTagName('input');

for (const input of inputs) {
    input.onclick = (layer) => {
        const layerId = layer.target.id;
        map.setStyle('mapbox://styles/jihoonpark/' + layerId);
    };
}

// Disable map rotation with mouse rmb and touch
map.dragRotate.disable();
map.touchZoomRotate.disableRotation();

// Map navigation controls
map.addControl(new mapboxgl.NavigationControl());

// JG lot polygon data
map.on('load', () => {
    map.addSource('metaland-jg-sd-land', {
        type: 'vector',
        url: 'mapbox://jihoonpark.610jsxws'
    });

    map.addLayer({
        'id': 'jg-sd-land',
        'type': 'fill',
        'source': 'metaland-jg-sd-land',
        'source-layer': 'jg_sd_land_mb',
        'paint': {
            "fill-opacity": {
                'base': 0.25,
                'stops': [
                    [16, 0.25],
                    [18, 0.45]
                ]
            },
            'fill-color': [
                'case',
                ['boolean',
                    ['feature-state', 'hover'],
                    false
                ],
                '#573941', '#301f24'
            ]
        },
    });
});

// Popup on click
map.on('click', 'jg-sd-land', e => {
    new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(
            '<h1>' + 'Land ID ' +
            e.features[0].properties.fid +
            '</h1>' +
            '<h2>' + '₩ ' +
            e.features[0].properties.value +
            '</h2>' +
            '<h3>Owner ID</h3>' +
            '<h4>' + '₩' +
            e.features[0].properties.unitvalue + '/unit' +
            '</h4>' +
            '<h5>' +
            e.features[0].properties.unit + ' units' +
            '</h5>' +
            '<h6>TO LET</h6>')
        .addTo(map);
});

// Hover JG land to highlight
let landID = null;

map.on('mousemove', 'jg-sd-land', (e) => {
    if (e.features.length > 0) {
        if (landID !== null) {
            map.setFeatureState(
                {
                    source: 'metaland-jg-sd-land',
                    sourceLayer: 'jg_sd_land_mb',
                    id: landID
                },
                {
                    hover: false
                }
            );
        }
        landID = e.features[0].id;
        map.setFeatureState(
            {
                source: 'metaland-jg-sd-land',
                sourceLayer: 'jg_sd_land_mb',
                id: landID
            },
            {
                hover: true
            }
        );
    }
});

map.on('mouseleave', 'metaland-jg-sd-land', () => {
    if (landID !== null) {
        map.setFeatureState(
            {
                source: 'metaland-jg-sd-land',
                sourceLayer: 'jg_sd_land_mb',
                id: landID
            },
            {
                hover: false
            }
        );
    }
    landID = null;
});

// JG land boundary line data
map.on('load', () => {
    map.addSource('metaland-jg-sd-land-outline', {
        type: 'vector',
        url: 'mapbox://jihoonpark.0hrolx25'
    });
    map.addLayer({
        'id': 'jg-sd-land-outline',
        'type': 'line',
        'source': 'metaland-jg-sd-land-outline',
        'source-layer': 'jg_sd_landbndry_mb',
        'paint': {
            'line-color': '#9d9d9d',
            'line-opacity': 0.9,
            'line-width': {
                'base': 0,
                'stops': [
                    [12, 0.5],
                    [15, 0.75],
                    [17, 1.25]
                ]
            }
        },
    });
});

// JG building polygon data

// map.on('load', () => {
//     map.addSource('metaland-jg-sd-bld', {
//         type: 'vector',
//         url: 'mapbox://jihoonpark.0y2txant'
//     });
//     map.addLayer({
//         'id': 'jg-sd-bld',
//         'type': 'fill-extrusion',
//         'source': 'metaland-jg-sd-bld',
//         'source-layer': 'jg_sd_bld_mb',
//         'paint': {
//             'fill-extrusion-color': '#ffffff',
//             'fill-extrusion-height': ['get', 'GRO_FLO_CO'],
//             'fill-extrusion-opacity': 0.55
//         },
//     });
// });

map.on('load', () => {
    map.addSource('metaland-jg-sd-bld', {
        type: 'vector',
        url: 'mapbox://jihoonpark.0y2txant'
    });
    map.addLayer({
        'id': 'jg-sd-bld',
        'type': 'fill-extrusion',
        'source': 'metaland-jg-sd-bld',
        'source-layer': 'jg_sd_bld_mb',
            'paint': {
                'fill-extrusion-color': '#eed247',
                'fill-extrusion-height': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    14,
                    0,
                    14.05,
                    ['get', 'NEW_FLO_CO']
                ],
                'fill-extrusion-opacity': 0.45
            }
        },
    );
});