import React, { useState } from 'react'
import PresentationBox from './PresentationBox'
import { useQuery } from '@apollo/client';
import { GET_GROUPS } from '../../utils/queries';

export default function PresentationNotes({ currentGroup, loggedInUser }) {
    const title = currentGroup.title;
    const groupsObj = currentGroup.groups;
    const groupNamesArr = Object.keys(groupsObj)
    const groupsId = currentGroup._id;
    const userId = loggedInUser._id;
    console.log(loggedInUser)

    const { data, loading, error } = useQuery(GET_GROUPS, {
        variables: { groupsId }
    });
    if (error) { console.log(JSON.stringify(error)) }

    const groupsData = data?.getGroups || null;
    if (data) { console.log(groupsData) }

    const getGroupNotes = (groupName) => {

        const userGroupNotes = groupsData.notes.filter(note => {
            return (note.groupName === groupName && note.author === userId)
        })
        console.log({ userGroupNotes })
        return userGroupNotes.length > 0 ? { notes: userGroupNotes[0].notes, grade: userGroupNotes[0].grade, noteId: userGroupNotes[0]._id } : null;
        // return userGroupNotes.notes
    }



    return (
        <div className="PresentationNotes mb-5">
            <h1 className="text-center">{title}</h1>
            {groupNamesArr.map((name, i) => {
                return (
                    <>
                        {loading ? <h1>loading...</h1> : data ? (

                            <PresentationBox key={`${name}-${i}`} name={name} groupsObj={groupsObj} groupsId={currentGroup._id} groupNotes={getGroupNotes(name)} />
                        ) : error ? <h1>there was an error...</h1> : null}
                    </>
                )
            })}
        </div>
    )
}
