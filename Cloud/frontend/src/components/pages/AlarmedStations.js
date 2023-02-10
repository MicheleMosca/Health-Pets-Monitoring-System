import {React, useEffect} from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'

export default function AlarmedStations() {

    // useEffect(()=>{
    //     if(localStorage.getItem("authenticated") !== 'true'){
    //         console.log("devo tornare in login")
    //         navigate("/login");
    //         console.log("fatto")
    //     }
    // });

    useEffect(() => {
        console.log("ciao")
    }, []);

    const HeaderStyle = {
        height: '600px',
    }

    const position = [51.505, -0.09]

    return(
        <div className="text-center">
            <h1 className="main-title home-page-title">Alarmed Stations</h1>
            <MapContainer style={HeaderStyle} center={position} zoom={50} scrollWheelZoom={true}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position}>
                    <Popup>
                        A pretty CSS3 popup. <br /> Easily customizable.
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    )
}
