import { gql } from '@apollo/client';

export const GET_ALL_USERS = gql`
      query allUsers {
        allUsers {
          _id
          name
          cohorts {
            _id
            cohortId
            cohortCode
            studentRoster
            droppedStudents
            notes {
              content
              createdAt
              createdBy
            }
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
              cohortId
              cohortCode
              studentRoster
              droppedStudents
              notes {
                content
                createdAt
                createdBy
              }
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
         notes {
           content
           createdAt
           createdBy {
            _id
            name
            email
          }
         }
       }
     }
    }
  `;

export const GET_GROUPS = gql`
    query getGroups($groupsId: ID!){
      getGroups(groupsId: $groupsId){
        _id
        title
        groups
        notes {
          _id
          author {
            _id
            name
            email
          }
          groupName
          notes
          grade
  
        }
      }
    }
`;


export const GET_COHORT = gql`
    query getCohort($cohortId: ID!){
      getCohort(cohortId: $cohortId){
        _id
        cohortId
        cohortCode
        enrollmentId
        studentRoster
        droppedStudents
        notes {
          _id
          content
          createdAt
          createdBy {
            _id
            name
            email
          }
        }
        groups {
          _id
          title
          groups
          notes {
            author {
              _id
              name
              email
            }
            notes
            grade
            groupName
          }
        }
      }
    }
  `;