import React, { useState, useEffect } from 'react'
import { DROP_STUDENT, REMOVE_DROP_STUDENT, UPDATE_COHORT_ROSTER } from '../../utils/mutations'
import { useMutation } from '@apollo/client';
import API from '../../utils/API'
import './style.css';

export default function StudentRoster({ cohortId, studentRoster, droppedStudents, bcsCohortId, loggedInUser }) {

    // console.log({ bcsCohortId, loggedInUser })
    const [studentDrop, setStudentDrop] = useState('');


    const [dropStudent, { error: dropError, data: dropData }] = useMutation(DROP_STUDENT);
    if (dropError) { console.log(dropError) }

    const [removeDropStudent, { error: removeError, data: removeData }] = useMutation(REMOVE_DROP_STUDENT)
    const [updateCohortRoster, { error: rosterError, data: rosterData }] = useMutation(UPDATE_COHORT_ROSTER)

    useEffect(() => {

    }, [droppedStudents, studentRoster])


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
        const student = e.target.dataset.studentname
        try {
            const { data } = await removeDropStudent({
                variables: { name: student, cohortId },
            })
            console.log(data)
        } catch (err) {
            console.log(err)
        }
    }

    const updateRosterClick = async e => {
        let newRoster = []
        const studentData = await API.getStudentNames(loggedInUser.bcsLoginInfo.bcsEmail, loggedInUser.bcsLoginInfo.bcsPassword, bcsCohortId);
        if (studentData.data) {
            studentData.data.forEach(studentObj => {
                if (!newRoster.includes(studentObj.studentName)) {
                    newRoster.push(studentObj.studentName)
                }
            })
        }
        // console.log(newRoster)
        try {
            const { data } = await updateCohortRoster({
                variables: { newRoster, cohortId },
            });
            console.log(data)
        } catch (err) {
            console.log(JSON.stringify(err))
        }

    }


    return (
        <div className="StudentRoster row d-flex p-3">
            <p className="text-center p-2 w-75 mt-3 mx-auto lead border-bcs" >Use this tool to view all current students enrolled in this cohort. Since students are not removed from the roster when they drop the course, you are able to move students to an <em>inactive</em> list. <em>Inactive</em> students will be removed from all further actions, such as viewing grades and forming of groups. </p>
            <div className="col-md-6">

                <h3>Active Student Roster: </h3>
                <p className="text-center">Have students been added to this cohort?&nbsp;
                    <button className="btn bg-bcs text-light my-2" onClick={updateRosterClick}>Update Roster</button>
                </p>
                <ol className="list-group list-group-numbered">
                    {studentRoster.filter(student => !droppedStudents.includes(student)).map(student => <li className="list-group-item w-100" key={student}>{student}</li>)}
                </ol>
            </div>
            <div className="dropped-students p-2 col-md-6">
                <h3>Inactive Students: </h3>
                <form onSubmit={handleDropStudentSubmit}>
                    <label htmlFor="student-select">Move a student to the inactive list</label>

                    <select className="form-select" aria-label="Default select example" value={studentDrop} name="student-select" id="student-select" onChange={handleDroppedNameSelect}>
                        <option defaultValue>Select a student...</option>
                        {studentRoster.filter(student => !droppedStudents.includes(student)).map(student => <option value={student} key={student}>{student}</option>)}
                    </select>
                    <button type="submit" className="btn btn-secondary">Remove from active roster</button>
                </form>
                <hr />
                <ol className="list-group list-group-numbered">
                    {droppedStudents.map(student => <li className="list-group-item w-100" key={student}>{student} <span className="float-end text-danger" style={{ cursor: 'pointer' }} data-studentname={student} onClick={handleRemoveClick}>&times;</span></li>)}
                </ol>

            </div>
        </div>
    )
}
