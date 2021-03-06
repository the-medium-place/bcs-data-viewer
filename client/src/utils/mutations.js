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

export const ADD_PRESENTATION_NOTES = gql`
  mutation addPresentationNotes($groupsId: ID!, $notes: String!, $groupName: String!, $grade: String!) {
    addPresentationNotes(groupsId: $groupsId, notes: $notes, groupName: $groupName, grade: $grade) {
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
`

export const UPDATE_PRESENTATION_NOTES = gql`
mutation updatePresentationNotes($groupsId: ID!, $noteId: ID!, $notes: String, $grade: String){
  updatePresentationNotes(groupsId: $groupsId, noteId: $noteId, notes: $notes, grade: $grade){
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
`

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


export const UPDATE_USER = gql`
mutation updateUser($name: String!, $email: String!, $bcsEmail: String!, $bcsPassword: String!){
  updateUser(name: $name, email: $email, bcsEmail: $bcsEmail, bcsPassword: $bcsPassword) {
    token
    user {
      _id
      name
    }
  }
}
`

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

export const UPDATE_COHORT_ROSTER = gql`
  mutation updateCohortRoster($cohortId: ID!, $newRoster: [String!]) {
    updateCohortRoster(cohortId: $cohortId, newRoster: $newRoster){
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
    groups {
      _id
      title
      groups
    }
  }
}
`;


export const SAVE_GROUPS = gql`
mutation saveGroups($title: String!, $groups: JSON!, $cohortId: ID!){
  saveGroups(title:$title, groups: $groups, cohortId: $cohortId){
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
    groups {
      _id
      title
      groups
    }
  }
}
`