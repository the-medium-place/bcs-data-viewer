import React from 'react'
import { ADD_COHORT } from '../../utils/mutations';
import { useMutation } from '@apollo/client';
import API from '../../utils/API';

export default function CohortListItem({ cohort, saveButton, loggedInUser }) {

    const [addCohort, { error, data }] = useMutation(ADD_COHORT);



    const getStudentData = async e => {

        let studentArr = [];

        const studentData = await API.getStudentNames(loggedInUser.bcsLoginInfo.bcsEmail, loggedInUser.bcsLoginInfo.bcsPassword, cohort.cohortId)
        if (studentData.data) {
            studentData.data.forEach(studentObj => {
                if (!studentArr.includes(studentObj.studentName)) {
                    studentArr.push(studentObj.studentName)
                }
            })
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
        <li role="button" className="CohortListItem list-group-item list-group-item-action w-100 text-center d-flex justify-content-center w-100">
            <p className="lead mb-1" style={{ textDecoration: 'none' }}>{cohort.cohortCode} {saveButton ? <button className="btn btn-secondary" onClick={handleSave}>Save to profile</button> : null}</p>
        </li>
    )
}
