import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import API from '../../utils/API';
import { useQuery } from '@apollo/client';
import { useMutation } from '@apollo/client';
import Auth from '../../utils/auth';
import { DROP_STUDENT, REMOVE_DROP_STUDENT, ADD_COHORT_NOTE } from '../../utils/mutations'
import { GET_COHORT, GET_ME } from '../../utils/queries';


export default function Cohort() {
    const params = useParams();
    const cohortId = params.id

    const [dropStudent, { error: dropError, data: dropData }] = useMutation(DROP_STUDENT);
    if (dropError) { console.log(dropError) }

    const [removeDropStudent, { error: removeError, data: removeData }] = useMutation(REMOVE_DROP_STUDENT)

    const [addCohortNote, { error: newNoteError, data: newNoteData }] = useMutation(ADD_COHORT_NOTE)

    const { loading, error, data } = useQuery(
        GET_COHORT,
        {
            variables: { cohortId },
        }
    );
    const { loading: meLoading, error: meError, data: meData } = useQuery(GET_ME);
    if (error) { console.log(JSON.stringify(error)) }

    const [studentDrop, setStudentDrop] = useState('');
    const [noteContent, setNoteContent] = useState('');

    // Check if data is returning from the `GET_ME` query
    const loggedInUser = meData?.me || {};
    console.log(loggedInUser)

    // Check if data is returning from GET_COHORT query
    const bcsCohortId = data?.getCohort.cohortId || 'no id yet'
    const cohortCode = data?.getCohort.cohortCode || 'no code yet';
    const enrollmentId = data?.getCohort.enrollmentId || 'no id yet';
    const studentRoster = data?.getCohort.studentRoster || [];
    const droppedStudents = data?.getCohort.droppedStudents || [];
    const cohortNotes = data?.getCohort.notes || [];

    console.log("cohortNotes: ", cohortNotes)


    // if (error) { console.log(JSON.stringify(error)) }

    // if (meData) { console.log(meData?.me) }
    // if (meError) { console.log(JSON.stringify(meError)) }



    const handleDroppedNameSelect = e => {
        setStudentDrop(e.target.value)
    }

    const handleDropStudentSubmit = async e => {
        e.preventDefault();
        console.log({ studentDrop, cohortId })

        try {
            const { data } = await dropStudent({
                variables: { name: studentDrop, cohortId },
            });
            console.log(data)
            setStudentDrop('')
        } catch (err) {
            console.log(err)
        }
    }

    const handleRemoveClick = async e => {
        const student = e.target.dataset.student
        try {
            const { data } = await removeDropStudent({
                variables: { name: student, cohortId },
            })
            console.log(data)
        } catch (err) {
            console.log(err)
        }
    }

    const handleNoteChange = async e => {
        setNoteContent(e.target.value)
    }

    const handleNoteSubmit = async e => {
        e.preventDefault();
        console.log(noteContent)
        try {
            const { data } = await addCohortNote({
                variables: { content: noteContent, cohortId, createdBy: loggedInUser._id },
            });
            console.log(data)
            setNoteContent('')
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className="Cohort">
            <Link to="/me">Back to Dashboard!</Link>
            <h1>Cohort Code: {cohortCode}</h1>
            <h3>BCS Cohort ID: {bcsCohortId}</h3>
            <h3>Cohort Mongoose Id: {cohortId}</h3>
            <h3>Cohort Enrollment Id: {enrollmentId}</h3>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                <div>

                    <h3>Student Roster: </h3>
                    <ul>
                        {studentRoster.filter(student => !droppedStudents.includes(student)).map(student => <li key={student}>{student}</li>)}
                    </ul>
                </div>
                <div>
                    <form onSubmit={handleDropStudentSubmit}>
                        Add Students to the drop-list:
                        <br />
                        <label htmlFor="student-select">Select a Student:</label>

                        <select value={studentDrop} name="student-select" id="student-select" onChange={handleDroppedNameSelect}>
                            <option disabled defaultValue>Select a student...</option>
                            {studentRoster.filter(student => !droppedStudents.includes(student)).map(student => <option value={student} key={student}>{student}</option>)}
                        </select>
                        <button type="submit">Add Student</button>
                    </form>
                    <h3>Dropped Students: </h3>
                    <ul>
                        {droppedStudents.map(student => <li key={student}>{student} <span style={{ cursor: 'pointer' }} data-student={student} onClick={handleRemoveClick}>&times;</span></li>)}
                    </ul>

                </div>
            </div>
            <hr />
            <div className="cohortNotes">
                <ul>
                    {cohortNotes.map(note => {
                        return (
                            <li>
                                {note.content}
                                <br />
                                - <strong>{note.createdBy.name}</strong> on <em>{new Date(parseInt(note.createdAt)).toLocaleString()}</em>
                            </li>
                        )
                    })}
                </ul>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <form id="add-note" onSubmit={handleNoteSubmit} style={{ padding: 5, background: 'lightgray' }}>
                        <p>Add a new Note:</p>
                        <textarea rows="10" cols="40" value={noteContent} onChange={handleNoteChange} />
                        <br />
                        <button type="submit">Add Note</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
