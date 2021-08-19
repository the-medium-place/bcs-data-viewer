import React, { useState, useEffect, useRef } from "react";
import API from "../../utils/API";
import { useMutation } from "@apollo/client";
import { SAVE_GROUPS } from "../../utils/mutations";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import './style.css';
import { chunkArray, chunkArrayNoRepeats, getGradeAvg } from './groupUtils';

export default function MakeGroups({
  loggedInUser,
  studentRoster,
  droppedStudents,
  bcsCohortId,
  enrollmentId,
  cohortId,
  cohortGroups
}) {
  const bcsEmail = loggedInUser.bcsLoginInfo.bcsEmail;
  const bcsPassword = loggedInUser.bcsLoginInfo.bcsPassword;
  const activeStudents = studentRoster.filter(
    (student) => !droppedStudents.includes(student)
  );

  const [saveGroups, { error, data }] = useMutation(SAVE_GROUPS);
  if (error) {
    console.log(JSON.stringify(error));
  }

  const [gradeData, setGradeData] = useState(null);
  const [numGroups, setNumGroups] = useState(6);
  const [gradesArr, setGradesArr] = useState([]);
  const [groups, setGroups] = useState(null);
  const [showGroups, setShowGroups] = useState(false);
  const [showButton, setShowButton] = useState(true);
  const [disableSave, setDisableSave] = useState(false);
  const [memberRepeat, setMemberRepeat] = useState(false);
  const [noRepeatGroup, setNoRepeatGroup] = useState(null)

  const draggableRef = useRef(null);
  const droppableRef = useRef(null);


  async function fetchData() {
    setGradeData(
      await API.getGradeData(bcsEmail, bcsPassword, bcsCohortId, enrollmentId)
    );
  }
  // GET AND STORE ALL GRADE DATA
  useEffect(() => {
    fetchData();
  }, []);


  const handleGroupNumChange = (e) => {
    const value = e.target.value;
    // SHOW THE 'MAKE GROUPS' BUTTON
    setShowButton(true);

    // RESET gradesArr STATE
    setGradesArr([]);

    // UPDATE numGroups STATE
    if (value <= 0) {
      setNumGroups(1);
    }
    setNumGroups(value);
  };

  const handleGroupButtonClick = async (e) => {
    e.preventDefault();

    // HIDE THE 'MAKE GROUPS' BUTTON
    setShowButton(false);
    // ENABLE THE 'SAVE GROUPS' BUTTON
    setDisableSave(false);

    // LOOP THROUGH ACTIVE STUDENTS
    // getGradeAvg() RETURNS OBJECT --
    // {student: <student name>, gradeAvg: <numerical representation of average grade>}
    // PUSH RESULTING OBJECT TO gradesArr STATE
    await activeStudents.forEach((student) => {
      // console.log({ student })
      const arrCopy = gradesArr;
      arrCopy.push(getGradeAvg(student, gradeData));
      setGradesArr(arrCopy);
    });

    // UPDATE groups STATE
    // chunkArray() RETURNS OBJECT --
    // EACH KEY IS A GROUP AND VALUE IS AN ARRAY OF STUDENT OBJECTS MAKING UP THAT GROUP
    const finalGroups = memberRepeat ? chunkArrayNoRepeats(gradesArr, numGroups, JSON.parse(noRepeatGroup), activeStudents) : chunkArray(gradesArr, numGroups);
    // console.log({ finalGroups });
    await setGroups(finalGroups);

    // SHOW THE GROUPS
    setShowGroups(true);
  };

  const handleSaveClick = async (e) => {
    e.preventDefault();

    // DISABLE 'SAVE GROUPS' BUTTON
    setDisableSave(true);
    console.log({ groups, cohortId });

    let groupTitle = prompt(
      "Please enter a name for this selection of groups: "
    );

    if (!groupTitle || groupTitle.length === 0) {
      alert('Please enter a group name to save. Press the save button to try again...')
      setDisableSave(false);
    }

    if (groupTitle && groupTitle.length >= 1) {

      try {
        const { data } = await saveGroups({
          variables: { title: groupTitle, groups, cohortId },
        });
        // console.log(data);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const onDragEnd = (result) => {
    // console.log(result);
    // console.log(groups)
    const { destination, source, draggableId } = result;

    if (!destination) { return }
    if (destination.droppalbeId === source.droppableId &&
      destination.index === source.index) {
      return;
    }
    // capture which 'column' (group) was the drag source and destination
    const sourceColumn = groups[source.droppableId];
    const destinationColumn = groups[destination.droppableId]

    // get list of student objects for both 'columns'
    const newSourceItemIds = Array.from(sourceColumn);
    let newDestinationItemIds = Array.from(destinationColumn)

    // remove student from source list
    newSourceItemIds.splice(source.index, 1);
    // add student to destination list 
    // first making sure that the destination and source columns arent the same -
    // then using student name to search for entire student object in original 'groups' state
    const movedStudentObj = groups[source.droppableId].find(obj => obj.student === draggableId)
    newDestinationItemIds.splice(destination.index, 0, movedStudentObj);
    // ensure no duplicate team members
    // (bug catch when moving member within group)
    if (source.droppableId === destination.droppableId) {
      newDestinationItemIds = new Set(newDestinationItemIds)
    }

    const newSourceColumn = [
      ...newSourceItemIds
    ]

    const newDestinationColumn = [
      ...newDestinationItemIds
    ]

    // update state with new column values
    const groupsCopy = { ...groups };
    groupsCopy[source.droppableId] = newSourceColumn;
    groupsCopy[destination.droppableId] = newDestinationColumn;
    setGroups(groupsCopy);

  }

  return (
    <div className="MakeGroups mb-5">
      <div className="row">
        <div className="col-12 col-md-8 border-bcs p-2 mt-2 mb-1">
          <p className="lead text-center mt-3">
            Use this tool to form groups for projects and/or class activities.
            Groups are formed by calculating the 'average' grade for each student,
            then evenly distributing students among the selected number of groups so
            that each group has a mixture of performance levels.
          </p>
          {cohortGroups.length > 0 ? (
            <p className="lead text-center mt-1">Clicking the <em>No Repeats</em> box will ensure that no students are paired together if they have already been paired in one of your 'saved' groups. Use this option to create project groups without repeating group members!</p>
          ) : null}
          <p className="align-text-bottom text-center p-1 bg-bcs text-light"><strong>Drag and drop students to re-order or move to a different group!</strong></p>
        </div>

        {gradeData ? (
          <div className="col-12 col-md-4 d-flex justify-content-center p-2 mt-2 mb-1 bg-bcs text-light rounded-right">
            <form
              onSubmit={handleGroupButtonClick}
              className="d-flex flex-column justify-content-center"
            >
              <label className="form-label" htmlFor="numGroups">
                <strong>Desired number of groups:</strong>
              </label>
              <input
                className="form-control mb-2"
                type="number"
                min="1"
                name="numGroups"
                id="numGroups"
                value={numGroups}
                onChange={handleGroupNumChange}
              />
              {cohortGroups.length > 0 ? (
                <div className="w-100 text-center px-5">
                  <label className="form-check-label" htmlFor="memberRepeat">
                    <strong>
                      No Repeats: &nbsp;&nbsp;
                    </strong>
                  </label>
                  <input
                    className="form--check-input"
                    type="checkbox"
                    checked={memberRepeat}
                    onChange={() => setMemberRepeat(!memberRepeat)}
                  />
                  <br />
                  {/* <span className="bg-danger p-1 m-1">**not yet functional**</span> */}
                </div>
              ) : <div className="col-6 col-md-4"></div>}

              {memberRepeat ? (

                <select className="form-select mt-2" aria-label="Default select example" onChange={(e) => { console.log(e.target.value); setNoRepeatGroup(e.target.value) }}>
                  <option selected defaultValue disabled>Select saved group to compare...</option>
                  {cohortGroups.map((cohortGroup, i) => {
                    return (
                      <option key={cohortGroup.title + i} value={JSON.stringify(cohortGroup)}>{cohortGroup.title}</option>
                    )
                  })}
                </select>
              ) : null}

              <div
                className="button-wrapper w-100 d-flex justify-content-center p-1"
                style={{ height: "3rem" }}
              >
                {showButton ? (
                  <button
                    className="btn bg-light"
                    type="submit"
                    onClick={handleGroupButtonClick}
                  >
                    Form Groups
                  </button>
                ) : null}
              </div>
            </form>
          </div>
        ) : (
          <div className="col-6 col-md-4 d-flex align-items-center p-2 mt-2 mb-1 bg-bcs text-light rounded-right">
            <strong>Preparing student data...</strong>
            <div
              className="spinner-border ms-auto"
              role="status"
              aria-hidden="true"
            ></div>
          </div>
        )}
      </div>
      <DragDropContext
        // onDragStart={onDragStart}
        // onDragUpdate
        onDragEnd={onDragEnd}
      >
        <div
          className="row groups-wrapper d-flex justify-content-center flex-wrap"
        >
          <br />
          {showGroups ? (
            Object.keys(groups).map((group, i) => {
              return (
                <Droppable
                  droppableId={group}
                  key={group}
                  innerRef={droppableRef}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      // key={group}
                      className="bg-light col-10 col-md-5 col-lg-3 col-xl-2 m-2 flex-wrap border shadow shadow-sm rounded"
                    >
                      <ol>
                        <strong>{group}</strong>
                        {groups[group].map((student, i) => {
                          return (
                            <Draggable
                              key={student.student}
                              draggableId={student.student}
                              index={i}
                              innerRef={draggableRef}
                            >
                              {(provided) => (
                                <li
                                  className="border mb-2 p-1 text-center draggable-name"
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  ref={provided.innerRef}
                                >
                                  {student.student}
                                </li>
                              )}
                            </Draggable>
                          );
                        })}
                      </ol>
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              );
            })
          ) : (
            <div className="d-flex align-items-center justify-content-center text-center my-5 p-5 w-100">
              <strong>
                {gradeData ? "Ready to form groups!" : "Waiting on data..."}
              </strong>
            </div>
          )}
        </div>
      </DragDropContext>
      {showGroups ? (
        <button
          className={`btn btn-lg ${error ? "btn-danger" : "btn-secondary"}`}
          onClick={handleSaveClick}
          disabled={disableSave}
        >
          {data
            ? "Groups Saved!"
            : error
              ? "There was a problem!"
              : "Save Groups!"}
        </button>
      ) : null}
    </div>
  );
}
