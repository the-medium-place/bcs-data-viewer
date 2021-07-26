import React, { useState, useEffect } from 'react'
import API from '../../utils/API';
import './style.css';

export default function StudentGrades({ enrollmentId, bcsCohortId, studentRoster, droppedStudents, loggedInUser }) {

    const bcsEmail = loggedInUser.bcsLoginInfo.bcsEmail;
    const bcsPassword = loggedInUser.bcsLoginInfo.bcsPassword;
    const activeStudents = studentRoster.filter(student => !droppedStudents.includes(student))

    const [gradeData, setGradeData] = useState(null)

    useEffect(() => {
        async function fetchData() {

            setGradeData(await API.getGradeData(bcsEmail, bcsPassword, bcsCohortId, enrollmentId));
        }
        fetchData();
    }, [])

    const getTdClassName = (grade) => {
        const GRADE_CLASS_MAP = {
            'A+': 'table-success',
            'A': 'table-success',
            'A-': 'table-success',
            'B+': 'table-primary',
            'B': 'table-primary',
            'B-': 'table-primary',
            'C+': 'table-warning',
            'C': 'table-warning',
            'C-': 'table-warning',
            'D+': 'table-danger',
            'D': 'table-danger',
            'D-': 'table-danger',
            'F': 'table-dark',
            'I': 'table-dark',
            'Overdue or Ungraded': 'table-light',
        }

        return GRADE_CLASS_MAP[grade]
    }

    return (
        <div className="StudentGrades my-5 px-5 border" style={{ overflow: 'auto', maxHeight: 800, width: '95%' }}>
            {gradeData ? (
                <div className="table">
                    <table className="table table-sm table-bordered table-hover table-condensed">
                        <thead>
                            <tr>
                                <th scope="col">Student Name</th>
                                {gradeData.assignmentArr.map(assignment => <th scope="col" key={assignment}>{assignment}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {activeStudents.map(student => {
                                return (
                                    <tr key={student}>
                                        <th scope="row">{student}</th>
                                        {gradeData.studentObj[student].assignments.map((assignmentObj, i) => {
                                            const gradeExists = assignmentObj.grade ? true : false;
                                            return (
                                                <td
                                                    key={assignmentObj.name + i}
                                                    className={gradeExists ? getTdClassName(assignmentObj.grade) : 'table-secondary'}
                                                >
                                                    <span data-descr={`Student: ${student} -- Assignment: "${assignmentObj.name}"`}>{assignmentObj.grade || 'Not yet due!'}</span>
                                                </td>
                                            )
                                        })}
                                    </tr>
                                )
                            }
                            )}


                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="d-flex align-items-center my-5 p-5">
                    <strong>Loading Grade Data Table...</strong>
                    <div className="spinner-border ms-auto" role="status" aria-hidden="true"></div>
                </div>
            )}
        </div>
    )
}
