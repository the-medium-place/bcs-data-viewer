const { User, Cohort } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');


const resolvers = {

  // QUERIES
  Query: {
    allUsers: async () => {
      return User.find().populate('cohorts');
    },

    user: async (parent, { userId }) => {
      const user = User.findOne({ _id: userId }).populate('cohorts');
      return user;
    },

    me: async (parent, args, context) => {
      // console.log(context)
      if (context.user) {
        const loggedInUser = await User.findOne({ _id: context.user._id }).populate('cohorts');
        // console.log(loggedInUser)
        return loggedInUser;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },

  // MUTATIONS
  Mutation: {
    addUser: async (parent, { name, password, email, bcsEmail, bcsPassword }) => {
      const newUser = await User.create({ name, password, email, bcsLoginInfo: { bcsEmail, bcsPassword } });
      // console.log('resolvers.js newUser: ', newUser)
      const token = signToken(newUser);
      return { token, newUser };
    },
    login: async (parent, { name, password }) => {
      // console.log("inside the resolvers.js login function")
      // Look up the user by the provided email address. Since the `email` field is unique, we know that only one person will exist with that email
      const user = await User.findOne({ name });

      // If there is no user with that email address, return an Authentication error stating so
      if (!user) {
        throw new AuthenticationError('No user found with this email address');
      }

      // If there is a user found, execute the `isCorrectPassword` instance method and check if the correct password was provided
      const correctPw = await user.validatePassword(password);

      // If the password is incorrect, return an Authentication error stating so
      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      // If email and password are correct, sign user into the application with a JWT
      const token = signToken(user);

      // Return an `Auth` object that consists of the signed token and user's information
      return { token, user };
    },
    addCohort: async (parent, { cohortCode, cohortId, enrollmentId }, context) => {
      if (context.user) {
        let cohortToAdd;
        let cohortExists = await Cohort.findOne({ cohortCode })
        // console.log("cohortExists: ", cohortExists)

        // check if cohort is already in database
        // ======================================
        if (!cohortExists) {
          cohortToAdd = await Cohort.create({ cohortCode, cohortId, enrollmentId })
        } else {
          cohortToAdd = cohortExists;
        }
        // console.log(cohortToAdd)
        // add cohort to logged in user's cohorts list
        // ===========================================
        const updatedUser = await User.findOneAndUpdate({ _id: context.user._id }, { $addToSet: { cohorts: cohortToAdd._id } }, { new: true }).populate('cohorts')
        console.log("updatedUser: ", updatedUser)


        return updatedUser;
      }
      throw new AuthenticationError('You are not logged in!');
    }

    // addTodo: async (parent, { userId, todoId }, context) => {
    //   if (context.user) {

    //     return User.findOneAndUpdate(
    //       { _id: userId },
    //       {
    //         $addToSet: { todos: todoId },
    //       },
    //       {
    //         new: true,
    //         // runValidators: true,
    //       }
    //     ).populate('cohorts');
    //   }
    //   throw new AuthenticationError('You are not logged in!');

    // },
    // removeUser: async (parent, { userId }) => {
    //   return User.findOneAndDelete({ _id: userId });
    // },
  }
};

module.exports = resolvers;
