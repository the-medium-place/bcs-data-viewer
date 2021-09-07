import React, { useState } from 'react'
import PresentationNotes from '../PresentationNotes'

export default function ProjectPresentations({ cohortGroups, loggedInUser }) {

    const [currentGroup, setCurrentGroup] = useState(null);

    // console.log(cohortGroups[0].title)
    // console.log(loggedInUser)

    return (
        <div className="ProjectPresentations row my-5">
            <div className="col">
                <h1 className="text-center">Presentations Feedback</h1>
                <div className="d-flex justify-content-center">

                    <p className="lead border-bcs p-2 w-75">Select a group below to add or edit feedback for group project presentations. Any feedback you saved will be displayed.</p>
                </div>
            </div>
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
