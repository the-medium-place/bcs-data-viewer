const getAssignmentInfo = require("./getAssignmentInfo")
/**
   * Organize student info in to usable object of students with all assignment info
   * @param {Object}gradesArr array of objects where each object is a specific student's grade for a specific assignment
   * @returns {Object}{ studentObj, assignmentArr } object of student info and array of all assignment names
   */
module.exports = async function makeStudentGradeObjects(gradesArr) {

    const assignmentData = await getAssignmentInfo(); // object of all assignments formatted as - { 'assignment name':'assignment due date (in ms)'}
    // console.log(assignmentData)
    const grades2nums = {
        'A+': 1,
        'A': 2,
        'A-': 3,
        'B+': 4,
        'B': 5,
        'B-': 6,
        'C+': 7,
        'C': 8,
        'C-': 9,
        'D+': 10,
        'D': 11,
        'D-': 12,
        'F': 13,
        'I': 14
    }

    const studentObj = {};
    const assignmentArr = [];
    const now = Date.now();
    // remove career services milestones and prework from array
    const newGradesArr = gradesArr.filter(gradeObj => gradeObj.assignmentTitle.split(' ')[0] !== 'Milestone:' && gradeObj.assignmentTitle.split(' ')[0] !== '0:' && gradeObj.assignmentTitle.split(' ')[0] !== 'Intro')
    newGradesArr.sort(naturalCompare)
    // console.log("newGradesArr: ", newGradesArr)

    newGradesArr.forEach(gradeObj => {
        const isDue = assignmentData[gradeObj.assignmentTitle] < now
        // console.log("TEST!!!!===================\n", assignmentData[gradeObj.assignmentTitle] < Date.now())
        if (!studentObj[gradeObj.studentName]) {
            studentObj[gradeObj.studentName] = { assignments: [] };
        }
        if (!assignmentArr.includes(gradeObj.assignmentTitle)) {
            assignmentArr.push(gradeObj.assignmentTitle)
        }
        studentObj[gradeObj.studentName].assignments.push({
            name: gradeObj.assignmentTitle,
            submitted: gradeObj.submitted ? 'yes' : 'no',
            // grade: grades2nums[gradeObj.grade] || '',
            grade: gradeObj.grade && isDue ? grades2nums[gradeObj.grade] : !gradeObj.grade && isDue ? 15 : grades2nums[gradeObj.grade] || '',
        })
    })

    // console.log(assignmentArr)
    return { studentObj, assignmentArr }
}

function naturalCompare(a, b) {
    a = a.assignmentTitle
    b = b.assignmentTitle
    var ax = [], bx = [];

    a.replace(/(\d+)|(\D+)/g, function (_, $1, $2) { ax.push([$1 || Infinity, $2 || ""]) });
    b.replace(/(\d+)|(\D+)/g, function (_, $1, $2) { bx.push([$1 || Infinity, $2 || ""]) });

    while (ax.length && bx.length) {
        var an = ax.shift();
        var bn = bx.shift();
        var nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
        if (nn) return nn;
    }

    return ax.length - bx.length;
}
