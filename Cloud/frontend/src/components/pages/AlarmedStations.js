import {React, useEffect, useState} from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet';

export default function AlarmedStations() {

    // useEffect(()=>{
    //     if(localStorage.getItem("authenticated") !== 'true'){
    //         console.log("devo tornare in login")
    //         navigate("/login");
    //         console.log("fatto")
    //     }
    // });

    let [marker, setMarker] = useState([]);

    let redIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    useEffect(() => {
        console.log("ciao")

        fetch('/api/alarmedStations', {method: 'GET'}).then((response) => {
            if(!response.ok) throw new Error(response.status);
            return response.json();
        }).then((myJson) => {
            console.log("Response: " + myJson[0]['id'] + " " + myJson[0]['latitude'] + " " + myJson[0]['longitude']);
            let stations = [myJson[0]['latitude'], myJson[0]['longitude']];
            console.log(stations)
            let arr = [];
            for (const station of stations) {
                arr.push((<Marker position={stations} icon={redIcon}>
                    <Popup>
                        <h6>Station #1</h6> Latitude: {stations[0]} <br/> Longitude {stations[1]}.
                    </Popup>
                </Marker>));
            }
            setMarker(arr);
            console.log('MARKER: ', marker)
        })
    }, []);

    const HeaderStyle = {
        height: '700px'
    }

    const position = [44.6389, 10.94452]

    return(
        <div className="text-center">
            <h1 className="title home-page-title">Alarmed Stations</h1>
            <MapContainer style={HeaderStyle} center={position} zoom={50} scrollWheelZoom={true}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {marker}
            </MapContainer>
        </div>
    )
}
