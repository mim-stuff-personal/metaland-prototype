mapboxgl.accessToken = 'pk.eyJ1Ijoiamlob29ucGFyayIsImEiOiJja2h6djd6aTcwbzN1MzRvYXM0a25sMGQ4In0.wW1kvXU8R_sn0PUMh6nmIA';
const map = new mapboxgl.Map({
    container: 'map',
    // style: 'mapbox://styles/jihoonpark/ckssk2lbdtllk17lytxaqjevr',
    style: 'mapbox://styles/jihoonpark/cktfhrvle3ate17lict68x8xn',
    center: [126.99017577700266, 37.55397103093888],
    zoom: 14,
    maxZoom: 22,
    minZoom: 10,
    pitch: 55,
    bearing: 0,
    antialias: true
});

// Map navigation controls
map.addControl(
    new mapboxgl.NavigationControl());

// Toggle Satellite View
map.on('load', function(){
    var switchy = document.getElementById('togglesat');
    switchy.addEventListener("click", function(){
        switchy = document.getElementById('togglesat');
        if (switchy.className === 'on') {
            switchy.setAttribute('class', 'off');
            map.setLayoutProperty('satellite-saturated', 'visibility', 'none');
            switchy.innerHTML = 'ENABLE SATELLITE VIEW';
        } else {
            switchy.setAttribute('class', 'on');
            map.setLayoutProperty('satellite-saturated', 'visibility', 'visible');
            switchy.innerHTML = 'DISABLE SATELLITE VIEW';
        }
    });
});

// Fly to Song-Do
document.getElementById('flysd').addEventListener('click', () => {
    map.flyTo({
        center: [126.6480101000828, 37.38264755320518],
        essential: true
    });
});

// Fly to Jung-Gu
document.getElementById('flyjg').addEventListener('click', () => {
    map.flyTo({
        center: [126.99017577700266, 37.55397103093888],
        essential: true
    });
});

// Disable map rotation with mouse rmb and touch
// map.dragRotate.disable();
// map.touchZoomRotate.disableRotation();

// JG land polygon data
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
                'base': 0.35,
                'stops': [
                    [16, 0.35],
                    [17, 0.65]
                ]
            },
            'fill-color': [
                'case',
                ['boolean',
                    ['feature-state', 'hover'],
                    false
                ],
                '#7d7d7d' , '#373b48'
            ]
        },
    });
});

// map.on('click', 'jg-sd-land', (e) => {
//     map.flyTo({
//         center: e.features[0].geometry.coordinates
//     });
// });

// Popup on click
map.on('click', 'jg-sd-land', e => {
    new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(
            '<h1>' + '#' + e.features[0].properties.fid + '</h1>' +
            '<h3>Owner </h3>' + '<h2>Spongebob</h2>' + '<hr class="solid-border">' +
            '<h3>Total Value</h3>' + '<h2>' + e.features[0].properties.value_ml + ' MLND' + '</h2>' + '<hr class="solid-border">' +
            '<h3>Unit Value</h3>' + '<h2>' + e.features[0].properties.uvalue_ml + ' MLND' +'</h2>' + '<hr class="solid-border">' +
            '<h3>Area</h3>' + '<h2>' + e.features[0].properties.area_ml + ' Units' + '</h2>' + '<hr class="solid-border">')
        .addTo(map);
});

// Hover land to highlight
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

map.on('mouseleave', 'jg-sd-land', () => {
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

// ROI land boundary line data
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
                    [12, 0.15],
                    [15, 0.35],
                    [17, 0.6]
                ]
            }
        },
    });
});

// ROI building polygon data
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
                'fill-extrusion-color': '#8297ec',
                'fill-extrusion-height': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    14,
                    0,
                    14.05,
                    ['get', 'NEW_FLO_CO']
                ],
                'fill-extrusion-opacity': {
                    'base': 0.95,
                    'stops': [
                        [16, 0.75],
                        [18, 0.15]
                    ]
            }
        },}
    );
});