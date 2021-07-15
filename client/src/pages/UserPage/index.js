import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_ONE_USER, GET_ME } from '../../utils/queries';
import { ADD_COHORT } from '../../utils/mutations';
import { useParams } from 'react-router';
import Auth from '../../utils/auth';
import API from '../../utils/API';
import CohortListItem from '../../components/CohortListItem';


export default function UserPage() {
    const [cohortInfo, setCohortInfo] = useState([])



    const params = useParams();
    // console.log(params)
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
    console.log(loggedInUser)
    // get bcs login info from user object
    const bcsEmail = loggedInUser.bcsLoginInfo?.bcsEmail || null;
    const bcsPassword = loggedInUser.bcsLoginInfo?.bcsPassword || null;


    const cohortInfoClick = async e => {
        const cohortsArr = await API.getInstructorInfo(bcsEmail, bcsPassword)
        setCohortInfo(cohortsArr)
    }

    console.log("cohortInfo: ", cohortInfo)
    return (
        <div className="UserPage">

            {Auth.loggedIn() ? (
                // RENDER IF LOGGED IN
                // ===================
                <>
                    {loading ? <h1>userpage Loading!!</h1> : error ? <h1>there was an error!</h1> : (
                        <>
                            <h1>{loggedInUser.name}<small style={{ color: 'red', fontWeight: 'bold', cursor: 'pointer' }} onClick={Auth.logout}>&nbsp;Logout</small></h1>
                            <button onClick={cohortInfoClick}>Click Here to get Cohort Info!</button>
                            <ul>{loggedInUser.cohorts.length > 0 ? "All linked Cohorts (Saved to app): " : null}
                                {loggedInUser.cohorts.length > 0 ? loggedInUser.cohorts.map(cohort => <CohortListItem key={cohort._id} cohort={cohort} saveButton={false} />) : null}
                            </ul>


                            <ul>{cohortInfo.length > 0 ? "All associated Cohorts:" : null}
                                {cohortInfo.length > 0 ? cohortInfo.map(cohort => <CohortListItem key={cohort.cohortId} cohort={cohort} saveButton={true} />) : <h1>Click above to view your cohorts!</h1>}
                            </ul>
                        </>
                    )}

                </>) : (
                // RENDER IF NOT LOGGED 
                // ====================
                <h1>please <Link to="/login">Login</Link> or <Link to="/signup">Sign Up</Link> to view todos </h1>
            )}
        </div>
    )
}
