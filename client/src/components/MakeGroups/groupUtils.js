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

export const chunkArrayNoRepeats = (gradesArr, numGroups, cohortGroup, activeStudents) => {

    function getKey(array) {
        return array.slice().sort().join('|');
    }

    let object = {};

    // CREATE OBJECT OF ALL POSSIBLE STUDENT PAIRINGS WITH INITIAL VALUEOF 0
    for (let i = 0; i < activeStudents.length - 1; i++) {
        for (let j = i + 1; j < activeStudents.length; j++) {
            object[getKey([activeStudents[i], activeStudents[j]])] = 0;
        }
    }

    // TURN PREVIOUS GROUP OBJECT INTO ARRAY OF NAME-ARRAYS...
    // ... EACH NAME ARRAY IS A STUDENT GROUPING
    const prevGroupingObjs = Object.values(cohortGroup.groups)
    // console.log(prevGroupingObjs);
    const groupNamesArrs = prevGroupingObjs.map(objArr => {
        return objArr.map(stuObj => {
            return stuObj.student;
        })
    })
    // console.log(groupNamesArrs)


    // UPDATE EACH PAIRING TO '1' IF THAT PAIRING EXISTS IN PREVIOUS GROUP
    groupNamesArrs.forEach(memberArr => {
        for (let i = 0; i < memberArr.length - 1; i++) {
            for (let j = i + 1; j < memberArr.length; j++) {
                object[getKey([memberArr[i], memberArr[j]])]++;
            }
        }
    })

    // OBJECT HAS KEYS OF EVERY POSSIBLE STUDENT PAIRING -
    // IF PAIRING HAS APPEARED IN PREVIOUS GROUP, VALUE IS 1
    // IF PAIRING HAS NOT APPEARED, VALUE IS 0
    // console.log(object);

    // EMPTY OBJECT TO HOLD FINAL GROUPS
    const groupsObj = {};

    // SORT STUDENT ARRAY BY AVERAGE GRADE VALUE
    const sortedStudentGradesArr = gradesArr.sort((a, b) => a.gradeAvg - b.gradeAvg);

    // CREATE KEY IN groupsObj FOR EACH GROUP
    for (let i = 1; i <= numGroups; i++) {
        groupsObj[`Group ${i}`] = [];
    }

    // PUSH STUDENTS INTO GROUP ONE BY ONE
    let counter = 1;
    sortedStudentGradesArr.forEach((gradeObj) => {
        // console.log({ gradeObj }) // { student: <String>, gradeAvg: <Int> }
        if (counter <= numGroups) {
            // BEFORE INSERTION, check 'object' for pairing data with current group members
            // console.log(groupsObj);
            if (groupsObj[`Group ${counter}`].length > 0) { // check if there is at least 1 member of the group already
                groupsObj[`Group ${counter}`].forEach(memberObj => { // current group has at least 1 member, loop through members already assigned to this group
                    if (!object[getKey([gradeObj.student, memberObj.student])]) { // check each student pairing for current group against the value in 'object' above
                        if (!groupsObj[`Group ${counter}`].includes(gradeObj)) { // check if current group contains current student already (avoid doubling within the loop)

                            groupsObj[`Group ${counter}`].push(gradeObj); // current pairing has value of 0 in 'object', meaning haven't worked together yet so put student into group
                        }
                    }
                })
            } else {
                groupsObj[`Group ${counter}`].push(gradeObj); // current group has 0 members, go ahead and add student right away
            }

            counter++;

        } else { // counter has reached the maximum number of groups requested, reset it
            counter = 1;
            if (groupsObj[`Group ${counter}`].length > 0) { // check if there is at least 1 member of the group already
                groupsObj[`Group ${counter}`].forEach(memberObj => { // current group has at least 1 member, loop through members already assigned to this group
                    if (!object[getKey([gradeObj.student, memberObj.student])]) { // check each student pairing for current group against the value in 'object' above
                        if (!groupsObj[`Group ${counter}`].includes(gradeObj)) { // check if current group contains current student already (avoid doubling within the loop)

                            groupsObj[`Group ${counter}`].push(gradeObj); // current pairing has value of 0 in 'object', meaning haven't worked together yet so put student into group
                        }
                    }
                })
            } else {
                groupsObj[`Group ${counter}`].push(gradeObj); // current group has 0 members, go ahead and add student right away
            }

            counter++;
        }
    });
    console.log(groupsObj);
    return groupsObj;
}


export const chunkArray = (gradesArr, numGroups) => {
    // EMPTY OBJECT TO HOLD FINAL GROUPS
    const groupsObj = {};

    // SORT STUDENT ARRAY BY AVERAGE GRADE VALUE
    const sortedStudentGradesArr = gradesArr.sort((a, b) => a.gradeAvg - b.gradeAvg);

    for (let i = 1; i <= numGroups; i++) {
        // CREATE KEY IN groupsObj FOR EACH GROUP
        groupsObj[`Group ${i}`] = [];
    }

    // PUSH STUDENTS INTO GROUPS ONE-BY-ONE IN ORDER --
    // SINCE STUDENTS ARE SORTED BY GRADE, DIFFERENT GRADE
    // AVERAGES WILL BE SPREAD EVENLY THROUGHOUT THE GROUPS
    let counter = 1;
    sortedStudentGradesArr.forEach((gradeObj) => {
        if (counter <= numGroups) {
            groupsObj[`Group ${counter}`].push(gradeObj);
            counter++;
        } else {
            counter = 1;
            groupsObj[`Group ${counter}`].push(gradeObj);
            counter++;
        }
    });

    return groupsObj;
};


export const getGradeAvg = (student, gradeData) => {
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