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
  mutation addCohort($cohortCode: String!, $cohortId: Int!, $enrollmentId: Int!) {
    addCohort(cohortCode: $cohortCode, cohortId: $cohortId, enrollmentId: $enrollmentId) {
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
`

export const CREATE_TODO = gql`
  mutation createTodo($title: String!, $content: String!, $dueDate: String) {
    createTodo(title: $title, content: $content, dueDate: $dueDate) {
       _id
       name
       todos {
         _id
         title
         content
         dueDate
       }
    }
  }
`;

export const DELETE_TODO = gql`
  mutation deleteTodo($todoId: ID!) {
    deleteTodo(todoId: $todoId) {
      _id
      name
      todos {
        _id
        title
        content
        dueDate
      }
    }
  }
`

export const EDIT_TODO = gql`
mutation editTodo($todoId: ID!, $title: String!, $content: String!, $isComplete: Boolean!, $dueDate: String) {
  editTodo(todoId: $todoId, title: $title, content: $content, isComplete: $isComplete, dueDate: $dueDate) {
    _id
    title
    content
    isComplete
    dueDate
  }
}
`