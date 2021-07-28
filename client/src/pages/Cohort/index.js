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


export default function Cohort() {
    const params = useParams();
    const cohortId = params.id

    const [view, setView] = useState('roster')

    const { loading, error, data } = useQuery(
        GET_COHORT,
        {
            variables: { cohortId },
        }
    );
    const { loading: meLoading, error: meError, data: meData } = useQuery(GET_ME);
    if (error) { console.log(JSON.stringify(error)) }


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

    // console.log("cohortNotes: ", cohortNotes)


    // if (error) { console.log(JSON.stringify(error)) }

    // if (meData) { console.log(meData?.me) }
    // if (meError) { console.log(JSON.stringify(meError)) }




    return (
        <div className="Cohort">
            {Auth.loggedIn() ? (<>
                <h1 className="text-center text-bold">{cohortCode}</h1>
                {/* <h3>BCS Cohort ID: {bcsCohortId}</h3> */}
                {/* <h3>Cohort Mongoose Id: {cohortId}</h3> */}
                {/* <h3>Cohort Enrollment Id: {enrollmentId}</h3> */}
                <hr />
                <div className="view-select w-100 d-flex justify-content-center">
                    <div className="btn-group" role="group" aria-label="Basic example">
                        <button type="button" className="btn btn-primary btn-lg" onClick={() => setView('grades')}>Grades</button>
                        <button type="button" className="btn btn-primary btn-lg" onClick={() => setView('roster')}>Roster</button>
                        <button type="button" className="btn btn-primary btn-lg" onClick={() => setView('feedback')}>Feedback</button>
                        <button type="button" className="btn btn-primary btn-lg" onClick={() => setView('makegroups')}>Make Groups</button>
                    </div>
                </div>
                <hr />
                <div className="student-grades-wrapper row d-flex justify-content-center">
                    {view === 'grades' ? <StudentGrades bcsCohortId={bcsCohortId} enrollmentId={enrollmentId} loggedInUser={loggedInUser} studentRoster={studentRoster} droppedStudents={droppedStudents} /> :
                        view === "roster" ? <StudentRoster cohortId={cohortId} studentRoster={studentRoster} droppedStudents={droppedStudents} /> :
                            view === "feedback" ? <StudentFeedback /> :
                                view === "makegroups" ? <MakeGroups loggedInUser={loggedInUser} studentRoster={studentRoster} droppedStudents={droppedStudents} bcsCohortId={bcsCohortId} enrollmentId={enrollmentId} /> : <h1>what???</h1>}
                </div>

                {/* NOTES FOR THIS COHORT */}
                <CohortNotes cohortNotes={cohortNotes} loggedInUser={loggedInUser} cohortId={cohortId} />

            </>
            ) : (
                // RENDER IF NOT LOGGED IN
                // =======================
                <h1>please <Link to="/login">Login</Link> or <Link to="/signup">Sign Up</Link> to view todos </h1>
            )}
        </div>
    )
}
