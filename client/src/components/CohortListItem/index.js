import React from 'react'
import { ADD_COHORT } from '../../utils/mutations';
import { useMutation } from '@apollo/client';
import API from '../../utils/API';

export default function CohortListItem({ cohort, saveButton, loggedInUser }) {

    const [addCohort, { error, data }] = useMutation(ADD_COHORT);



    const getStudentData = async e => {
        // console.log("running getStudentData()")

        let studentArr = [];

        // console.log('running the api check')
        const studentData = await API.getStudentNames(loggedInUser.bcsLoginInfo.bcsEmail, loggedInUser.bcsLoginInfo.bcsPassword, cohort.cohortId)
        // console.log('studentData: ', studentData)
        if (studentData.data) {
            studentData.data.forEach(studentObj => {
                if (!studentArr.includes(studentObj.studentName)) {
                    studentArr.push(studentObj.studentName)
                }
            })
            // console.log('studentArr: ', studentArr)
            return studentArr;
        }

        return 'Something went wrong...';
    }

    // getStudentData();

    const handleSave = async e => {
        console.log(cohort)
        // create a muteable copy of the cohort prop
        const cohortCopy = { ...cohort };

        const studentRoster = await getStudentData();

        // add the studentroster key to the cohort object
        cohortCopy.studentRoster = studentRoster;
        console.log('cohortCopy: ', cohortCopy)

        try {
            const { data } = await addCohort({
                variables: cohortCopy,
            });
            console.log(data)
        } catch (err) {
            console.log(err)
        }
    }
    // console.log(JSON.stringify(error))

    return (
        <li className="CohortListItem" styla={{ display: 'flex', justifyContent: 'space-between', width: '100%', flexDirection: 'row' }}>
            <p>{cohort.cohortCode}</p>
            <p>{cohort.cohortId}</p>
            <p>{cohort.enrollmentId}</p>
            {saveButton ? <button onClick={handleSave}>Save to profile</button> : null}
        </li>
    )
}
