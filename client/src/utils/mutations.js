import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($name: String!, $password: String!) {
    login(name: $name, password: $password) {
      token
      user {
        _id
        name
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($name: String!, $password: String!, $email: String!, $bcsEmail: String!, $bcsPassword: String!) {
    addUser(name: $name, password: $password, email: $email, bcsEmail: $bcsEmail, bcsPassword: $bcsPassword) {
      token
      user {
        _id
        name
      }
    }
  }
`;

export const ADD_COHORT = gql`
  mutation addCohort($cohortCode: String!, $cohortId: Int!, $enrollmentId: Int!, $studentRoster: [String!]) {
    addCohort(cohortCode: $cohortCode, cohortId: $cohortId, enrollmentId: $enrollmentId, studentRoster: $studentRoster) {
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
        }
    }
  }
`

export const DROP_STUDENT = gql`
  mutation dropStudent($name: String!, $cohortId: ID!){
    dropStudent(name: $name, cohortId: $cohortId){
      _id
      cohortCode
      cohortId
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
    }
  }
`;

export const REMOVE_DROP_STUDENT = gql`
mutation removeDropStudent($name: String!, $cohortId: ID!){
  removeDropStudent(name: $name, cohortId: $cohortId){
    _id
    cohortCode
    cohortId
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
  }
}
`;

export const ADD_COHORT_NOTE = gql`
mutation addCohortNote($content: String!, $createdBy: ID!, $cohortId: ID!){
  addCohortNote(content: $content, createdBy: $createdBy, cohortId: $cohortId){
    _id
    cohortCode
    cohortId
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
  }
}
`;