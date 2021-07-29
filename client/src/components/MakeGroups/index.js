import React, { useState, useEffect } from 'react'
import API from '../../utils/API';

export default function MakeGroups({ loggedInUser, studentRoster, droppedStudents, bcsCohortId, enrollmentId }) {


    const bcsEmail = loggedInUser.bcsLoginInfo.bcsEmail;
    const bcsPassword = loggedInUser.bcsLoginInfo.bcsPassword;
    const activeStudents = studentRoster.filter(student => !droppedStudents.includes(student))
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
        'Overdue!': 13,
        'Not Due!': 13,
        'Ungraded': 13,
        'N/A': 0
    }


    const [gradeData, setGradeData] = useState(null);
    const [numGroups, setNumGroups] = useState(6);
    const [gradesArr, setGradesArr] = useState([])
    const [groups, setGroups] = useState(null);
    const [showGroups, setShowGroups] = useState(false);
    const [showButton, setShowButton] = useState(true)


    // GET AND STORE ALL GRADE DATA
    useEffect(() => {
        async function fetchData() {

            setGradeData(await API.getGradeData(bcsEmail, bcsPassword, bcsCohortId, enrollmentId));
        }
        fetchData();

    }, [])

    // GET AVERAGE GRADE FOR SINGLE STUDENT
    const getGradeAvg = (student) => {
        let numDue = 0,
            totalGradeVal = 0,
            gradeAvg = 0;

        gradeData.studentObj[student].assignments.forEach(assignmentObj => {
            if (assignmentObj.isDue) {
                numDue++
                totalGradeVal += MAP_GRADES_TO_INT[assignmentObj.grade]
            }
        })
        gradeAvg = totalGradeVal / (numDue || 1);
        return { student, gradeAvg };
    }

    const handleGroupNumChange = e => {
        const value = e.target.value;
        // SHOW THE 'MAKE GROUPS' BUTTON
        setShowButton(true);

        // RESET gradesArr STATE
        setGradesArr([])

        // UPDATE numGroups STATE
        if (value <= 0) { setNumGroups(1) }
        setNumGroups(value)
    }

    /**
     * Groups student objects into chunks
     * @returns groupsObj
     */
    const chunkArray = () => {
        // EMPTY OBJECT TO HOLD FINAL GROUPS
        const groupsObj = {};

        // SORT STUDENT ARRAY BY AVERAGE GRADE VALUE
        const sortedArr = gradesArr.sort((a, b) => a.gradeAvg - b.gradeAvg)
        // console.log(sortedArr)

        for (let i = 1; i <= numGroups; i++) {
            // CREATE KEY IN groupsObj FOR EACH GROUP
            groupsObj[`Group ${i}`] = [];
        }

        // PUSH STUDENTS INTO GROUPS ONE-BY-ONE IN ORDER --
        // SINCE STUDENTS ARE SORTED BY GRADE, DIFFERENT GRADE
        // AVERAGES WILL BE SPREAD EVENLY THROUGHOUT THE GROUPS
        let counter = 1;
        sortedArr.forEach(gradeObj => {
            if (counter <= numGroups) {
                groupsObj[`Group ${counter}`].push(gradeObj);
                counter++;
            } else {
                counter = 1;
                groupsObj[`Group ${counter}`].push(gradeObj);
                counter++;
            }
        })


        // console.log(groupsObj)
        return groupsObj;
    }

    const handleGroupButtonClick = async (e) => {
        e.preventDefault();

        // HIDE THE 'MAKE GROUPS' BUTTON
        setShowButton(false)

        // LOOP THROUGH ACTIVE STUDENTS
        // getGradeAvg() RETURNS OBJECT --
        // {student: <student name>, gradeAvg: <numerical representation of average grade>}
        // PUSH RESULTING OBJECT TO gradesArr STATE
        await activeStudents.forEach(student => {
            // console.log({ student })
            const arrCopy = gradesArr;
            arrCopy.push(getGradeAvg(student));
            setGradesArr(arrCopy)
        })

        // UPDATE groups STATE
        // chunkArray() RETURNS OBJECT --
        // EACH KEY IS A GROUP AND VALUE IS AN ARRAY OF STUDENT OBJECTS MAKING UP THAT GROUP
        await setGroups(chunkArray())

        // SHOW THE GROUPS
        setShowGroups(true);
    }


    return (
        <div className="MakeGroups">
            <p className="text-center mt-3" >Use this tool to form groups for projects and/or class activities. Groups are formed by calculating the 'average' grade for each student, then evenly distributing students among the selected number of groups so that each group has a mixture of performance levels.</p>

            {gradeData ? (

                <div className="d-flex justify-content-center w-100 p-2 mt-2 mb-1 w-25 bg-dark text-light">
                    <form onSubmit={handleGroupButtonClick}>
                        <label className="form-label" htmlFor="numGroups"><strong>Desired number of groups:</strong></label>
                        <input className="form-control" type="number" min="1" name="numGroups" id="numGroups" value={numGroups} onChange={handleGroupNumChange} />
                        <div className="button-wrapper w-100 d-flex justify-content-center p-1" style={{ height: '3rem' }}>
                            {showButton ? <button className="btn btn-secondary" type="submit" onClick={handleGroupButtonClick}>Form Groups</button> : null}
                        </div>
                    </form>
                </div>

            ) : (
                <div className="d-flex align-items-center my-5 p-5">
                    <strong>Preparing student data...</strong>
                    <div className="spinner-border ms-auto" role="status" aria-hidden="true"></div>
                </div>
            )}
            <div className="groups-wrapper d-flex justify-content-center flex-wrap mb-5" style={{ border: '1px solid black', }}>
                <br />
                {showGroups ? (
                    Object.keys(groups).map((group, i) => {

                        return (
                            <div key={group} className="m-2 text-center flex-wrap w-25 border shadow shadow-sm rounded">
                                <ol>
                                    <strong>{`Group ${i + 1}`}</strong>
                                    {groups[group].map(student => {
                                        return (
                                            <li key={student.student}>{student.student}</li>
                                        )
                                    })}
                                </ol>
                            </div>
                        )
                    }
                    )
                ) : (
                    <div className="d-flex align-items-center justify-content-center text-center my-5 p-5 w-100">
                        <strong>{gradeData ? 'Ready to form groups!' : 'Waiting on data...'}</strong>
                    </div>
                )
                }
            </div>
        </div>
    )
}
