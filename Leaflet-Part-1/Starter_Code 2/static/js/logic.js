var map = L.map('map').setView([20,-10], 2);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="  https://www.openstreetmap.org/#map=4/38.03/-106.83&layers=P]">OpenStreetMap</a> contributors'
}).addTo(map);

url="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson"

d3.json(url).then(data=>{
    console.log(data.features[100].properties)

    L.geoJSON(data, {
        style: function (feature)
        {
            let mag= feature.properties.mag;
            let depth= feature.geometry.coordinates[2];

            return {
                color:"black", 
                weight:1,
                radius:mag*1.5,
                fillOpacity:.5,
                fillColor:"green",
                fillColor:
                    depth>90 ? "red" :
                    depth>70 ? "darkorange" :
                    depth>50 ? "orange" :
                    depth>30 ? "yellow" :
                    depth>10 ? "lime" : "green"
            };
        },
        
        pointToLayer: function(data, latlng) {
            return L.circleMarker(latlng);
        }

    }).bindPopup(function (layer) {

        let {mag, place,time} = layer.feature.properties;
        let date= new Date(time).toLocaleString();

        console.log(date);
        return `<h3>${place.toUpperCase()}<hr>Magnitude: ${mag}<br>${date}</h3>`
    }).addTo(map);
});

let legend= L.control({position:"bottomright"});
legend.onAdd=()=>{
    let div=L.DomUtil.create("div","legend");
    div.innerHTML=`
        <i style="background:green"> </i> -10-10 <br>
        <i style="background:lime"> </i> 10-30 <br>
        <i style="background: yellow"> </i> 30-50 <br>
        <i style="background: orange"> </i> 50-70 <br>
        <i style="background: darkorange"> </i> 70-90 <br>
        <i style="background:red"> </i> 90+ <br>
    `;
    return div   
}

legend.addTo(map)
