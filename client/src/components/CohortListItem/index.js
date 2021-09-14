import React from 'react'
import { ADD_COHORT } from '../../utils/mutations';
import { useMutation } from '@apollo/client';
import API from '../../utils/API';

export default function CohortListItem({ cohort, saveButton, loggedInUser, cohortCodeArray }) {

    const [addCohort, { error, data }] = useMutation(ADD_COHORT);

    console.log(cohort)

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
        <li role="button" className="CohortListItem list-group-item list-group-item-action w-100 text-center d-flex justify-content-center border my-1 shadow shadow-sm">
            <div className="d-flex flex-column justify-content-center w-100">
                {saveButton ? (
                    <>
                        <img src={cohort.universityLogo} alt={`${cohort.university} Logo`} style={{ width: '6rem' }} className="mx-auto mt-3" />
                        <p>{cohort.university}</p>
                        <p className="text-muted">{new Date(cohort.startDate).toDateString()} - {new Date(cohort.endDate).toDateString()}</p>
                    </>
                ) : null}
                <p className="lead my-2" style={{ textDecoration: 'none' }}>{cohort.cohortCode}</p>
                {saveButton ? <button className="btn bg-bcs text-light mx-auto" style={{ width: '50%' }} onClick={handleSave} disabled={cohortCodeArray.includes(cohort.cohortCode)}>{cohortCodeArray.includes(cohort.cohortCode) ? "Already Connected!" : "Connect!"}</button> : null}
            </div>
        </li>
    )
}
