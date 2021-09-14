import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_ONE_USER, GET_ME } from '../../utils/queries';
import { useParams } from 'react-router';
import Auth from '../../utils/auth';
import API from '../../utils/API';
import CohortListItem from '../../components/CohortListItem';
import NotLoggedIn from '../../components/NotLoggedIn';


export default function UserPage() {
    const [cohortInfo, setCohortInfo] = useState([])
    const [apiError, setApiError] = useState(false);



    const params = useParams();
    const userId = params.id


    const { loading, error, data } = useQuery(
        userId ? GET_ONE_USER : GET_ME,
        {
            variables: { userId },
        }
    );
    if (error) { console.log(JSON.stringify(error)) }

    // Check if data is returning from the `QUERY_ME` query, then the `QUERY_SINGLE_PROFILE` query
    const loggedInUser = data?.me || data?.user || {};
    // console.log(loggedInUser.cohorts)
    const cohortCodeArray = loggedInUser.cohorts ? loggedInUser.cohorts.map(cohObj => cohObj.cohortCode) : [];
    // console.log(cohortCodeArray)
    // get bcs login info from user object
    const bcsEmail = loggedInUser.bcsLoginInfo?.bcsEmail || null;
    const bcsPassword = loggedInUser.bcsLoginInfo?.bcsPassword || null;


    const cohortInfoClick = async e => {
        setApiError(false);
        try {

            const cohortsArr = await API.getInstructorInfo(bcsEmail, bcsPassword)
            setCohortInfo(cohortsArr)
        } catch (err) {
            setApiError(true);
            console.log(err.message)
        }
    }

    // console.log("cohortInfo: ", cohortInfo)
    return (
        <div className="UserPage">

            {Auth.loggedIn() ? (
                // RENDER IF LOGGED IN
                // ===================
                <>
                    {loading ? <h1>userpage Loading!!</h1> : error ? <h1>there was an error!</h1> : (
                        <>
                            {/* <h1>{loggedInUser.name}</h1> */}
                            <p className="lead p-2 m-2 mb-3 text-center border-bcs w-75 mx-auto">Select a cohort below, or click the button at the bottom of the page to see all the cohorts connected to you on BCS</p>
                            <div className="d-flex justify-content-center">
                                <ul className="list-group list-group-flush w-75">{loggedInUser.cohorts.length > 0 ? null : <h2>No saved cohorts yet! Click the button below to view and select a cohort and view its data.</h2>}
                                    {loggedInUser.cohorts.length > 0 ? loggedInUser.cohorts.map(cohort => <Link className="text-decoration-none" key={cohort._id} to={`/cohorts/${cohort._id}`}><CohortListItem cohort={cohort} saveButton={false} loggedInUser={loggedInUser} /></Link>) : null}
                                </ul>
                            </div>
                            <br />
                            <hr />
                            <p className="text-center p-1 bg-bcs text-light w-75 mx-auto shadow"><button className="btn btn-light text-bcs" onClick={cohortInfoClick}>Click Here</button> to view all your cohorts from the BCS Database</p>
                            {apiError ? (
                                <p className="text-center p-1 text-danger">There was an error connecting to the BCS database. <br /><a href="/updateuser"><button className="bg-light border-bcs rounded">Click Here</button></a> to update your BCS login info...</p>
                            ) : null}
                            <div className="d-flex justify-content-center">
                                <ul className="list-group list-group-flush w-75">
                                    {/* {cohortInfo.length > 0 ? "Your cohorts:" : null} */}
                                    {cohortInfo.length > 0 ? cohortInfo.map(cohort => <CohortListItem cohortCodeArray={cohortCodeArray} key={cohort.cohortId} cohort={cohort} saveButton={true} loggedInUser={loggedInUser} />) : null}
                                </ul>
                            </div>
                        </>
                    )}
                </>) : (
                // RENDER IF NOT LOGGED IN
                // =======================
                <NotLoggedIn />
            )}
        </div>
    )
}
