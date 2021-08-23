mapboxgl.accessToken = 'pk.eyJ1Ijoiamlob29ucGFyayIsImEiOiJja2h6djd6aTcwbzN1MzRvYXM0a25sMGQ4In0.wW1kvXU8R_sn0PUMh6nmIA';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/jihoonpark/cksh7fldu247u17luwpyv3qax',
    center: [126.99017577700266, 37.55397103093888],
    zoom: 14,
    maxZoom: 19,
    minZoom: 14,
    pitch: 45,
    bearing: 0
});

// Disable map rotation with mouse rmb and touch
map.dragRotate.disable();
map.touchZoomRotate.disableRotation();

// Map navigation controls
map.addControl(new mapboxgl.NavigationControl());

// JG lot polygon data
map.on('load', () => {
    map.addSource('metaland-jg-land-cleaned', {
        type: 'vector',
        url: 'mapbox://jihoonpark.asfot8bv'
    });

    map.addLayer({
        'id': 'jg-land-cleaned',
        'type': 'fill',
        'source': 'metaland-jg-land-cleaned',
        'source-layer': 'jg_land_cleaned',
        'paint': {
            "fill-opacity": {
                'base': 0.65,
                'stops': [
                    [16, 0.65],
                    [18, 0.85]
                ]
            },
            'fill-color': [
                'case',
                ['boolean',
                    ['feature-state', 'hover'],
                    false
                ],
                '#9d9d9d', '#bfd7fd'
            ]
        },
    });
});

// Popup on click
map.on('click', 'jg-land-cleaned', e => {
    new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(
            '<h1>' + 'Land ID ' +
            e.features[0].properties.fid +
            '</h1>' +
            '<h2>' + '₩' +
            e.features[0].properties.A9 +
            '</h2>' +
            '<h3>Owner ID</h3>' +
            '<h4>' + '₩' +
            e.features[0].properties.thrsqmp + '/평' +
            '</h4>' +
            '<h5>' + '₩' +
            e.features[0].properties.AREA +
            '</h5>' +
            '<h6>TO LET</h6>')

        .addTo(map);
});

// Hover JG land to highlight
let landID = null;

map.on('mousemove', 'jg-land-cleaned', (e) => {
    if (e.features.length > 0) {
        if (landID !== null) {
            map.setFeatureState(
                {
                    source: 'metaland-jg-land-cleaned',
                    sourceLayer: 'jg_land_cleaned',
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
                source: 'metaland-jg-land-cleaned',
                sourceLayer: 'jg_land_cleaned',
                id: landID
            },
            {
                hover: true
            }
        );
    }
});

map.on('mouseleave', 'jg-land-cleaned', () => {
    if (landID !== null) {
        map.setFeatureState(
            {
                source: 'metaland-jg-land-cleaned',
                sourceLayer: 'jg_land_cleaned',
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
    map.addSource('metaland-jg-land-outline', {
        type: 'vector',
        url: 'mapbox://jihoonpark.2w2mdr97'
    });
    map.addLayer({
        'id': 'jg-land-outline',
        'type': 'line',
        'source': 'metaland-jg-land-outline',
        'source-layer': 'jg_land_cleaned_outline',
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