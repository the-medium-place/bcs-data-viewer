import React from 'react'
import { ADD_COHORT } from '../../utils/mutations';
import { useMutation } from '@apollo/client';

export default function CohortListItem({ cohort, saveButton }) {

    const [addCohort, { error, data }] = useMutation(ADD_COHORT);

    const handleSave = async e => {
        console.log(cohort)
        try {
            const { data } = await addCohort({
                variables: cohort,
            });
            console.log(data)
        } catch (err) {
            console.log(err)
        }
    }
    console.log(JSON.stringify(error))

    return (
        <li className="CohortListItem" styla={{ display: 'flex', justifyContent: 'space-between', width: '100%', flexDirection: 'row' }}>
            <p>{cohort.cohortCode}</p>
            <p>{cohort.cohortId}</p>
            <p>{cohort.enrollmentId}</p>
            {saveButton ? <button onClick={handleSave}>Save to profile</button> : null}
        </li>
    )
}
