import React from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';


export function Home(){

    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/sign');
    };
    return (
        <div>
            <h1 className= "left-margin" style={{ color: "blue" }}>Home</h1><br /><br />
                <div className="App">
                
                <div>
                    <button className="btn btn-success" onClick={()=> navigate('/task')}>  Tasks  </button><br/><br/>
                    <button className="btn btn-primary" onClick={() => handleLogout()}> log out</button>
                </div>
            </div>
        </div>
        
    );
}