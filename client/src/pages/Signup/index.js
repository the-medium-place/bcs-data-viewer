import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { useMutation } from '@apollo/client';
import { ADD_USER } from '../../utils/mutations';

import Auth from '../../utils/auth';
import './style.css';

const Signup = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    password: '',
    bcsEmail: '',
    bcsPassword: ''

  });
  const [sameInfoCheckbox, setSameInfoCheckbox] = useState(false);
  const [addUser, { error, data }] = useMutation(ADD_USER);

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
  //     bcsLoginInfo: {
  //       ...formState.bcsLoginInfo,
  //       [name]: value
  //     }
  //   })
  // }

  const handleSameInfoClick = (e) => {
    setSameInfoCheckbox(!sameInfoCheckbox)
    // if the user clicks the box, set bcslogin state to matching login values
    setFormState({
      ...formState,
      bcsEmail: !sameInfoCheckbox ? formState.email : '',
      bcsPassword: !sameInfoCheckbox ? formState.password : ''

    })
  }

  // submit form
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    console.log(formState);

    try {
      const { data } = await addUser({
        variables: { ...formState },
      });
      console.log("create user post-data: ", data.addUser.token)

      Auth.login(data.addUser.token);
    } catch (err) {
      console.log(JSON.stringify(error))
      console.error(err);
    }
  };

  return (
    <>
      <div className="row main-content bg-success text-center">

        <div className="col-md-2 text-center company__info">
          <span className="company__logo"><h2><span className="fa fa-android"></span></h2></span>
          <h4 className="company_title">BCS</h4>
        </div>

        <div className="col-md-10 col-xs-12 col-sm-12 login_form ">
          <div className="container-fluid">

            <div className="row">
              <h2>Sign Up!</h2>
            </div>

            {/* <div className="row"> */}
            <form control="" className="form-group row" onSubmit={handleFormSubmit}>
              <div className="col-lg-6">
                <div className="row">

                  <input
                    className="form-input form__input"
                    placeholder="Your username"
                    name="name"
                    type="text"
                    value={formState.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="row">
                  <input
                    className="form-input form__input"
                    placeholder="Your email"
                    name="email"
                    type="email"
                    value={formState.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="row">
                  {/* <!-- <span className="fa fa-lock"></span> --> */}
                  <input
                    className="form-input form__input"
                    placeholder="******"
                    name="password"
                    type="password"
                    value={formState.password}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="row">
                  <h3>BCS Information</h3>
                </div>
                <div className="row">
                  <label htmlhtmlFor="sameInfoCheckbox">
                    Use same Login info:
                  </label>
                  <input name="sameInfoCheckbox" id="sameInfoCheckbox" type="checkbox" checked={sameInfoCheckbox} onChange={handleSameInfoClick} />

                </div>
                <div className="row">
                  <input
                    className="form-input form__input"
                    placeholder="BCS Login Email"
                    name="bcsEmail"
                    type="email"
                    readOnly={sameInfoCheckbox}
                    value={!sameInfoCheckbox ? formState.bcsEmail : formState.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="row">
                  <input
                    className="form-input form__input"
                    placeholder="******"
                    name="bcsPassword"
                    type="password"
                    readOnly={sameInfoCheckbox}
                    value={!sameInfoCheckbox ? formState.bcsPassword : formState.password}
                    onChange={handleChange}
                  />
                </div>

              </div>


              <div className="row">
                <button
                  className="form-btn w-100"
                  style={{ cursor: 'pointer' }}
                  type="submit"
                >
                  Submit
                </button>
              </div>
            </form>
            {/* </div> */}

            <div className="row">
              <p>Already have an account?  <Link to="/login">Login Here</Link></p>
            </div>

          </div>
        </div>
      </div>
    </>

  );

  // return (
  //   <main className="Signup">
  //     <div className="">
  //       <div className="">
  //         <h4 className="">Sign Up</h4>
  //         <div className="">
  //           {data ? (
  //             <p>
  //               Success! You may now head{' '}
  //               <Link to="/">back to the homepage.</Link>
  //             </p>
  //           ) : (
  //             <form onSubmit={handleFormSubmit}>
  //               <input
  //                 className="form-input"
  //                 placeholder="Your username"
  //                 name="name"
  //                 type="text"
  //                 value={formState.name}
  //                 onChange={handleChange}
  //               />
  //               <br />
  //               <input
  //                 className="form-input"
  //                 placeholder="Your email"
  //                 name="email"
  //                 type="email"
  //                 value={formState.email}
  //                 onChange={handleChange}
  //               />
  //               <br />
  //               <input
  //                 className="form-input"
  //                 placeholder="******"
  //                 name="password"
  //                 type="password"
  //                 value={formState.password}
  //                 onChange={handleChange}
  //               />
  //               <hr />
  //               <h3>Your BCS Login Information (required)</h3>
  //               <label htmlhtmlFor="sameInfoCheckbox">
  //                 Use the Same info:
  //               </label>
  //               <input name="sameInfoCheckbox" id="sameInfoCheckbox" type="checkbox" checked={sameInfoCheckbox} onChange={handleSameInfoClick} />
  //               <br />
  //               <input
  //                 className="form-input"
  //                 placeholder="BCS Login Email"
  //                 name="bcsEmail"
  //                 type="email"
  //                 readOnly={sameInfoCheckbox}
  //                 value={!sameInfoCheckbox ? formState.bcsEmail : formState.email}
  //                 onChange={handleChange}
  //               />
  //               <br />
  //               <input
  //                 className="form-input"
  //                 placeholder="******"
  //                 name="bcsPassword"
  //                 type="password"
  //                 readOnly={sameInfoCheckbox}
  //                 value={!sameInfoCheckbox ? formState.bcsPassword : formState.password}
  //                 onChange={handleChange}
  //               />
  //               <button
  //                 className="btn btn-block btn-info"
  //                 style={{ cursor: 'pointer' }}
  //                 type="submit"
  //               >
  //                 Submit
  //               </button>
  //             </form>
  //           )}

  //           {error && (
  //             <div className="my-3 p-3 bg-danger text-white">
  //               {error.message}
  //             </div>
  //           )}
  //         </div>
  //       </div>
  //     </div>
  //   </main>
  // );
};

export default Signup;

