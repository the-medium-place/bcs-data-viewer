import React, { useState, useEffect, useRef } from "react";
import API from "../../utils/API";
import { useMutation } from "@apollo/client";
import { SAVE_GROUPS } from "../../utils/mutations";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

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
  const MAP_GRADES_TO_INT = {
    "A+": 1,
    A: 2,
    "A-": 3,
    "B+": 4,
    B: 5,
    "B-": 6,
    "C+": 7,
    C: 8,
    "C-": 9,
    "D+": 10,
    D: 11,
    "D-": 12,
    F: 13,
    I: 13,
    "Overdue!": 13,
    "Not Due!": 13,
    Ungraded: 13,
    "N/A": 0,
  };

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
  const [memberRepeat, setMemberRepeat] = useState(true);

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

  // GET AVERAGE GRADE FOR SINGLE STUDENT
  const getGradeAvg = (student) => {
    let numDue = 0,
      totalGradeVal = 0,
      gradeAvg = 0;

    gradeData.studentObj[student].assignments.forEach((assignmentObj) => {
      if (assignmentObj.isDue) {
        numDue++;
        totalGradeVal += MAP_GRADES_TO_INT[assignmentObj.grade];
      }
    });
    gradeAvg = totalGradeVal / (numDue || 1);
    return { student, gradeAvg };
  };

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

  /**
   * Groups student objects into chunks
   * @returns groupsObj 
   */
  const chunkArray = () => {
    // EMPTY OBJECT TO HOLD FINAL GROUPS
    const groupsObj = {};

    // SORT STUDENT ARRAY BY AVERAGE GRADE VALUE
    const sortedArr = gradesArr.sort((a, b) => a.gradeAvg - b.gradeAvg);
    // console.log(sortedArr)

    for (let i = 1; i <= numGroups; i++) {
      // CREATE KEY IN groupsObj FOR EACH GROUP
      groupsObj[`Group ${i}`] = [];
    }

    // PUSH STUDENTS INTO GROUPS ONE-BY-ONE IN ORDER --
    // SINCE STUDENTS ARE SORTED BY GRADE, DIFFERENT GRADE
    // AVERAGES WILL BE SPREAD EVENLY THROUGHOUT THE GROUPS
    let counter = 1;
    sortedArr.forEach((gradeObj) => {
      if (counter <= numGroups) {
        groupsObj[`Group ${counter}`].push(gradeObj);
        counter++;
      } else {
        counter = 1;
        groupsObj[`Group ${counter}`].push(gradeObj);
        counter++;
      }
    });

    // console.log(groupsObj)
    return groupsObj;
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
      arrCopy.push(getGradeAvg(student));
      setGradesArr(arrCopy);
    });

    // UPDATE groups STATE
    // chunkArray() RETURNS OBJECT --
    // EACH KEY IS A GROUP AND VALUE IS AN ARRAY OF STUDENT OBJECTS MAKING UP THAT GROUP
    const finalGroups = chunkArray();
    console.log({ finalGroups });
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

    if (groupTitle && groupTitle.length > 1) {

      try {
        const { data } = await saveGroups({
          variables: { title: groupTitle, groups, cohortId },
        });
        console.log(data);
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
    const sourceColumn = groups[source.droppableId];
    const destinationColumn = groups[destination.droppableId]

    // console.log(column);
    const newSourceItemIds = Array.from(sourceColumn);
    const newDestinationItemIds = Array.from(destinationColumn)
    // console.log(newItemIds)

    // remove item from source list
    newSourceItemIds.splice(source.index, 1);
    // add item to destination list
    newDestinationItemIds.splice(destination.index, 0, groups[source.droppableId].find(obj => obj.student === draggableId));

    const newSourceColumn = [
      ...newSourceItemIds
    ]

    const newDestinationColumn = [
      ...newDestinationItemIds
    ]

    // console.log(newSourceColumn, newDestinationColumn)
    const groupsCopy = { ...groups };
    groupsCopy[source.droppableId] = newSourceColumn;
    groupsCopy[destination.droppableId] = newDestinationColumn;
    // console.log({ groupsCopy })
    setGroups(groupsCopy);

  }

  return (
    <div className="MakeGroups mb-5">
      <p className="text-center mt-3">
        Use this tool to form groups for projects and/or class activities.
        Groups are formed by calculating the 'average' grade for each student,
        then evenly distributing students among the selected number of groups so
        that each group has a mixture of performance levels.
      </p>

      {gradeData ? (
        <div className="d-flex justify-content-center w-100 p-2 mt-2 mb-1 w-25 bg-bcs text-light">
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
                    Place students who have worked together in separate groups
                    (no repeating members):
                  </strong>
                </label>
                <input
                  className="form--check-input"
                  type="checkbox"
                  checked={memberRepeat}
                  onChange={() => setMemberRepeat(!memberRepeat)}
                />
              </div>
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
        <div className="d-flex align-items-center my-5 p-5">
          <strong>Preparing student data...</strong>
          <div
            className="spinner-border ms-auto"
            role="status"
            aria-hidden="true"
          ></div>
        </div>
      )}
      <h3 className="text-bold text-center p-2 bg-secondary text-light">Drag and Drop students to re-order or move between groups!</h3>
      <DragDropContext
        // onDragStart
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
                                  className="border mb-2"
                                  // key={student.student}
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
