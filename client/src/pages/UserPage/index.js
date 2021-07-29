import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_ONE_USER, GET_ME } from '../../utils/queries';
import { useParams } from 'react-router';
import Auth from '../../utils/auth';
import API from '../../utils/API';
import CohortListItem from '../../components/CohortListItem';


export default function UserPage() {
    const [cohortInfo, setCohortInfo] = useState([])



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
    // console.log(loggedInUser)
    // get bcs login info from user object
    const bcsEmail = loggedInUser.bcsLoginInfo?.bcsEmail || null;
    const bcsPassword = loggedInUser.bcsLoginInfo?.bcsPassword || null;


    const cohortInfoClick = async e => {
        const cohortsArr = await API.getInstructorInfo(bcsEmail, bcsPassword)
        setCohortInfo(cohortsArr)
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
                            <h1>{loggedInUser.name}</h1>
                            <p>Select a cohort below, or click the button at the bottom of the page ro see all the cohorts connected to you on BCS</p>
                            <div className="d-flex justify-content-center">

                                <ul className="list-group list-group-flush w-75">{loggedInUser.cohorts.length > 0 ? "Your 'Linked' cohorts (Saved to app): " : null}
                                    {loggedInUser.cohorts.length > 0 ? loggedInUser.cohorts.map(cohort => <Link className="text-decoration-none" key={cohort._id} to={`/cohorts/${cohort._id}`}><CohortListItem cohort={cohort} saveButton={false} loggedInUser={loggedInUser} /></Link>) : null}
                                </ul>
                            </div>
                            <br />
                            <hr />

                            <p className="text-center p-1 bg-dark text-light w-75 mx-auto">To see all cohorts to which you are associated, click <button className="btn btn-secondary" onClick={cohortInfoClick}>Here!</button></p>
                            <div className="d-flex justify-content-center">

                                <ul className="list-group list-group-flush w-75">{cohortInfo.length > 0 ? "All associated Cohorts:" : null}
                                    {cohortInfo.length > 0 ? cohortInfo.map(cohort => <CohortListItem key={cohort.cohortId} cohort={cohort} saveButton={true} loggedInUser={loggedInUser} />) : null}
                                </ul>
                            </div>
                        </>
                    )}

                </>) : (
                // RENDER IF NOT LOGGED IN
                // =======================
                <h1>please <Link to="/login">Login</Link> or <Link to="/signup">Sign Up</Link> to view todos </h1>
            )}
        </div>
    )
}
