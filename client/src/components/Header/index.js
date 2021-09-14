import React from 'react'
import Auth from '../../utils/auth';


export default function Header() {

    const loggedInUser = Auth.loggedIn() ? Auth.getProfile() : null;


    return (
        <nav className="Header p-2 navbar bg-bcs text-light shadow shadow-sm">
            <div className="container-fluid d-flex justify-content-start pe-5" >
                <span className="navbar-brand mb-0 h1">BCS Data Viewer</span>

                <div className="nav-item dropdown ms-auto">
                    <span className="nav-link dropdown-toggle text-light" id="navbarScrollingDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        {loggedInUser ? loggedInUser.data.name : 'Welcome!'}
                    </span>
                    <ul className="dropdown-menu">
                        {loggedInUser ? (
                            <>
                                <li><a className="dropdown-item" href="/">Home</a></li>
                                <li><a className="dropdown-item" href="/me">Cohort Select</a></li>
                                <li><a className="dropdown-item" href="/updateuser">Update User Info</a></li>
                                <li><span className="dropdown-item" onClick={Auth.logout}>Logout</span></li>
                            </>
                        ) : (
                            <>
                                <li><a className="dropdown-item" href="/login">Login</a></li>
                                <li><a className="dropdown-item" href="/signup">Register</a></li>
                            </>
                        )}
                    </ul>

                </div>
            </div>
        </nav>
    )
}
