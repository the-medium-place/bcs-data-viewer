import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../../utils/mutations';
import Auth from '../../utils/auth';
import { Link } from 'react-router-dom';
import './style.css';
import logo2u from '../../assets/images/2uLogo.png'



export default function Login() {

    const [login, { error, data }] = useMutation(LOGIN_USER);
    const [loginState, setLoginState] = useState({
        name: '',
        password: ''
    })

    function handleInput(e) {
        const { name, value } = e.target;
        setLoginState({ ...loginState, [name]: value })
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        console.log(loginState);
        try {
            const { data } = await login({
                variables: { ...loginState },
            });
            console.log(data)
            Auth.login(data.login.token);
        } catch (e) {
            console.error(e);
        }

        // clear form values
        setLoginState({
            email: '',
            password: '',
        });
    };

    return (
        <>
            <div className="row main-content bg-success text-center">
                <div className="col-md-4 text-center company__info">
                    <div className="logo__wrapper p-2 d-flex justify-content-center align-items-center" style={{ background: 'white', borderRadius: '50%', aspectRatio: '1/1' }}>

                        <img className="company__logo" src={logo2u} alt="2U Logo" />
                    </div>

                    <h4 className="company_title">BCS Data Viewer</h4>
                </div>
                <div className="col-md-8 col-xs-12 col-sm-12 login_form ">
                    <div className="container-fluid">
                        <div className="row">
                            <h2>Log In</h2>
                        </div>
                        <div className="row">
                            <form control="" className="form-group" onSubmit={handleFormSubmit}>
                                <div className="row">
                                    <input className="form-input form__input"
                                        placeholder="Your username"
                                        aria-label="name"
                                        name="name"
                                        type="name"
                                        value={loginState.name}
                                        onChange={handleInput} />
                                </div>
                                <div className="row">
                                    {/* <!-- <span className="fa fa-lock"></span> --> */}
                                    <input className="form-input form__input"
                                        placeholder="******"
                                        aria-label="password"
                                        name="password"
                                        type="password"
                                        value={loginState.password}
                                        onChange={handleInput} />
                                </div>
                                <div className="row">
                                    {/* <input type="checkbox" name="remember_me" id="remember_me" className="" /> */}
                                    {/* <label for="remember_me">Remember Me!</label> */}
                                </div>
                                <div className="row">
                                    <button
                                        className="form-btn"
                                        style={{ cursor: 'pointer' }}
                                        type="submit"
                                    >
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div className="row">
                            <p>Don't have an account? <Link to="/signup">Register Here</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </>

    );
}
