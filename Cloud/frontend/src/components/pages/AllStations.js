import React from 'react';
import { useNavigate } from 'react-router-dom';
import {ShowStations} from "../showStations";

export default function AllStations()
{
    const navigate = useNavigate();
    
    const handleBackButton = (e) => {
        e.preventDefault();
        console.log("Dentro handle back button");

        if(localStorage.length == 0)
            navigate("/");
        else
            navigate("/home");
    }
    
    return(
        <div className="text-center">
            <div className='text-left mt-3 ml-5'>
                <button className="text-right" type="button" class="btn btn-secondary" onClick={handleBackButton}>Back</button>
            </div>
            <h1 className="title home-page-title">All Our Stations</h1>
            <ShowStations/>
        </div>
    )
}
