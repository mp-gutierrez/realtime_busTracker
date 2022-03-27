
//this is a placeholder accessToken, a new one can be obtained creating a free account at account.mapbox.com
mapboxgl.accessToken = 'pk.eyJ1IjoiZmx5bWFybGEiLCJhIjoiY2t2cjEwcngwN216ajJwbXNlY2J1d2g2MCJ9.1c4hqu3Yh2U1F9fFlVVSFA';

const geojson = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {
                "message": "Starting point",
                "iconSize": [50, 50]
            },
            "geometry": {
                "type": "Point",
                "coordinates": [-71.092761, 42.357575]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "message": "Destination",
                "iconSize": [50, 50]
            },
            "geometry": {
                "type": "Point",
                "coordinates": [-71.118476, 42.374860]
            }
        }
    ]
};

//creates a map centered between MIT and Harvard
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-71.104081, 42.365554],
    zoom: 13.8,
});

const busMarkers = {};

// this function pulls the function getBusLocations()
async function run(){
    const locations = await getBusLocations();
    console.log(new Date()) //it's good practice to write to the console a date stamp when you're trying to track how frequently something is being used
    console.log(locations);

    locations.forEach((bus) => {
        const el = document.createElement('div');
        el.className = 'bus';
        if(busMarkers[bus.id]) {
          busMarkers[bus.id].setLngLat([bus.attributes.longitude, bus.attributes.latitude]);
        } else {
            busMarkers[bus.id] = new mapboxgl.Marker(el)
            .setLngLat([bus.attributes.longitude, bus.attributes.latitude])
            .addTo(map);
        }
    });
    //timer
    setTimeout(run, 15000);
}


//this function reaches out and pulls the data programmatically
async function getBusLocations(){
    //we're using async so we can use fetch
    const url = "https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip"; 
    const response = await fetch(url); //the call is getting caught in the variable response
    //we are passing the url to fetch and waiting its response
    const json = await response.json();//here we"re waiting for the data within the response to be extracted
    return json.data; //here we"ll return the data to the calling function
}

run();
  
// Adds starting point and destination markers to the map
for (const marker of geojson.features) {
    const icon = document.createElement('div');
    const width = marker.properties.iconSize[0];
    const height = marker.properties.iconSize[1];
    icon.className = 'marker';
    icon.style.width = `${width}px`;
    icon.style.height = `${height}px`;
    icon.style.backgroundSize = '100%';

    icon.addEventListener('click', () => {
        window.alert(marker.properties.message);
    });

    // Add markers to the map.
    new mapboxgl.Marker(icon)
        .setLngLat(marker.geometry.coordinates)
        .addTo(map);
}