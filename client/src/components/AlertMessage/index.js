import React from 'react'

export default function AlertMessage({ color, heading, message, footer, hideMethod, showError }) {
    return (
        <div className={`toast align-items-center text-white bg-${color} border-0 show`} role="alert" aria-live="assertive" aria-atomic="true">
            <div className="d-flex">
                <div className="toast-body">
                    {message}
                </div>
                <button onClick={() => hideMethod(false)} type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    )
}
