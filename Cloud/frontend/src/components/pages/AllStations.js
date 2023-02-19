import React from 'react';
import { useNavigate } from 'react-router-dom';
import {ShowStations} from "../showStations";

export default function AllStations()
{
    const navigate = useNavigate();
    
    const handleBackButton = (e) => {
        e.preventDefault();
        console.log("Dentro handle back button");

        if(localStorage.length === 0)
            navigate("/");
        else
            navigate("/home");
    }
    
    return(
        <div className="">
            <div className='text-left mt-3 ml-5'>
                <button className="text-right" type="button" class="btn btn-secondary" onClick={handleBackButton}>Back</button>
            </div>
            <h1 className="title text-center">All Our Stations</h1>
            <div className="container mt-5">
                <h3 className="">Legend:</h3><br/>
                <p>
                    <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png" width="25" height="41"/> Alarmed stations
                    <br/>
                    <br/>
                    <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png" width="25" height="41"/> Normal stations
                    <br/>
                    <br/>
                    <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png" width="25" height="41"/> Your Station
                </p>
            </div>
            <ShowStations/>
        </div>
    )
}
