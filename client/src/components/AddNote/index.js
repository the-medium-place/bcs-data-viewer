import React, { useState } from 'react'
import { useMutation } from '@apollo/client';
import { ADD_COHORT_NOTE } from '../../utils/mutations'

export default function AddNote({ userId, recipientId }) {

    const [addCohortNote, { error: newNoteError, data: newNoteData }] = useMutation(ADD_COHORT_NOTE)

    const [noteContent, setNoteContent] = useState('');

    if (newNoteError) { console.log(JSON.stringify(newNoteError)) }

    const handleNoteChange = async e => {
        setNoteContent(e.target.value)
    }

    const handleNoteSubmit = async e => {
        e.preventDefault();
        console.log(noteContent)
        try {
            const { data } = await addCohortNote({
                variables: { content: noteContent, cohortId: recipientId, createdBy: userId },
            });
            console.log(data)
            setNoteContent('')
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className="d-flex w-75 justify-content-center main-content">
            <div className="container-fluid">
                <form className="form-group row" id="add-note" onSubmit={handleNoteSubmit}>
                    <h2>Add new note:</h2>
                    <textarea name="note-text" id="note-text" className="form-input" rows="8" value={noteContent} onChange={handleNoteChange} />
                    <button className="form-btn w-100 text-center" type="submit">Add Note</button>
                </form>
            </div>
        </div>
    )
}
