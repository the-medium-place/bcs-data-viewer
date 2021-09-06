import React, { useState } from 'react'
import PresentationNotes from '../PresentationNotes'

export default function ProjectPresentations({ cohortGroups, loggedInUser }) {

    const [currentGroup, setCurrentGroup] = useState(null);

    // console.log(cohortGroups[0].title)
    // console.log(loggedInUser)

    return (
        <div className="ProjectPresentations row">
            <div className="col">
                <h1>Presentations!!</h1>
                <p className="lead">This will be a space to save and aggregate all instructors' notes on group projects presentations. </p>
                <p className="text-danger">Not Yet Functional!</p>
            </div>
            <hr />
            <div className="notes-wrapper">
                {/* DROP DOWN TO SELECT GROUPING FOR NOTES */}
                <div className="d-flex justify-content-center mb-5">
                    <select onChange={(e) => { console.log(e.target.value); setCurrentGroup(cohortGroups.find(group => group.title === e.target.value)) }} className="form-select w-50" aria-label="Default select example">
                        <option selected disabled defaultValue>Select a group - </option>
                        {cohortGroups.map((group, i) => {
                            return <option key={`${group.title}-${i}`} value={group.title}>{group.title}</option>
                        })}
                    </select>
                </div>

                {/* VIEW ALL GROUPS IN SELECTED GROUPING -- W/ TEXTAREA FOR NOTES AND DROPDOWN FOR GRADE -- AND SAVE BUTTON? */}
                <div>

                    {currentGroup ? (
                        <PresentationNotes loggedInUser={loggedInUser} currentGroup={currentGroup} />
                    ) : null}
                </div>
            </div>
        </div >
    )
}
