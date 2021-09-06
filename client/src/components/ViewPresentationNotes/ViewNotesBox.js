import React from 'react'

export default function ViewNotesBox({ groupName, groupNotes }) {
    console.log({ groupName, groupNotes })
    return (
        <div className="ViewNotesBox">
            <div className="mb-3 row bg-bcs p-2 rounded shadow shadow-sm">
                <div className="text-center col-12 border-bcs mx-1">
                    <strong className="bg-light p-2 rounded">{groupName}</strong>
                </div>
                <div className="col-12 mx-1 text-light">
                    {/* notes textarea */}
                    <strong>Notes:</strong>
                    <div className="d-flex justify-content-around">
                        {groupNotes.length > 0 ? groupNotes.map(note => {
                            return <NotesCard note={note} />
                        }) : null}
                    </div>
                </div>
            </div>
        </div>
    )
}

function NotesCard({ note }) {
    console.log(note)
    return (
        <div class="card text-dark" style={{ width: "23%" }}>
            <div class="card-body">
                <h5 class="card-title">{note.author.name}'s Notes</h5>
                <h6 class="card-subtitle mb-2 text-muted">Grade: {note.grade}</h6>
                <p class="card-text">{note.notes}</p>
            </div>
        </div>
    )
}
