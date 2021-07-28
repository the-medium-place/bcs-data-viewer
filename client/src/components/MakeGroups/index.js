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
        setGradesArr([])
        if (value <= 0) { setNumGroups(1) }

        setNumGroups(value)
    }

    const chunkArray = () => {
        // empty obj to hold group arrays
        const groupsObj = {};
        // sort array by grade
        const sortedArr = gradesArr.sort((a, b) => a.gradeAvg - b.gradeAvg)
        console.log(sortedArr)

        for (let i = 1; i <= numGroups; i++) {
            // create object with multiple keys (num of groups)
            groupsObj[`Group ${i}`] = [];
        }

        // one-by-one push objects to new arrays in order (since they are sorted, the grades will be evenly distributed)
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


        console.log(groupsObj)
        return groupsObj;
    }

    const handleGroupButtonClick = async (e) => {
        e.preventDefault();
        setShowGroups(false);
        setGradesArr([])
        // console.log({ activeStudents });
        await activeStudents.forEach(student => {
            // console.log({ student })
            const arrCopy = gradesArr;
            arrCopy.push(getGradeAvg(student));
            setGradesArr(arrCopy)
        })
        await setGroups(chunkArray(gradesArr))
        setShowGroups(true);
        console.log(gradesArr);

        console.log(chunkArray(gradesArr));
    }


    return (
        <div className="MakeGroups">
            {gradeData ? (

                <div className="d-flex justify-content-center w-100 mt-5 mb-1 w-25">
                    {/* <h3>no. active students: {activeStudents.length}</h3>
                    <h3>no. gradesArr: {gradesArr.length}</h3> */}
                    <form onSubmit={handleGroupButtonClick}>
                        <label className="form-label" htmlFor="numGroups">Desired number of groups:</label>
                        <input className="form-control" type="number" min="1" name="numGroups" id="numGroups" value={numGroups} onChange={handleGroupNumChange} />
                        <button type="submit">Form Groups</button>
                    </form>
                </div>

            ) : <p>loading data...</p>}
            <div className="groups-wrapper d-flex justify-content-around flex-wrap mb-5" style={{ border: '1px solid black', }}>
                <br />
                {/* <p>{JSON.stringify(gradeData)}</p> */}
                {showGroups ? (
                    Object.keys(groups).map(group => {

                        return (
                            <div className="m-2 text-center flex-wrap w-25 border">

                                {/* <span>{student} {gradeAvg}</span> */}
                                {/* <span>{JSON.stringify(groups[group])}</span> */}
                                {groups[group].map(student => {
                                    return (
                                        <><span>{student.student}</span><br /></>
                                    )
                                })}
                            </div>
                        )
                    }
                    )
                ) : (
                    <div className="d-flex align-items-center my-5 p-5">
                        <strong>Forming Groups...</strong>
                        <div className="spinner-border ms-auto" role="status" aria-hidden="true"></div>
                    </div>
                )
                }
            </div>
        </div>
    )
}
