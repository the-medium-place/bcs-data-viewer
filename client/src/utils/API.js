import axios from 'axios';
// const crypto = require('crypto');
import crypto from 'crypto'

const API_URL = process.env.REACT_APP_API_URL || 'https://bootcampspot.com/api/instructor/v1/';

const API = {
    // RETRIEVE AUTH TOKEN FOR PROVIDED INSTRUCTOR LOGIN INFO
    // ======================================================
    getAuthToken: async function (bcsEmail, bcsPassword) {
        console.log("Getting Auth Token...");



        // const bcsPassword = decryptPass();

        const loginBody = {
            "email": bcsEmail,
            "password": bcsPassword
        }

        const config = {
            headers: {
                'Content-Type': 'application/json',
            }
        }

        try {
            const res = await axios.post(API_URL + "login", loginBody, config)
            console.log("AUTH SUCCESS! Accessing BCS API now...\n============================\n")
            const token = res.data.authenticationInfo.authToken
            return token;
        } catch (err) {
            console.log("AUTH FAILURE! \n===========================\n")
            throw new Error(err)
        }
    },

    // RETRIEVE INSTRUCTOR INFORMATION FROM BCS (COHORTS, ETC)
    // =======================================================
    getInstructorInfo: async function (bcsEmail, bcsPassword) {

        // GET AUTHORIZATION TOKEN FOR ALL DATA RETRIEVAL
        // console.log("Getting Auth Token...");
        const authToken = await this.getAuthToken(bcsEmail, bcsPassword)
        // console.log("AUTH SUCCESS! Accessing BCS API now...")

        const apiUrl = API_URL + "me";
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'authToken': authToken
            }
        }
        const resArr = [];
        await axios.get(apiUrl, config)
            .then(res => {
                // COURSE ID'S CAN BE FOUND IN THE 'Enrollments' ARRAY IN API RESPONSE
                // console.log(res.data.Enrollments[0])
                res.data.Enrollments.forEach(courseObj => {
                    const infoObj = {}
                    infoObj.cohortCode = courseObj.course.code;
                    infoObj.cohortId = courseObj.courseId;
                    infoObj.enrollmentId = courseObj.id
                    resArr.push(infoObj)

                })
            })
            .catch(err => new Error(err))
        return resArr
    },

    getStudentNames: async function (bcsEmail, bcsPassword, courseId) {
        // this uses the BCS course ID (4-digit INT)

        const authToken = await this.getAuthToken(bcsEmail, bcsPassword)

        // API CALL SETUP
        const gradesURL = 'https://bootcampspot.com/api/instructor/v1/grades';
        const payload = {
            courseId: parseInt(courseId)
        }
        const config = {
            headers: {
                'Content-Type': 'application/json',
                authToken
            }
        }

        // API CALL FOR GRADES INFO
        // ========================
        try {
            const res = await axios.post(gradesURL, payload, config)
            // console.log(res.data)
            console.log("API request SUCCESS!\n================================================\n")
            // console.log('res: ', res)
            // makeGradeCSV(res)
            return res;
        } catch (err) {

            console.log("API Request FAILURE: \n==========================\n", err)
        }


    },

    getGradeData: async function (bcsEmail, bcsPassword, courseId, enrollmentId) {
        // GET AUTHORIZATION TOKEN FOR ALL DATA RETRIEVAL
        const authToken = await this.getAuthToken(bcsEmail, bcsPassword)

        // console.log({ courseId })
        // API CALL SETUP
        const gradesURL = 'https://bootcampspot.com/api/instructor/v1/grades';
        const payload = {
            courseId: parseInt(courseId)
        }
        const config = {
            headers: {
                'Content-Type': 'application/json',
                authToken
            }
        }

        // API CALL FOR GRADES INFO
        // ========================
        try {
            const res = await axios.post(gradesURL, payload, config)
            // console.log(res.data)
            console.log("API request SUCCESS!\n================================================\n")
            // console.log(res.data)
            return await this.makeStudentGradeObjects(res.data, bcsEmail, bcsPassword, enrollmentId)

        } catch (err) {

            console.log("API Request FAILURE: \n==========================\n", err)
        }

    },

    makeStudentGradeObjects: async function (gradesArr, bcsEmail, bcsPassword, enrollmentId) {

        const assignmentData = await this.getAssignmentInfo(bcsEmail, bcsPassword, enrollmentId); // object of all assignments formatted as - { 'assignment name':'assignment due date (in ms)'}
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
        newGradesArr.sort(this.naturalCompare)
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
                // include assignment name
                name: gradeObj.assignmentTitle,
                // include whether student has submitted assigment
                submitted: gradeObj.submitted ? true : false,
                // include whether assignment is currently due
                isDue,
                // include assignment grade (or other data)
                // graded, is due - return the grade
                grade: gradeObj.grade && isDue ? gradeObj.grade :
                    // no grade, is due, not submitted - student has not turned in assignment 
                    !gradeObj.grade && isDue && !gradeObj.submitted ? 'Overdue!' :
                        // assignment is not yet due
                        !isDue ? 'Not Due!' :
                            // assignment is due and submitted, but not yet graded
                            isDue && gradeObj.submitted && !gradeObj.grade ? 'Ungraded' :
                                grades2nums[gradeObj.grade] || '',
            })
        })

        // console.log(assignmentArr)
        // console.log({ studentObj, assignmentArr })
        return { studentObj, assignmentArr }
    },

    naturalCompare: function (a, b) {
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
    },

    gradesAPI: async function (authToken, enrollmentID) {

        const assignmentURL = 'https://bootcampspot.com/api/instructor/v1/assignments';
        const config = {
            headers: {
                'Content-Type': 'application/json',
                authToken
            }
        }

        // CREATE EMPTY OBJECT TO HOLD ASSIGNMENT DATA
        const assignmentData = {}


        // API CALL FOR ASSIGNMENT INFO
        // ========================
        try {
            const res = await axios.post(assignmentURL, { enrollmentID }, config)
            // console.log("SUCCESS!!\n================================\n", res.data)
            res.data.calendarAssignments.forEach(assignmentObj => {
                // console.log('test')
                assignmentData[assignmentObj.title] = new Date(assignmentObj.effectiveDueDate).getTime()
                // new Date(assignmentObj.effectiveDueDate).toLocaleString('en-US', { timeZone: 'America/Denver' }); // timezone set using IANA database zone
            })
            return assignmentData;
        } catch (err) {

            console.log("API Request FAILURE: \n==========================\n", err)
        }
    },
    getAssignmentInfo: async function (bcsEmail, bcsPassword, enrollmentId) {

        const authToken = await this.getAuthToken(bcsEmail, bcsPassword);

        // return object of assignment names and due dates
        const gradeData = await this.gradesAPI(authToken, parseInt(enrollmentId))
        return gradeData;
    }


}

export default API;

