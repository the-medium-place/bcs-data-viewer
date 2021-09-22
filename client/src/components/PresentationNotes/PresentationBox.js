import React, { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client';
import { ADD_PRESENTATION_NOTES, UPDATE_PRESENTATION_NOTES } from '../../utils/mutations';


export default function PresentationBox({ name, groupsObj, loggedInUser, groupsId, groupNotes }) {
    // console.log(groupNotes ? groupNotes : 'no notes for ' + name + ' from this user')

    // const noteText = groupNotes ? groupNotes.notes : '';
    // const noteGrade = groupNotes ? groupNotes.grade : null;
    const noteId = groupNotes ? groupNotes.noteId : '';


    const [noteData, setNoteData] = useState({
        groupName: name,
        notes: '',
        grade: null
    })
    const [modifiableNoteData, setModifiableNoteData] = useState({
        groupName: name,
        notes: '',
        grade: null
    })

    useEffect(() => {
        setNoteData({
            ...noteData,
            notes: groupNotes ? groupNotes.notes : '',
            grade: groupNotes ? groupNotes.grade : null
        })

        setModifiableNoteData({
            ...noteData,
            notes: groupNotes ? groupNotes.notes : '',
            grade: groupNotes ? groupNotes.grade : null
        })
    }, [groupNotes])


    const [buttonDisable, setButtonDisable] = useState(false);


    const [addPresentationNotes, { error, data, loading }] = useMutation(ADD_PRESENTATION_NOTES);
    if (error) { console.log(JSON.stringify(error)) }

    const [updatePresentationNotes, { error: updateErr, data: updateData, loading: updateLoading }] = useMutation(UPDATE_PRESENTATION_NOTES);
    if (updateErr) { console.log(JSON.stringify(updateErr)) }

    const handleInput = (e) => {
        const { value, name } = e.target;
        if (buttonDisable) { setButtonDisable(false) }
        setModifiableNoteData({ ...modifiableNoteData, [name]: value })
    }

    const handleSaveClick = async e => {
        e.preventDefault();

        setButtonDisable(true);
        console.log(modifiableNoteData)

        if (!groupNotes) {

            console.log('No note data found, saving...')
            try {
                const { data } = await addPresentationNotes({
                    variables: {
                        ...modifiableNoteData,
                        groupsId
                    },
                });
                console.log(data);

            } catch (e) {
                console.error(e);
            }
        } else {
            console.log("note data present: updating...")
            try {
                const { data } = await updatePresentationNotes({
                    variables: {
                        ...modifiableNoteData,
                        groupsId,
                        noteId
                    }
                })
                console.log(data)

            } catch (e) { console.error(e) }
        }
    }

    return (
        <div className="mb-3 row bg-bcs p-2 rounded shadow shadow-sm">
            <div className="col-md-3 bg-light border-bcs mx-1">
                <ul>
                    <strong>{name}</strong>
                    {groupsObj[name].map(studentObj => {
                        return <li key={studentObj.student}>{studentObj.student}</li>
                    })}
                </ul>
            </div>
            <div className="col-md-7 mx-1 text-light">
                {/* notes textarea */}
                <strong>Notes:</strong>
                <textarea value={modifiableNoteData.notes} onChange={handleInput} name="notes" className="w-100 my-1 border-bcs"></textarea>
            </div>
            <div className="col-md-1 mx-1 text-light">
                {/* grade dropdown */}
                <strong>Grade:</strong>
                <select onChange={handleInput} value={modifiableNoteData.grade} name="grade">
                    <option selected defaultValue disabled>Select Grade</option>
                    <option value="A+">A+</option>
                    <option value="A">A</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B">B</option>
                    <option value="B-">B-</option>
                    <option value="C+">C+</option>
                    <option value="C">C</option>
                    <option value="C-">C-</option>
                    <option value="D+">D+</option>
                    <option value="D">D</option>
                    <option value="D-">D-</option>
                    <option value="F">F</option>
                    <option value="I">I</option>
                </select>
                <input type="button" className="btn btn-light text-bcs mt-1" value={(error || updateErr) ? 'ERROR' : (loading || updateLoading) ? 'Loading...' : updateData ? "Saved!" : "Save"} onClick={handleSaveClick} disabled={buttonDisable} />
                <input type="button" className="btn btn-light text-bcs mt-1" value="Reset" onClick={() => { setModifiableNoteData({ ...noteData }) }} />
            </div>
        </div>
    )
}
