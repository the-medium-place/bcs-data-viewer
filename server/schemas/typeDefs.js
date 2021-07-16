const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID
    name: String
    email: String
    bcsLoginInfo: BcsLoginInfo!
    cohorts: [Cohort]!
  }

  type BcsLoginInfo {
    bcsEmail: String!
    bcsPassword: String!
  }

  type Note {
    _id: ID!
    content: String
    createdAt: String
    createdBy: User
  }

  type Cohort {
    _id: ID
    cohortCode: String!
    cohortId: Int
    enrollmentId: Int
    studentRoster:[String]
    droppedStudents:[String]
    notes: [Note]
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    allUsers: [User]!
    user(userId: ID!): User
    me: User
    getCohort(cohortId: ID!): Cohort
  }

  type Mutation {
    addUser(name: String!, password: String!, email: String!, bcsEmail: String!, bcsPassword:String!): Auth
    login(name: String!, password: String!): Auth
    addCohort(cohortCode: String!, cohortId: Int!, enrollmentId: Int!, studentRoster: [String!]): User
    dropStudent(name: String!, cohortId: ID!): Cohort
    removeDropStudent(name: String!, cohortId: ID!): Cohort
    addCohortNote(content: String!, createdBy: ID!, cohortId: ID!): Cohort
  }
`;

module.exports = typeDefs;
