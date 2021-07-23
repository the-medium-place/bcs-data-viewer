import React, { useState, useEffect } from 'react'
import API from '../../utils/API'

export default function StudentGrades({ enrollmentId, bcsCohortId, studentRoster, droppedStudents, loggedInUser }) {

    const bcsEmail = loggedInUser.bcsLoginInfo.bcsEmail;
    const bcsPassword = loggedInUser.bcsLoginInfo.bcsPassword;
    const activeStudents = studentRoster.filter(student => !droppedStudents.includes(student))

    const [gradeData, setGradeData] = useState(null)

    useEffect(async () => {
        setGradeData(await API.getGradeData(bcsEmail, bcsPassword, bcsCohortId, enrollmentId));
    }, [])

    return (
        <div className="StudentGrades">
            {/* {gradeData ? <small>{JSON.stringify(gradeData)}</small> : <h1>nothing yet!</h1>} */}
            <h1>GRADES</h1>
            {gradeData ? (
                <div className="container" style={{ overflow: 'scroll' }}>
                    <table>
                        <thead>
                            <tr>
                                <td>Student Name</td>
                                {gradeData.assignmentArr.map(assignment => <td key={assignment}>{assignment}</td>)}
                            </tr>
                        </thead>
                        <tbody>
                            {activeStudents.map(student => {
                                return (
                                    <tr>
                                        <td>{student}</td>
                                        {gradeData.studentObj[student].assignments.map(assignmentObj => {
                                            return (
                                                <td>{assignmentObj.grade || 'n/a'}</td>
                                            )
                                        })}
                                    </tr>
                                )
                            }
                            )}


                        </tbody>
                    </table>
                </div>
            ) : <p>no data yet...</p>}
        </div>
    )
}
