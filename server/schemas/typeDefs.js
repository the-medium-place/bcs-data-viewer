const { gql } = require('apollo-server-express');

const typeDefs = gql`
  scalar Date

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

  type Cohort {
    _id: ID
    cohortCode: String!
    cohortId: Int
    enrollmentId: Int
    studentRoster:[String]
    droppedStudents:[String]
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    allUsers: [User]!
    user(userId: ID!): User
    me: User
  }

  type Mutation {
    addUser(name: String!, password: String!, email: String!, bcsEmail: String!, bcsPassword:String!): Auth
    login(name: String!, password: String!): Auth
    addCohort(cohortCode: String!, cohortId: Int!, enrollmentId: Int!): User
  }
`;

module.exports = typeDefs;
