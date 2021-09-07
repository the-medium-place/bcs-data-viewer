import React from 'react'

export default function ViewNotesBox({ groupName, groupNotes, groupMembers }) {
    console.log({ groupName, groupNotes, groupMembers })

    const renderStudentNames = () => {
        const namesArr = groupMembers.map(studObj => studObj.student);
        return namesArr.join(' - ')
    }


    return (
        <div className="ViewNotesBox">
            <div className="mb-3 row bg-bcs p-2 rounded shadow shadow-sm">
                <div className="text-center bg-light col-12 border-bcs mx-1 text-dark rounded p-2">
                    <strong className="p-2 rounded">{groupName}</strong>
                    <br />
                    <span className="">{renderStudentNames()}</span>
                </div>
                <div className="col-12 mx-1 text-light">
                    {/* notes textarea */}
                    <h4 className="border-bottom">Notes:</h4>
                    <div className="d-flex justify-content-around">
                        {groupNotes.length > 0 ? groupNotes.map(note => {
                            return <NotesCard note={note} />
                        }) : <h3 className="text-center">No saved notes. Use the 'Presentation Notes' tab above to add presentation feedback.</h3>}
                    </div>
                </div>
            </div>
        </div>
    )
}

function NotesCard({ note }) {
    console.log(note)

    return (
        <div class="card text-dark mx-2" style={{ width: "18rem" }}>
            <div class="card-body">
                <h4 class="card-title">{note.author.name}</h4>
                <h6 class="card-subtitle mb-2 text-muted">Grade: {note.grade}</h6>
                {note.notes.split('\n').map((text, i) => <p className="card-text" key={`${text}-${i}`}>{text}</p>)}
            </div>
        </div>
    )
}
