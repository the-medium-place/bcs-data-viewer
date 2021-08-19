import React from 'react'

export default function GroupsBox({ groups }) {
    return (
        <div className="groups-wrapper bg-bcs flex-column d-flex jusfity-content-center flex-wrap w-100 my-2 border shadow" key={groups._id} data-id={groups._id}>
            <h3 className="text-center text-light mt-2"><strong>{groups.title}</strong></h3>
            <div className="row d-flex flex-wrap justify-content-center">
                {Object.keys(groups.groups).map(groupsArr => {
                    // console.log(groupsArr, groups.groups[groupsArr])
                    // groupsArr => object Key ('Group 1', etc...)
                    // groups.groups[groupsArr] => array of group member objects
                    return (
                        <div key={groupsArr} className="col-8 col-md-4 col-xl-2 bg-light m-2 text-center flex-wrap border shadow shadow-sm rounded">
                            <strong><u>{groupsArr}</u></strong>
                            <ol>
                                {groups.groups[groupsArr].map(studentObj => {
                                    return (
                                        <li key={studentObj.student}>{studentObj.student}</li>
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
