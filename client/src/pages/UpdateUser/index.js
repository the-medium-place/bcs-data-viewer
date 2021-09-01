import React, { useEffect, useState } from 'react'
import Auth from '../../utils/auth';
import { useQuery } from '@apollo/client';
import { useMutation } from '@apollo/client';
import { UPDATE_USER } from '../../utils/mutations';

import { GET_ME } from '../../utils/queries';
import NotLoggedIn from '../../components/NotLoggedIn';

export default function UpdateUser() {

    const [passwordType, setPasswordType] = useState("password")
    const [eyeIcon, setEyeIcon] = useState("eye");

    const { loading, error, data } = useQuery(
        GET_ME
    );
    if (error) { console.log(JSON.stringify(error)) }

    const [updateUser, { error: updateError, data: updateData }] = useMutation(UPDATE_USER);
    if (updateError) { console.log(JSON.stringify(updateError)) }

    const loggedInUser = data?.me || null;
    // console.log(loggedInUser)
    // console.log(Auth.getProfile())
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

    const handleUsernameChange = (e) => {
        const { value } = e.target;

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
            console.log(data)
            alert("Info Successfully Updated! Returning to Cohort Select page.")
            Auth.login(data.updateUser.token);
        } catch (e) {
            console.error(e);
        }
    }

    const handleRestoreValues = (e) => {
        e.preventDefault();
        setModifiableFormData(bcsFormData)
    }


    return (
        <div className="UpdateUser">
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
                        <div className="mb-3 form-group input-group">
                            <label htmlFor="bcs-password">BCS Password:</label>

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
                    <div className="button-group justify-content-center d-flex">

                        <input type="submit" value="Save Changes" className="btn btn-lg bg-bcs text-light" />
                        <input type="button" value="Restore Values" className="btn btn-lg bg-secondary text-light" onClick={handleRestoreValues} />
                    </div>
                </form>

            ) :
                error ? <NotLoggedIn /> :
                    <NotLoggedIn />
            }
        </div>
    )
}
