import React from 'react'
import AddNote from '../AddNote'


export default function CohortNotes({ cohortNotes, loggedInUser, cohortId }) {






    return (
        <div className="CohortNotes">
            {/* <h3 className="bg-dark text-light text-bold p-1">Cohort Notes:</h3> */}
            <div className="notes-content row">
                <div className="col-lg-6 text-center">

                    <ul className="list-group">
                        {cohortNotes.map(note => {
                            return (
                                <li key={note["_id"]} className="list-group-item">
                                    <p className="border">{note.content}</p>
                                    {/* <br /> */}
                                    - <strong>{note.createdBy.name}</strong>&nbsp;<small><em>{new Date(parseInt(note.createdAt)).toLocaleString()}</em></small>
                                </li>
                            )
                        })}
                    </ul>
                </div>
                <div className="col-lg-6">

                    <AddNote userId={loggedInUser._id} recipientId={cohortId} />
                </div>

            </div>
        </div>
    )
}
