import React, { useState } from 'react'
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import API from '../../utils/API';
import { useQuery } from '@apollo/client';
import Auth from '../../utils/auth';
import { GET_COHORT, GET_ME } from '../../utils/queries';
import AddNote from '../../components/AddNote';
import StudentRoster from '../../components/StudentRoster';
import StudentFeedback from '../../components/StudentFeedback';
import StudentGrades from '../../components/StudentGrades';
import CohortNotes from '../../components/CohortNotes';
import MakeGroups from '../../components/MakeGroups';
import SavedGroups from '../../components/SavedGroups';

import './style.css';
import NotLoggedIn from '../../components/NotLoggedIn';

export default function Cohort() {
    const params = useParams();
    const cohortId = params.id

    const [view, setView] = useState('roster')
    const [showNotes, setShowNotes] = useState(true)

    const { loading, error, data } = useQuery(
        GET_COHORT,
        {
            variables: { cohortId },
        }
    );
    const { loading: meLoading, error: meError, data: meData } = useQuery(GET_ME);
    if (error) { console.log(JSON.stringify(error)) }
    if (meError) { console.log(JSON.stringify(meError)) }

    // Check if data is returning from the `GET_ME` query
    const loggedInUser = meData?.me || {};
    // console.log(loggedInUser)

    // Check if data is returning from GET_COHORT query
    const bcsCohortId = data?.getCohort.cohortId || 'no id yet'
    const cohortCode = data?.getCohort.cohortCode || 'no code yet';
    const enrollmentId = data?.getCohort.enrollmentId || 'no id yet';
    const studentRoster = data?.getCohort.studentRoster || [];
    const droppedStudents = data?.getCohort.droppedStudents || [];
    const cohortNotes = data?.getCohort.notes || [];
    const cohortGroups = data?.getCohort.groups || []

    console.log({ cohortGroups })

    // console.log("cohortNotes: ", cohortNotes)


    // if (error) { console.log(JSON.stringify(error)) }

    // if (meData) { console.log(meData?.me) }
    // if (meError) { console.log(JSON.stringify(meError)) }

    const handleTabClick = e => {
        const clickId = e.target.dataset.view;
        console.log(clickId)
        setView(clickId)
    }


    return (
        <div className="Cohort">
            {Auth.loggedIn() ? (<>
                <div className="row mt-3">
                    <h1 className="text-center text-bold">{cohortCode}</h1>
                </div>
                {/* <h3>BCS Cohort ID: {bcsCohortId}</h3> */}
                {/* <h3>Cohort Mongoose Id: {cohortId}</h3> */}
                {/* <h3>Cohort Enrollment Id: {enrollmentId}</h3> */}
                {/* <hr /> */}
                {/* <div className="view-select w-100 d-flex justify-content-center">
                    <div className="btn-group" role="group" aria-label="Basic example">
                    <button type="button" className="btn btn-primary btn-lg" onClick={() => setView('grades')}>Grades</button>
                    <button type="button" className="btn btn-primary btn-lg" onClick={() => setView('roster')}>Roster</button>
                    <button type="button" className="btn btn-primary btn-lg" onClick={() => setView('feedback')}>Feedback</button>
                    <button type="button" className="btn btn-primary btn-lg" onClick={() => setView('makegroups')}>Make Groups</button>
                    </div>
                </div> */}
                <nav className="row">
                    <ul className="nav nav-tabs">
                        <li onClick={handleTabClick} data-view="roster" className="nav-item tab-li">
                            <span data-view="roster" className={`nav-link ${view === 'roster' ? 'active' : null}`}>Roster</span>
                        </li>
                        <li onClick={handleTabClick} data-view="grades" className='nav-item tab-li'>
                            <span data-view="grades" className={`nav-link ${view === 'grades' ? 'active' : null}`}>Grades</span>
                        </li>
                        <li onClick={handleTabClick} data-view="makegroups" className='nav-item tab-li'>
                            <span data-view="makegroups" className={`nav-link ${view === 'makegroups' ? 'active' : null}`}>Make Groups</span>
                        </li>
                        <li onClick={handleTabClick} data-view="savedgroups" className='nav-item tab-li'>
                            <span data-view="savedgroups" className={`nav-link ${view === 'savedgroups' ? 'active' : null}`}>Saved Groups</span>
                        </li>
                        <li onClick={handleTabClick} data-view="feedback" className='nav-item tab-li'>
                            <span data-view="feedback" className={`nav-link ${view === 'feedback' ? 'active' : null}`}>Feedback</span>
                        </li>
                    </ul>
                </nav>
                {/* <hr /> */}
                <div className="content-wrapper row d-flex justify-content-center">
                    {
                        view === 'grades' ? <StudentGrades bcsCohortId={bcsCohortId} enrollmentId={enrollmentId} loggedInUser={loggedInUser} studentRoster={studentRoster} droppedStudents={droppedStudents} /> :
                            view === "roster" ? <StudentRoster cohortId={cohortId} studentRoster={studentRoster} droppedStudents={droppedStudents} /> :
                                view === "feedback" ? <StudentFeedback /> :
                                    view === "makegroups" ? <MakeGroups cohortGroups={cohortGroups} loggedInUser={loggedInUser} studentRoster={studentRoster} droppedStudents={droppedStudents} bcsCohortId={bcsCohortId} enrollmentId={enrollmentId} cohortId={cohortId} /> :
                                        view === 'savedgroups' ? <SavedGroups cohortGroups={cohortGroups} /> :
                                            <h1>what???</h1>
                    }
                </div>

                {/* NOTES FOR THIS COHORT */}
                <div className="row d-flex flex-column">
                    <h3 className="d-flex justify-content-between bg-dark text-light text-bold p-1">Cohort Notes:<span className="d-flex mr-3 align-self-end" style={{ cursor: 'pointer', fontSize: '.6em' }} onClick={() => setShowNotes(!showNotes)}>{showNotes ? 'Hide' : 'Show'}</span></h3>

                    {showNotes ? (

                        <CohortNotes showNotes={showNotes} setShowNotes={setShowNotes} cohortNotes={cohortNotes} loggedInUser={loggedInUser} cohortId={cohortId} />
                    ) : null}
                </div>
            </>
            ) : (
                // RENDER IF NOT LOGGED IN
                // =======================
                <>
                    <NotLoggedIn />
                </>
            )}
        </div>
    )
}
