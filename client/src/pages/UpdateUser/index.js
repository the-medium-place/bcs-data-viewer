import React, { useEffect, useState } from 'react'
import Auth from '../../utils/auth';
import { useQuery } from '@apollo/client';
import { useMutation } from '@apollo/client';
import { UPDATE_USER } from '../../utils/mutations';

import { GET_ME } from '../../utils/queries';
import NotLoggedIn from '../../components/NotLoggedIn';
import AlertMessage from '../../components/AlertMessage';




export default function UpdateUser() {

    const [passwordType, setPasswordType] = useState("password")
    const [eyeIcon, setEyeIcon] = useState("eye");
    const [errorMessage, setErrorMessage] = useState("There was a server error...");
    const [showError, setShowError] = useState(false);

    const { loading, error, data } = useQuery(
        GET_ME
    );
    if (error) {
        console.log(JSON.stringify(error))
    }

    const [updateUser, { error: updateError, data: updateData }] = useMutation(UPDATE_USER);
    if (updateError) {
        console.log(updateError.message)
        // if (!errorMessage) { setErrorMessage(updateError.message) }
        // if (!showError) { setShowError(true) }
        // setErrorMessage(updateError.message);
        // setShowError(true);
    }

    const loggedInUser = data?.me || null;

    const [bcsFormData, setBcsFormData] = useState({
        name: '',
        email: '',
        bcsEmail: '',
        bcsPassword: ''
    })

    const [modifiableFormData, setModifiableFormData] = useState({
        name: '',
        email: '',
        bcsEmail: '',
        bcsPassword: ''
    })

    useEffect(() => {
        if (loggedInUser) {
            const userData = {
                name: loggedInUser.name,
                email: loggedInUser.email,
                bcsEmail: loggedInUser.bcsLoginInfo.bcsEmail,
                bcsPassword: loggedInUser.bcsLoginInfo.bcsPassword
            }
            setBcsFormData(userData)
            setModifiableFormData(userData)
        }
        // console.log(bcsFormData)
    }, [loggedInUser])

    const handleShowPassword = () => {
        if (passwordType === 'password') {
            setPasswordType('text');
            setEyeIcon('eye-slash')
        } else {
            setPasswordType('password');
            setEyeIcon('eye')
        }
    }

    const handleInput = (e) => {
        const { name, value } = e.target;

        setModifiableFormData({ ...modifiableFormData, [name]: value })
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        // console.log(bcsFormData)
        const { name, email, bcsEmail, bcsPassword } = modifiableFormData;
        try {
            const { data } = await updateUser({
                variables: {
                    name,
                    email,
                    bcsEmail,
                    bcsPassword
                },
            });
            // console.log(data)
            alert("Info Successfully Updated! Returning to Cohort Select page.")
            Auth.login(data.updateUser.token);
        } catch (e) {
            setErrorMessage(e.message)
            setShowError(true);
            console.error(e);
        }
    }

    const handleRestoreValues = (e) => {
        e.preventDefault();
        setModifiableFormData(bcsFormData)
    }


    return (
        <div className="UpdateUser">
            <div className="d-flex flex-column justify-content-center align-items-center mt-5">
                <h3>Update User Info</h3>
                {/* <p className="lead text-danger">{errorMessage}</p> */}
                {/* <button onClick={() => setShowError(true)}>open it</button> */}
                {showError ? (

                    <AlertMessage color="danger" message={updateError ? updateError.message : error ? error.message : 'There was a server error...'} hideMethod={setShowError} />
                ) : null}

            </div>
            {loading ? <p>loading...</p> : data ? (
                <form autoComplete="false" className="row mt-5 border-bcs rounded p-3" onSubmit={handleFormSubmit}>
                    <div className="col-12 col-md-6 form-group">
                        <label htmlFor="user-name">Username:</label>
                        <input id="user-name" onChange={handleInput} name="name" className="input form-control mb-3" type="text" value={modifiableFormData.name} />
                        <label htmlFor="user-email">Email:</label>
                        <input id="user-email" onChange={handleInput} name="email" className="input form-control mb-3" type="text" value={modifiableFormData.email} />
                    </div>
                    <div className="col-12 col-md-6 bg-bcs rounded shadow shadow-sm p-3 text-light mb-3">
                        <div className="form-group mb-3">
                            <label htmlFor="bcs-email">BCS Email:</label>

                            <input
                                className="input form-control"
                                type="text"
                                name="bcsEmail"
                                id="bcs-email"
                                value={modifiableFormData.bcsEmail}
                                onChange={handleInput}
                            />
                        </div>
                        <label htmlFor="bcs-password">BCS Password:</label>
                        <div className="mb-3 form-group input-group">

                            <input
                                onChange={handleInput}
                                name="bcsPassword"
                                type={passwordType}
                                value={modifiableFormData.bcsPassword}
                                className="input form-control"
                                id="bcs-password"
                                // aria-label="password"
                                aria-describedby="basic-addon1"
                            />
                            <div className="input-group-append">
                                <span className="input-group-text">
                                    <i
                                        onClick={handleShowPassword}
                                        className={`bi-${eyeIcon}-fill`}>
                                    </i>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="justify-content-center d-flex">

                        <input type="submit" value="Save Changes" className="btn btn-lg bg-bcs text-light m-1" />
                        <input type="button" value="Restore Values" className="btn btn-lg bg-secondary text-light m-1" onClick={handleRestoreValues} />
                    </div>
                </form>

            ) :
                error ? <NotLoggedIn /> :
                    <NotLoggedIn />
            }
        </div>
    )
}
