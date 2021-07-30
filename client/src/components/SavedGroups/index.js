import React from 'react'
import GroupsBox from '../GroupsBox';

export default function SavedGroups({ cohortGroups }) {
    return (
        <div className="SavedGroups my-5 d-flex flex-column-reverse">
            {cohortGroups.length > 0 ? (
                cohortGroups.map(groups => {
                    return (
                        <GroupsBox groups={groups} />
                    )
                })
            ) : <h3 className="text-center border p-2">No saved groups! Click on 'Make Groups' to create and save student groups!</h3>}
        </div>
    )
}
