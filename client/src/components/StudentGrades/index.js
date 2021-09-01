import React, { useState, useEffect } from 'react'
import API from '../../utils/API';
import './style.css';

export default function StudentGrades({ enrollmentId, bcsCohortId, studentRoster, droppedStudents, loggedInUser }) {

    const bcsEmail = loggedInUser.bcsLoginInfo.bcsEmail;
    const bcsPassword = loggedInUser.bcsLoginInfo.bcsPassword;
    const activeStudents = studentRoster.filter(student => !droppedStudents.includes(student))

    const [gradeData, setGradeData] = useState(null)
    const [modifiableStudents, setModifiableStudents] = useState(activeStudents);
    const [isGradeSorted, setIsGradeSorted] = useState(false);
    const [isAlphaSorted, setIsAlphaSorted] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setGradeData(await API.getGradeData(bcsEmail, bcsPassword, bcsCohortId, enrollmentId))
        }
        fetchData()
    }, [])

    const getAvgAssignmentScore = () => {
        const avgGradeObj = {};
        gradeData.assignmentArr.forEach(assignment => {
            avgGradeObj[assignment] = 0;
        })
        for (let student in gradeData.studentObj) {
            // console.log(gradeData.studentObj[student])
            gradeData.studentObj[student].assignments.forEach(gradeObj => {
                // console.log(gradeObj.grade)
                avgGradeObj[gradeObj.name] += MAP_GRADES_TO_INT[gradeObj.grade] / activeStudents.length;
            })
        }

        // console.log(avgGradeObj)
        return avgGradeObj;
    }

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
            'Incomplete': 'table-dark',
            'Overdue!': 'table-light text-danger text-bold',
            'Not Due!': 'table-secondary',
            'Ungraded': 'text-danger'
        }

        return GRADE_CLASS_MAP[grade]
    }

    function getKeyByValue(object, value) {
        return Object.keys(object).find(key => object[key] === value);
    }

    const MAP_GRADES_TO_INT = {
        'A+': 1,
        'A': 2,
        'A-': 3,
        'B+': 4,
        'B': 5,
        'B-': 6,
        'C+': 7,
        'C': 8,
        'C-': 9,
        'D+': 10,
        'D': 11,
        'D-': 12,
        'F': 13,
        'I': 13,
        'Incomplete': 13,
        'Overdue!': 13,
        'Not Due!': 13,
        'Ungraded': 13,
        'N/A': 0
    }

    const getGradeAvg = (student) => {
        let numDue = 0,
            totalGradeVal = 0,
            gradeAvg = 0,
            failingGrades = 0;

        gradeData.studentObj[student].assignments.forEach(assignmentObj => {
            if (assignmentObj.isDue && assignmentObj.grade !== 'Ungraded') {
                numDue++
                totalGradeVal += MAP_GRADES_TO_INT[assignmentObj.grade]
            }
            if (assignmentObj.grade === 'F' || assignmentObj.grade === 'I' || assignmentObj.grade === 'Overdue!' || assignmentObj.grade === 'Incomplete') {
                failingGrades++;
            }
        })
        gradeAvg = totalGradeVal / (numDue || 1);
        return { gradeAvg, failingGrades }
    }

    const alphaSort = () => {
        const studentsCopy = [...activeStudents];
        setIsGradeSorted(false);
        if (isAlphaSorted) {
            setIsAlphaSorted(false);
            studentsCopy.sort((a, b) => {
                if (a > b) { return -1; }
                if (a < b) { return 1; }
                return 0;
            })
        } else {
            setIsAlphaSorted(true);
            studentsCopy.sort((a, b) => {
                if (a < b) { return -1; }
                if (a > b) { return 1; }
                return 0;
            })
        }

        setModifiableStudents(studentsCopy);
    }

    const gradeSort = () => {
        setIsAlphaSorted(false);
        const studentsCopy = [...activeStudents];

        studentsCopy.sort((a, b) => {
            const { gradeAvg: aGrade } = getGradeAvg(a);
            const { gradeAvg: bGrade } = getGradeAvg(b);
            if (isGradeSorted) {

                setIsGradeSorted(false)
                if (aGrade > bGrade) { return -1; }
                if (aGrade < bGrade) { return 1; }
                return 0;
            } else {
                setIsGradeSorted(true)
                if (aGrade < bGrade) { return -1; }
                if (aGrade > bGrade) { return 1; }
                return 0;
            }
        })

        setModifiableStudents(studentsCopy);
    }

    const renderIcon = (direction) => {
        return (
            <i className={`bi-caret-${direction}-fill`}></i>
        )
    }

    let avgGrades;
    if (gradeData) {
        avgGrades = getAvgAssignmentScore();
    }

    return (
        <div className="StudentGrades">
            <div className="w-100 text-center">
                <p className="lead text-center mt-3 p-2 border-bcs w-75 mx-auto" >The table below will populate with all active students and their current grades on all assignments. <strong>Average Grades</strong> are calculated using only <em>currently due</em> assignments. Assignments which have been turned in but <em>not</em> graded are not factored into the calculations.</p>
            </div>
            <div className="my-5 border" style={{ overflow: 'auto', maxHeight: '75vh', width: '100%' }}>
                {gradeData ? (
                    <div className="table-wrapper w-100">
                        <table className="table table-sm table-hover table-condensed w-100">
                            <thead>
                                <tr>
                                    <th className="table-light th-name-avg" scope="col" style={{ minWidth: 100 }}>Student Name&nbsp;&nbsp;<span onClick={alphaSort}>{isAlphaSorted ? renderIcon('down') : renderIcon('up')}</span></th>
                                    <th className="table-light th-name-avg second-child" scope="col" style={{ minWidth: 120 }}>Avg&nbsp;&nbsp;<span onClick={gradeSort}>{isGradeSorted ? renderIcon('down') : renderIcon('up')}</span></th>
                                    {gradeData ?
                                        gradeData.assignmentArr.map(assignment => (
                                            <th scope="col" key={assignment} style={{ minWidth: 100 }}>
                                                {assignment}
                                                <br />
                                                <p className="bg-secondary text-white p-1">
                                                    Class AVG: {getKeyByValue(MAP_GRADES_TO_INT, Math.round(avgGrades[assignment]))}
                                                </p>
                                            </th>
                                        )) : null
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                {modifiableStudents.map(student => {

                                    const { gradeAvg, failingGrades } = getGradeAvg(student);

                                    return (
                                        <tr key={student}>
                                            <th className="th-col-header table-light" scope="row">{student}</th>
                                            <th className="th-avg-grade table-light second-child" scope="row">
                                                {getKeyByValue(MAP_GRADES_TO_INT, Math.round(gradeAvg))}
                                                <br />
                                                <span className={failingGrades < 3 ? 'bg-secondary text-light p-1' : 'bg-danger text-light p-1'}>
                                                    # Failing: {failingGrades}
                                                </span>
                                            </th>
                                            {gradeData.studentObj[student].assignments.map((assignmentObj, i) => {

                                                return (
                                                    <td
                                                        key={assignmentObj.name + i}
                                                        className={getTdClassName(assignmentObj.grade)}
                                                    >
                                                        <span data-student={student} data-assignment={assignmentObj.name}>{assignmentObj.grade}</span>
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
                        <strong>Loading Grade Data...</strong>
                        <div className="spinner-border ms-auto" role="status" aria-hidden="true"></div>
                    </div>
                )}
            </div>
        </div>
    )
}
