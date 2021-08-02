import React from 'react'

export default function GroupsBox({ groups }) {
    return (
        <div className="groups-wrapper bg-secondary flex-column d-flex jusfity-content-center flex-wrap w-100 my-2 border" key={groups._id} data-id={groups._id}>
            <h3 className="text-center mt-2">{groups.title}</h3>
            <div className="d-flex flex-wrap w-100 justify-content-center">
                {Object.keys(groups.groups).map(groupsArr => {
                    console.log(groupsArr, groups.groups[groupsArr])
                    // groupsArr => object Key ('Group 1', etc...)
                    // groups.groups[groupsArr] => array of group member objects
                    return (
                        <div key={groupsArr} className="bg-light m-2 text-center flex-wrap w-25 border shadow shadow-sm rounded">
                            <strong><u>{groupsArr}</u></strong>
                            <ol>
                                {groups.groups[groupsArr].map(studentObj => {
                                    return (
                                        <li>{studentObj.student}</li>
                                    )
                                })}
                            </ol>
                        </div>
                    )
                }
                )}
            </div>
        </div>
    )
}
