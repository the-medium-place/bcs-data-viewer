import React from 'react'
import { Link } from 'react-router-dom'

export default function NotLoggedIn() {
    return (
        <div className="NotLoggedIn w-100 row d-flex justify-content-center">
            <div className="w-75 border rounded my-5 shadow shadow-sm text-center p-3">
                <h3>
                    Your token has expired! Please <Link to="/login">Login</Link> to continue working...
                </h3>
            </div>

        </div>
    )
}
