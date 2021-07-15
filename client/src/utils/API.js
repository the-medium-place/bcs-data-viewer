import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://bootcampspot.com/api/instructor/v1/';

const API = {
    // RETRIEVE AUTH TOKEN FOR PROVIDED INSTRUCTOR LOGIN INFO
    // ======================================================
    getAuthToken: async function (bcsEmail, bcsPassword) {
        console.log("Getting Auth Token...");

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
                // console.table(resArr);

                // return resArr;
            })
            .catch(err => new Error(err))
        return resArr
    }


}

export default API;

