import React, { useState } from 'react'
import { DROP_STUDENT, REMOVE_DROP_STUDENT } from '../../utils/mutations'
import { useMutation } from '@apollo/client';

export default function StudentRoster({ cohortId, studentRoster, droppedStudents }) {


    const [studentDrop, setStudentDrop] = useState('');


    const [dropStudent, { error: dropError, data: dropData }] = useMutation(DROP_STUDENT);
    if (dropError) { console.log(dropError) }

    const [removeDropStudent, { error: removeError, data: removeData }] = useMutation(REMOVE_DROP_STUDENT)


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


    return (
        <div className="StudentRoster row d-flex p-3">
            <div className="col-md-6">

                <h3>Student Roster: </h3>
                <ol className="list-group list-group-numbered">
                    {studentRoster.filter(student => !droppedStudents.includes(student)).map(student => <li className="list-group-item w-100" key={student}>{student}</li>)}
                </ol>
            </div>
            <div className="col-md-6">
                <h3>Dropped Students: </h3>
                <form onSubmit={handleDropStudentSubmit}>
                    Add Students to the drop-list:
                    <br />
                    <label htmlFor="student-select">Select a Student:</label>

                    <select className="form-select" aria-label="Default select example" value={studentDrop} name="student-select" id="student-select" onChange={handleDroppedNameSelect}>
                        <option selected defaultValue>Select a student...</option>
                        {studentRoster.filter(student => !droppedStudents.includes(student)).map(student => <option value={student} key={student}>{student}</option>)}
                    </select>
                    <button type="submit">Add Student</button>
                </form>
                <ol className="list-group list-group-numbered">
                    {droppedStudents.map(student => <li className="list-group-item w-100" key={student}>{student} <span style={{ cursor: 'pointer' }} data-student={student} onClick={handleRemoveClick}>&times;</span></li>)}
                </ol>

            </div>
        </div>
    )
}
