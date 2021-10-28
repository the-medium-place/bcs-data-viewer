import axios from 'axios';

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
                    infoObj.startDate = courseObj.course.startDate;
                    infoObj.endDate = courseObj.course.endDate;
                    infoObj.university = courseObj.course.cohort.program.university.name;
                    infoObj.universityLogo = courseObj.course.cohort.program.university.logoUrl;
                    // console.log(infoObj)
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
    },

    getSessions: async function (authToken, enrollmentId) {
        let academicSess, careerSess;
        // GET ALL SESSIONS DATA WITH DATES
        const sessionURL = "https://bootcampspot.com/api/instructor/v1/sessions"
        const sessionPayload = {
            enrollmentId: parseInt(enrollmentId)
        }
        const sessionConfig = {
            headers: {
                'Content-Type': 'application/json',
                authToken
            }
        }

        try {
            const sessionRes = await axios.post(sessionURL, sessionPayload, sessionConfig);
            // SPLIT SESSIONS BY CAREER (OPTIONAL) / ACADEMIC (REQUIRED)
            careerSess = sessionRes.data.calendarSessions.filter(sessObj => sessObj.category.code === 'career');
            academicSess = sessionRes.data.calendarSessions.filter(sessObj => sessObj.category.code === 'academic')
            // console.log(sessionRes)
        } catch (err) {
            throw new Error(err)
        }
        // console.log({ academicSess, careerSess })
        return { academicSess, careerSess }

    },

    getStudentAttendanceInfo: async function (authToken, bcsCohortId) {
        // GET ATTENDANCE DATA
        const attendanceURL = 'https://bootcampspot.com/api/instructor/v1/attendance';
        const attendancePayload = {
            courseId: parseInt(bcsCohortId)
        }
        const attendanceConfig = {
            headers: {
                'Content-Type': 'application/json',
                authToken
            }
        }
        // VALUES TO BE RETURNED
        // const sessionNamesArr = []
        const studentSessionAttendanceObj = {};

        // API CALL FOR ATTENDANCE INFO
        // ========================
        try {
            const res = await axios.post(attendanceURL, attendancePayload, attendanceConfig)
            // console.log(res.data)
            console.log("API request SUCCESS!\n================================================\n")
            console.log("attendance data: ", res.data)
            const cssSessions = res.data.filter(obj => obj.sessionName.toLowerCase().includes('advanced css'))
            // console.log({ cssSessions })
            // return res.data
            let prevSessName;
            let prevStudentName;
            res.data.forEach(attObj => {
                let currSessName = attObj.sessionName;
                // let currStudentName = attObj.studentName;
                if (attObj.sessionName === prevSessName && attObj.studentName === prevStudentName) {

                    const numCheck = typeof currSessName[currSessName.length - 1] === 'number';

                    if (numCheck) {
                        const currSessNum = parseInt(currSessName[currSessName.length - 1])
                        currSessName = currSessName.split().pop().push(" - Day " + currSessNum + 1).join()
                    } else {
                        currSessName = currSessName + ' - Day 2'
                    }
                }

                const studentAttObj = {
                    name: attObj.studentName,
                    session: currSessName,
                    attendance: {
                        excused: attObj.excused,
                        pending: attObj.pending,
                        present: attObj.present,
                        remote: attObj.remote
                    }
                }
                // CREATE ARRAY OF STUDENT OBJECTS: [{sessionName: [studentName: {...attendance info}]}]
                if (!studentSessionAttendanceObj[attObj.sessionName]) {
                    studentSessionAttendanceObj[attObj.sessionName] = []
                    studentSessionAttendanceObj[attObj.sessionName].push(studentAttObj)
                }
                if (!studentSessionAttendanceObj[attObj.sessionName].includes(studentAttObj)) {
                    studentSessionAttendanceObj[attObj.sessionName].push(studentAttObj)
                }

                prevSessName = attObj.sessionName
                prevStudentName = attObj.studentName
                // return sessionNamesArr.includes(attObj.sessionName) ? null : sessionNamesArr.push(attObj.sessionName);
            })
            // console.log(studentSessionAttendanceObj)
            return { sessionInfo: studentSessionAttendanceObj }

        } catch (err) {

            console.log("API Request FAILURE: \n==========================\n", err)
        }
    },

    getAttendance: async function (bcsEmail, bcsPassword, bcsCohortId, enrollmentId) {
        // GET AUTH TOKEN FOR ALL DATA COLLECTION
        const authToken = await this.getAuthToken(bcsEmail, bcsPassword);

        // GET ARRAYS OF SESSION DATA
        const { careerSess, academicSess } = await this.getSessions(authToken, enrollmentId)
        // console.log({ academicSess })

        // GET INDIVIDUAL STUDENT ATTENDANCE DATA
        const { sessionInfo } = await this.getStudentAttendanceInfo(authToken, bcsCohortId)
        // console.log({ sessionInfo })

        // LOOP THROUGH ARRAY OF SESSION OBJECTS, CREATE ARRAY OF OBJECTS
        let prevSessName;
        const newSessionAttendanceArray = academicSess
            .sort((a, b) => {
                const date1 = new Date(a.session.startTime).getTime();
                const date2 = new Date(b.session.startTime).getTime()
                // console.log({ date1, date2 })
                if (date1 < date2) {
                    return -1;
                } else if (date2 < date1) {
                    return 1;
                }
                return 0
            })
            .map(sessObj => {
                const newObj = {
                }
                const sessDate = sessObj.session.startTime
                // let newKey = sessObj.session.chapter + ' - ' + sessObj.session.name;
                let newKey;
                if (sessObj.session.name === prevSessName) {
                    newKey = sessObj.session.name + ' - Day 2';
                } else {
                    newKey = sessObj.session.name;
                }

                // CREATE BASE ARRAY OF OBJECTS
                newObj[newKey] = []
                // console.log({ newObj })

                // LOOP THROUGH SESSION ATTENDANCE INFO TO POPULATE ARRAY OBJECTS
                sessionInfo[sessObj.session.name].forEach(attObj => {
                    // console.log(attObj)
                    // attObj.date = sessDate
                    newObj[newKey].push(attObj)
                })
                newObj.date = sessDate
                newObj.chapter = sessObj.session.chapter;
                const now = new Date();
                newObj.isPast = new Date(sessDate) < now ? true : false;
                // console.log({ newObj })
                newObj.sessionName = sessObj.session.name
                prevSessName = sessObj.session.name
                return newObj;

            })
        // console.log({ newSessionAttendanceArray })
        // LOOP ARRAY OF SESSION OBJECTS [{sessionName<STRING>: [{name:<STRING>, session:<STRING>, attendance:<OBJECT>}]}]
        const fullSessionAttendnaceList = newSessionAttendanceArray.map(sessObj => {
            // GET CURRENT KEY - SESSION NAME
            const sessName = Object.keys(sessObj)[0];

            // console.log(sessName, " before ", sessObj[sessName])

            // LOOP THROUGH ARRAY OF STUDENT ATTENDANCE OBJECTS AND FILTER OUT EXTRA VALUES
            sessObj[sessName] = sessObj[sessName].filter(attObj => attObj.session === sessName)
            // console.log(sessName);
            // console.log(sessName, " after ", sessObj[sessName])
            return sessObj;

        })

        // console.log({ fullSessionAttendnaceList })

        return fullSessionAttendnaceList

    }


}

export default API;

