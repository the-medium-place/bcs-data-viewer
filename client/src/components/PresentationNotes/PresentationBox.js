import React, { useState } from 'react'
import { useMutation } from '@apollo/client';
import { ADD_PRESENTATION_NOTES } from '../../utils/mutations';


export default function PresentationBox({ name, groupsObj, loggedInUser, groupsId }) {
    // console.log(groupsObj)

    const [noteData, setNoteData] = useState({
        groupName: name,
        notes: '',
        grade: null
    })

    const [buttonDisable, setButtonDisable] = useState(false);

    const [addPresentationNotes, { error, data }] = useMutation(ADD_PRESENTATION_NOTES);
    if (error) { console.log(JSON.stringify(error)) }

    const handleInput = (e) => {
        const { value, name } = e.target;
        if (buttonDisable) { setButtonDisable(false) }
        setNoteData({ ...noteData, [name]: value })
    }

    const handleSaveClick = async e => {
        e.preventDefault();
        setButtonDisable(true);
        // console.log(noteData)
        try {
            const { data } = await addPresentationNotes({
                variables: {
                    ...noteData,
                    groupsId
                },
            });
            console.log(data);

        } catch (e) {
            console.error(e);
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
                <textarea value={noteData.notes} onChange={handleInput} name="notes" className="w-100 my-1 border-bcs"></textarea>
            </div>
            <div className="col-md-1 mx-1 text-light">
                {/* grade dropdown */}
                <strong>Grade:</strong>
                <select onChange={handleInput} value={noteData.grade} name="grade">
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
                <input type="button" className="btn btn-light text-bcs mt-1" value={buttonDisable ? 'Saved' : 'Save'} onClick={handleSaveClick} disabled={buttonDisable} />
            </div>
        </div>
    )
}
