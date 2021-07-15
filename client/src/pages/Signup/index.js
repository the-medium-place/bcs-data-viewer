import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { useMutation } from '@apollo/client';
import { ADD_USER } from '../../utils/mutations';

import Auth from '../../utils/auth';

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
    <main className="Signup">
      <div className="">
        <div className="">
          <h4 className="">Sign Up</h4>
          <div className="">
            {data ? (
              <p>
                Success! You may now head{' '}
                <Link to="/">back to the homepage.</Link>
              </p>
            ) : (
              <form onSubmit={handleFormSubmit}>
                <input
                  className="form-input"
                  placeholder="Your username"
                  name="name"
                  type="text"
                  value={formState.name}
                  onChange={handleChange}
                />
                <br />
                <input
                  className="form-input"
                  placeholder="Your email"
                  name="email"
                  type="email"
                  value={formState.email}
                  onChange={handleChange}
                />
                <br />
                <input
                  className="form-input"
                  placeholder="******"
                  name="password"
                  type="password"
                  value={formState.password}
                  onChange={handleChange}
                />
                <hr />
                <h3>Your BCS Login Information (required)</h3>
                <label htmlFor="sameInfoCheckbox">
                  Use the Same info:
                </label>
                <input name="sameInfoCheckbox" id="sameInfoCheckbox" type="checkbox" checked={sameInfoCheckbox} onChange={handleSameInfoClick} />
                <br />
                <input
                  className="form-input"
                  placeholder="BCS Login Email"
                  name="bcsEmail"
                  type="email"
                  readOnly={sameInfoCheckbox}
                  value={!sameInfoCheckbox ? formState.bcsEmail : formState.email}
                  onChange={handleChange}
                />
                <br />
                <input
                  className="form-input"
                  placeholder="******"
                  name="bcsPassword"
                  type="password"
                  readOnly={sameInfoCheckbox}
                  value={!sameInfoCheckbox ? formState.bcsPassword : formState.password}
                  onChange={handleChange}
                />
                <button
                  className="btn btn-block btn-info"
                  style={{ cursor: 'pointer' }}
                  type="submit"
                >
                  Submit
                </button>
              </form>
            )}

            {error && (
              <div className="my-3 p-3 bg-danger text-white">
                {error.message}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Signup;

