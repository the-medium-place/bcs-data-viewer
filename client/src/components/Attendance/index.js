import React, { useState, useEffect } from 'react'
import API from '../../utils/API'
import './style.css';

export default function Attendance({ bcsCohortId, loggedInUser, enrollmentId, studentRoster, droppedStudents }) {

    // VARIABLES FROM PROPS
    const { bcsEmail, bcsPassword } = loggedInUser.bcsLoginInfo
    const activeStudents = studentRoster.filter(student => !droppedStudents.includes(student))

    // DECLARING STATE
    const [rawData, setRawData] = useState(null)
    const [stuAttArr, setStuAttArr] = useState(null)
    const [modifiableStuAttArr, setModifiableStuAttArr] = useState(null)
    const [filter, setFilter] = useState('')

    // OTHER VARIABLE DECLARATIONS
    // get bg color for table cells
    const MAP_BG_COLOR = {
        excused: 'table-primary',
        pending: 'table-warning',
        present: 'table-success',
        remote: 'table-secondary',
        absent: 'table-danger'
    }

    useEffect(() => {
        async function fetchData() {
            const attendance = await API.getAttendance(bcsEmail, bcsPassword, bcsCohortId, enrollmentId)
            await setRawData(attendance)
            // console.log({ attendance })
            const studentAttendance = await makeStudentAttendanceObjects(attendance)
            // console.log({ studentAttendance })
            setStuAttArr(studentAttendance)
            setModifiableStuAttArr(studentAttendance)
        }
        fetchData()
    }, [])

    const sessionNamesArr = rawData?.map(obj => obj.chapter + ' - ' + Object.keys(obj)[0]) || [];
    // console.log({ modifiableStuAttArr })
    // console.log({ stuAttArr })
    // console.log(sessionNamesArr)
    console.log({ rawData })
    // DATA GROUPING: WANT ARRAY OF STUDENT -> ARRAY OF SESSION OBJS W/ ATTENDANCE
    const makeStudentAttendanceObjects = (attendanceData) => {
        const newArr = activeStudents.map(student => {
            let newObj = {
                student,
                sessions: [],
                absences: 0,
            };
            attendanceData.forEach(sessObj => {
                // CURRENT LOOP SESSION NAME
                // console.log({ sessObj })
                const currKey = Object.keys(sessObj)[0];
                // GET CURRENT STUDENT ATTENDANCE FOR CURRENT SESSION
                const stuAtt = sessObj[currKey].find(attObj => attObj.name === student)
                // console.log({ stuAtt })
                const sessDate = new Date(sessObj.date)
                const now = new Date()
                if (!stuAtt.attendance.excused && !stuAtt.attendance.present && !stuAtt.attendance.remote && sessDate < now) {
                    newObj.absences++
                }
                stuAtt.date = sessObj.date;
                stuAtt.isPast = sessObj.isPast;
                stuAtt.chapter = sessObj.chapter;
                newObj.sessions.push(stuAtt)
            })
            // console.log({ newObj })
            return newObj;
        })
        // console.log({ newArr })
        return newArr;
    }

    const handleInput = async (e) => {
        const { value } = e.target;
        setFilter(value)
    }

    return (
        <div className="Attendance">
            {/* <h1>ATTENDANCE!!</h1> */}
            <div className="row">
                <div className="col-12 col-md-8 border-bcs p-2 mt-2 mb-1">
                    <p className="lead text-center mt-3">
                        This table displays student attendance. Use the 'Filter Students' input to search the table for a specific student's attendance records.
                    </p>
                    <p className="lead text-center text-bold mt-3">
                        <strong>
                            Note: There may be errors in displaying attendance for sessions with the same name - this issue is being worked on and should be fixed soon.
                        </strong>
                    </p>
                </div>
                <div className="col-12 col-md-4 d-flex justify-content-center p-2 mt-2 mb-1 bg-bcs text-light rounded-right align-items-center">
                    <form>
                        <div className="form-group">
                            <label htmlFor="filter-input">
                                Filter Students:
                            </label>
                            <input className="form-control" name="filter-input" id="filter-input" type="text" value={filter} onChange={handleInput} />
                        </div>
                    </form>
                    {/* {filter.length > 0 ? (
                        <p>
                            Found {modifiableStuAttArr.length} records
                        </p>
                    ) : null} */}
                </div>
            </div>

            <div className="my-5 border" style={{ overflow: 'auto', maxHeight: '75vh', width: '100%' }}>
                {rawData ? (
                    <div className="table-wrapper w-100">
                        <table className="table table-sm table-hover table-condensed w-100">
                            <thead>
                                <tr>
                                    <th className="table-light th-name-avg">
                                        Name
                                    </th>
                                    <th className="table-light " style={{ position: 'sticky', left: 92, zIndex: 3 }}>
                                        Absences
                                    </th>
                                    {sessionNamesArr.map(sessName => {
                                        return <th key={sessName} scope="col">{sessName}</th>
                                    })}
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    modifiableStuAttArr ? (
                                        modifiableStuAttArr
                                            .filter(attObj => attObj.student.toLowerCase().includes(filter.toLowerCase()))
                                            .map(stuAttObj => {

                                                return (
                                                    <tr key={stuAttObj.student}>
                                                        <th className="table-light th-name-avg">
                                                            {stuAttObj.student}

                                                        </th>
                                                        <th style={{ position: 'sticky', left: 92, zIndex: 2 }} className={`table-${stuAttObj.absences < 6 ? 'light' : 'danger'} text-center`}>
                                                            {stuAttObj.absences}
                                                        </th>
                                                        {
                                                            stuAttObj.sessions
                                                                .sort((a, b) => {
                                                                    const date1 = new Date(a.date).getTime();
                                                                    const date2 = new Date(b.date).getTime()

                                                                    if (date1 < date2) {
                                                                        return -1;
                                                                    } else if (date2 < date1) {
                                                                        return 1;
                                                                    }
                                                                    return 0
                                                                })
                                                                .map((sessionObj, i) => {
                                                                    const { excused, pending, present, remote } = sessionObj.attendance;
                                                                    // console.log({ sessionObj })
                                                                    const sessStatus = excused ? 'excused' : pending ? 'pending' : present ? 'present' : remote ? 'remote' : 'absent'
                                                                    return (
                                                                        <td key={`${sessionObj.name} + ${i}`} className={MAP_BG_COLOR[sessStatus]}>
                                                                            <span data-studentname={sessionObj.name} data-session={sessionObj.session}>{excused ? 'Excused' : pending ? 'Pending' : present ? 'Present' : remote ? 'Remote' : 'Absent'}</span>
                                                                        </td>
                                                                    )
                                                                })}
                                                    </tr>
                                                )
                                            })
                                    ) : (
                                        <tr>
                                            <td>
                                                loading...
                                            </td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="d-flex align-items-center my-5 p-5">
                        <strong>Loading Attendance Data...</strong>
                        <div className="spinner-border ms-auto" role="status" aria-hidden="true"></div>
                    </div>
                )}
            </div>
        </div>
    )
}
