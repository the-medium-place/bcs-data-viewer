require('dotenv').config()
const getAuthToken = require('./getAuthToken')
const axios = require('axios').default;


module.exports = async function getAssignmentInfo() {

    const authToken = await getAuthToken();

    // return object of assignment names and due dates
    const gradeData = await gradesAPI(authToken, parseInt(process.env.ENROLLMENT_ID))
    return gradeData;
}

async function gradesAPI(authToken, enrollmentID) {

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
}