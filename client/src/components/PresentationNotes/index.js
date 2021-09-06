import React, { useState } from 'react'
import PresentationBox from './PresentationBox'

export default function PresentationNotes({ currentGroup, loggedInUser }) {
    const title = currentGroup.title;
    const groupsObj = currentGroup.groups;
    const groupNamesArr = Object.keys(groupsObj)
    console.log(currentGroup)


    const [modifiableGroup, setModifiableGroup] = useState({ ...currentGroup })





    return (
        <div className="PresentationNotes mb-5">
            <h1 className="text-center">{title}</h1>
            {groupNamesArr.map((name, i) => {
                return (
                    <PresentationBox key={`${name}-${i}`} name={name} groupsObj={groupsObj} groupsId={currentGroup._id} />
                )
            })}
        </div>
    )
}
