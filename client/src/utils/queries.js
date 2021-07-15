import { gql } from '@apollo/client';

export const GET_ALL_USERS = gql`
      query allUsers {
        allUsers {
          _id
          name
          todos {
              _id
              title
              content
              isComplete
              dueDate
          }
        }
      }
    `
export const GET_ONE_USER = gql`
    query user($userId: ID!) {
        user(userId: $userId) {
            _id
            name
            email
            bcsLoginInfo {
              bcsEmail
              bcsPassword
            }
            cohorts {
              _id
              cohortCode
              studentRoster
              droppedStudents
            }
        }
    }`

export const GET_ME = gql`
    query me {
     me {
       _id
       name
       email
       bcsLoginInfo {
         bcsEmail
         bcsPassword
       }
       cohorts {
         _id
         cohortCode
         cohortId
         enrollmentId
         studentRoster
         droppedStudents
       }
     }
    }
  `;