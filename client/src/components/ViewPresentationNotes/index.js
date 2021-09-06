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
        <div className="ViewPresentationNotes">
            <h1 className="text-center">View Notes</h1>
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
                        <p>{currentGroup.title}</p>
                        {Object.keys(currentGroup.groups).map(group => {
                            return (<ViewNotesBox groupName={group} groupNotes={getGroupNotes(group)} />)
                        })}
                    </>
                ) : <p>something went wrong...</p>}
            </div>
        </div>
    )
}
