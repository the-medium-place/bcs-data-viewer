import React, { useState } from 'react'
import ViewNotesBox from './ViewNotesBox';

export default function ViewPresentationNotes({ cohortGroups }) {

    const [currentGroup, setCurrentGroup] = useState(null)

    const getGroupNotes = (groupName) => {
        const groupNotes = currentGroup.notes.filter((note) => {
            return note.groupName === groupName
        })
        return groupNotes;
    }

    return (
        <div className="ViewPresentationNotes my-5">
            <h1 className="text-center">View Feedback</h1>
            <div className="d-flex justify-content-center">

                <p className="lead text-center mt-3 border-bcs rounded p-3 d-inline-block">
                    Select a group below to see all saved notes from all users.
                </p>
            </div>
            <div className="group-notes-wrapper">
                {/* DROP DOWN TO SELECT GROUPING FOR NOTES */}
                <div className="d-flex justify-content-center mb-5">
                    <select onChange={(e) => { console.log(e.target.value); setCurrentGroup(cohortGroups.find(group => group.title === e.target.value)) }} className="form-select w-50" aria-label="Default select example">
                        <option selected disabled defaultValue>Select a group - </option>
                        {cohortGroups.map((group, i) => {
                            return <option key={`${group.title}-${i}`} value={group.title}>{group.title}</option>
                        })}
                    </select>
                    <hr />
                </div>
                {currentGroup ? (
                    <>
                        <h2 className="text-center">{currentGroup.title}</h2>
                        {Object.keys(currentGroup.groups).map(group => {
                            return (<ViewNotesBox groupName={group} groupNotes={getGroupNotes(group)} groupMembers={currentGroup.groups[group]} />)
                        })}
                    </>
                ) : null}
            </div>
        </div>
    )
}
