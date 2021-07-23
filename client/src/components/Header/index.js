import React from 'react'
import { Link } from 'react-router-dom';
import Auth from '../../utils/auth';


export default function Header() {
    return (
        <div className="Header p-2" style={{ background: 'lightgrey', width: '100vw' }}>
            <div className="row w-100">

                <h1 className="text-center text-bold w-100 p-2">BCS Data Viewer</h1>
            </div>
            <div className="row w-100">

                {Auth.loggedIn() ? (
                    <span className="d-block w-100 text-center"><a className="text-dark text-decoration-none" href="/">Home</a> | <a className="text-dark text-decoration-none" href="/me">Dashboard</a> | <span onClick={Auth.logout} style={{ cursor: "pointer" }}>Logout</span></span>) : null}
            </div>
        </div>
    )
}
