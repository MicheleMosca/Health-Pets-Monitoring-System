import React from 'react';
import {MapContainer, Marker, Popup, TileLayer, Circle, useMapEvent} from "react-leaflet";
import L from 'leaflet';

import { environment } from './constants';

function SetViewOnClick() {
    const map = useMapEvent('click', (e) => {
        map.setView(e.latlng, map.getZoom())
    })

    return null
}

export class ShowStations extends React.Component
{
    constructor(props) {
        super(props);

        this.state = {
            markers: [],
            HeaderStyle: {
                height: '700px',
                margin: '50px'
            },
            redIcon: new L.Icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            }),
            blueIcon: new L.Icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            }),
            greenIcon: new L.Icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            })
        };

        fetch(environment.site+'/api/allStations', {method: 'GET'}).then((response) => {
            if(!response.ok) throw new Error(response.status);
            return response.json();
        }).then((myJson) => {
            console.log("Response: " + myJson[0]['id'] + " " + myJson[0]['latitude'] + " " + myJson[0]['longitude'] + " " + myJson[0]['alarmed']);
            this.setState({markers: myJson});
        })
    }

    render()
    {
        const markers = [];
        let mapPosition = this.props.center;
        let mapZoom = this.props.zoom;

        if (!mapPosition)
            mapPosition = [44.62970, 10.94958];

        if (!mapZoom)
            mapZoom = 16;

        for (let i = 0; i < this.state.markers.length; i++)
        {
            let position = [this.state.markers[i]['latitude'], this.state.markers[i]['longitude']];
            let color = this.state.blueIcon;
            let circles = [];

            if (this.state.markers[i]['alarmed'] === 'True') {
                color = this.state.redIcon;

                circles.push(
                    <Circle
                        center={position}
                        pathOptions={{ fillColor: 'red' }}
                        radius={50}
                        stroke={false}
                    />
                )
            }

            if (this.state.markers[i]["id"] === this.props.station_id)
                color = this.state.greenIcon;

            markers.push(
                <Marker position={position} icon={color}>
                    <Popup>
                        <h6>Station #{this.state.markers[i]["id"]}</h6> Latitude: {this.state.markers[i]["latitude"]} <br/> Longitude {this.state.markers[i]["longitude"]}.
                    </Popup>
                    {circles}
                </Marker>
            );
        }

        return(
            <MapContainer style={this.state.HeaderStyle} center={mapPosition} zoom={mapZoom} scrollWheelZoom={true}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <SetViewOnClick/>
                {markers}
            </MapContainer>
        );
    }
}