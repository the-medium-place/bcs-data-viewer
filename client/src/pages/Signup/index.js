import React, { useState, useEffect } from "react";
import AlertMessage from "../../components/AlertMessage";
import { Link } from "react-router-dom";

import { useMutation } from "@apollo/client";
import { ADD_USER } from "../../utils/mutations";

import logo2u from "../../assets/images/2uLogo.png";

import Auth from "../../utils/auth";
import "./style.css";

const Signup = () => {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    password: "",
    bcsEmail: "",
    bcsPassword: "",
  });
  const [sameInfoCheckbox, setSameInfoCheckbox] = useState(false);
  // const [errorMessage, setErrorMessage] = useState(null);
  const [showError, setShowError] = useState(false)
  const [addUser, { error, data }] = useMutation(ADD_USER);
  if (error) {
    console.log(JSON.stringify(error));
  }

  // update state based on form input changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  // const handleBcsInfoChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormState({
  //     ...formState,
  //     [name]: value
  //   })
  // }

  // useEffect(() => {


  // }, [sameInfoCheckbox])

  const handleSameInfoClick = (e) => {
    setSameInfoCheckbox(!sameInfoCheckbox);
    // if the user clicks the box, set bcslogin state to matching login values
    setFormState({
      ...formState,
      bcsEmail: !sameInfoCheckbox ? formState.email : "",
      bcsPassword: !sameInfoCheckbox ? formState.password : "",
    });

  };

  // submit form
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // console.log(formState);

    try {
      const { data } = await addUser({
        variables: { ...formState },
      });
      // console.log("create user post-data: ", data.addUser.token);

      Auth.login(data.addUser.token);
    } catch (err) {
      console.log(JSON.stringify(error));
      setShowError(true);
      console.error(err);
    }
  };

  return (
    <>
      <div className="d-flex w-100 justify-content-center mt-5">
        {showError ? (
          <AlertMessage color="danger" message={error.message} hideMethod={setShowError} />
        ) : null}
      </div>
      <div className="row main-signup-content bg-success text-center">
        <div className="col-md-2 text-center company__info">
          <div
            className="logo__wrapper p-2 d-flex justify-content-center align-items-center"
            style={{
              background: "white",
              borderRadius: "50%",
              aspectRatio: "1/1",
            }}
          >
            <img className="company__logo" src={logo2u} alt="2U Logo" />
          </div>
          {/* <h4 className="company_title">BCS Data Viewer</h4> */}
        </div>

        <div className="col-md-10 col-xs-12 col-sm-12 login_form ">
          <div className="container-fluid">
            <div className="row">
              <h2>Sign Up!</h2>
            </div>

            {/* <div className="row"> */}
            <form
              control=""
              className="form-group row"
              onSubmit={handleFormSubmit}
            >
              <div className="col-lg-6">
                <div className="row">
                  <input
                    required
                    className="form-input form__input"
                    placeholder="Your username"
                    autoComplete="username"
                    aria-label="name"
                    name="name"
                    type="text"
                    value={formState.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="row">
                  <input
                    required
                    className="form-input form__input"
                    placeholder="Your email"
                    aria-label="email"
                    name="email"
                    type="email"
                    value={formState.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="row">
                  {/* <!-- <span className="fa fa-lock"></span> --> */}
                  <input
                    required
                    className="form-input form__input"
                    placeholder="******"
                    autoComplete="new-password"
                    aria-label="password"
                    name="password"
                    type="password"
                    value={formState.password}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-lg-6 p-3 signup-bcs-info text-light rounded shadow">
                <div className="row">
                  <h3>BCS Information</h3>
                </div>
                <div className="row">
                  <label
                    className="form-check-label"
                    htmlFor="sameInfoCheckbox d-inline"
                  >
                    Use same info:
                  </label>
                  <input
                    className="d-inline form-check"
                    name="sameInfoCheckbox"
                    id="sameInfoCheckbox"
                    type="checkbox"
                    aria-label="Use same information for BCS and BCS Data Viewer"
                    checked={sameInfoCheckbox}
                    onChange={handleSameInfoClick}
                  />
                </div>
                <div className="row">
                  <input
                    required
                    className="form-input form__input"
                    placeholder="BCS Login Email"
                    aria-label="bootcamp spot email"
                    name="bcsEmail"
                    type="email"
                    readOnly={sameInfoCheckbox}
                    value={
                      !sameInfoCheckbox ? formState.bcsEmail : formState.email
                    }
                    onChange={handleChange}
                  />
                </div>
                <div className="row">
                  <input
                    required
                    className="form-input form__input"
                    placeholder="BCS Login Password"
                    aria-label="bootcamp spot password"
                    name="bcsPassword"
                    type="password"
                    readOnly={sameInfoCheckbox}
                    value={
                      !sameInfoCheckbox
                        ? formState.bcsPassword
                        : formState.password
                    }
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="row">
                <button
                  className="form-btn w-100"
                  style={{ cursor: "pointer" }}
                  type="submit"
                >
                  Submit
                </button>
              </div>
            </form>
            {/* </div> */}

            <div className="row">
              <p>
                Already have an account? <Link to="/login">Login Here</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
