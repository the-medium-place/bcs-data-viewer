import React from 'react'
import { Link } from 'react-router-dom'

export default function Splash() {
    return (
        <div className="Splash">
            <Link to="/login">Login</Link>
            <br />
            <Link to="/signup">Register</Link>
        </div>
    )
}
