const { User, Cohort, Note, Student, Groups } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');
const decryptPassword = require('../utils/decryptPassword');

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
      // console.log(context.user);
      // console.log(context)
      if (context.user) {
        const loggedInUser = await User.findOne({ _id: context.user._id }).populate({
          path: 'cohorts',
          populate: {
            path: 'notes',
          },
          populate: {
            path: 'groups'
          }
        });

        // console.log(loggedInUser.bcsLoginInfo.bcsPassword)
        loggedInUser.bcsLoginInfo.bcsPassword = decryptPassword(loggedInUser.bcsLoginInfo.bcsEmail, loggedInUser.bcsLoginInfo.bcsPassword);
        // console.log(loggedInUser.bcsLoginInfo.bcsPasswoÍrd)

        return loggedInUser;
      }
      throw new AuthenticationError('You need to be logged in!');
    },

    getCohort: async (parent, { cohortId }, context) => {
      if (context.user) {
        return await Cohort.findOne({ _id: cohortId }).populate({
          path: 'notes',
          populate: {
            path: 'createdBy'
          }
        })
          .populate({
            path: 'groups',
            populate: {
              path: 'notes',
              populate: 'author'
            }
          })
      }
      throw new AuthenticationError('You need to be logged in!');
    },

    getGroups: async (parent, { groupsId }, context) => {
      if (context.user) {
        return await Groups.findOne({ _id: groupsId }).populate({ path: 'notes', populate: 'author' })
      }
      throw new AuthenticationError("You need to be logged in!")
    }
  },

  // MUTATIONS
  Mutation: {
    addUser: async (parent, { name, password, email, bcsEmail, bcsPassword }) => {
      const newUser = await User.create({ name, password, email, bcsLoginInfo: { bcsEmail, bcsPassword } });
      // console.log('resolvers.js newUser: ', newUser)
      const token = signToken(newUser);
      console.log({ token, newUser })
      return { token, newUser };
    },
    updateUser: async (parent, { name, email, bcsEmail, bcsPassword }, context) => {
      if (context.user) {

        const updateInfo = {
          name,
          email,
          bcsLoginInfo: {
            bcsEmail,
            bcsPassword
          }
        }
        const updatedUser = await User.findOneAndUpdate({ _id: context.user._id }, { $set: updateInfo }, { new: true });
        const token = signToken(updatedUser);
        console.log({ token, updatedUser })
        return { token, updatedUser }
      }
      throw new AuthenticationError('You are not logged in!');

    },
    login: async (parent, { name, password }) => {
      // console.log("inside the resolvers.js login function")
      // Look up the user by the provided email address. Since the `email` field is unique, we know that only one person will exist with that email
      const user = await User.findOne({ name });

      // If there is no user with that email address, return an Authentication error stating so
      if (!user) {
        throw new AuthenticationError('Username not found');
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
    addCohort: async (parent, { cohortCode, cohortId, enrollmentId, studentRoster }, context) => {
      // console.log('studentRoster backend: ', studentRoster)
      if (context.user) {
        let cohortToAdd;
        let cohortExists = await Cohort.findOne({ cohortCode })

        // check if cohort is already in database
        // ======================================
        if (!cohortExists) {
          cohortToAdd = await Cohort.create({ cohortCode, cohortId, enrollmentId, studentRoster })
        } else {
          cohortToAdd = cohortExists;
        }
        // console.log(cohortToAdd)
        // add cohort to logged in user's cohorts list
        // ===========================================
        const updatedUser = await User.findOneAndUpdate({ _id: context.user._id }, { $addToSet: { cohorts: cohortToAdd._id } }, { new: true }).populate('cohorts')
        // console.log("updatedUser: ", updatedUser)


        return updatedUser;
      }
      throw new AuthenticationError('You are not logged in!');
    },

    dropStudent: async (parent, { name, cohortId }, context) => {
      if (context.user) {
        return await Cohort.findOneAndUpdate({ _id: cohortId }, { $addToSet: { droppedStudents: name } }, { new: true }).populate({ path: 'notes', populate: 'createdBy' }).populate('groups')
      }
      return new AuthenticationError('You are not logged in!')
    },

    removeDropStudent: async (parent, { name, cohortId }, context) => {
      if (context.user) {

        return await Cohort.findOneAndUpdate({ _id: cohortId }, { $pull: { droppedStudents: name } }, { new: true }).populate({ path: 'notes', populate: 'createdBy' }).populate('groups')
      }
      throw new AuthenticationError('You are not logged in!');

    },

    addCohortNote: async (parent, { content, createdBy, cohortId }, context) => {
      // create note in database
      if (context.user) {

        const newNote = await Note.create({ content, createdBy })

        // assign new note to cohort
        return await Cohort.findOneAndUpdate({ _id: cohortId }, { $addToSet: { notes: newNote._id } }, { new: true }).populate({ path: 'notes', populate: 'createdBy' }).populate('groups')
      }
      throw new AuthenticationError('You are not logged in!');

    },

    saveGroups: async (parent, { title, groups, cohortId }, context) => {
      if (context.user) {
        // create the group mongo object
        const newGroups = await Groups.create({ title, groups })

        // find the cohort and add new group object to groups array
        return await Cohort.findOneAndUpdate({ _id: cohortId }, { $addToSet: { groups: newGroups._id } }, { new: true })
          .populate({ path: 'notes', populate: 'createdBy' })
          .populate('groups')
      }

      throw new AuthenticationError('You are not logged in!');

    },

    addPresentationNotes: async (parent, { groupsId, groupName, notes, grade }, context) => {
      if (context.user) {

        const notesObj = {
          author: context.user._id,
          notes,
          grade,
          groupName,
        }

        console.log({ notesObj, groupsId })
        // add note object to 'notes' array on groups model
        const updatedGroups = await Groups.findOneAndUpdate({ _id: groupsId }, { $addToSet: { 'notes': notesObj } }, { new: true }).populate({ path: 'notes', populate: 'author' })
        console.log({ updatedGroups })
        return updatedGroups;
      }

      throw new AuthenticationError('You are not logged in!');


    },

    updatePresentationNotes: async (parent, { notes, grade, noteId }, context) => {
      if (context.user) {
        // const notesObj = {
        //   notes,
        //   grade,
        // }

        const updatedGroups = await Groups.findOneAndUpdate({
          'notes._id': noteId
        }, {
          $set: {
            'notes.$.notes': notes,
            'notes.$.grade': grade
          }
        }, {
          new: true
        }).populate({ path: 'notes', populate: 'author' })

        return updatedGroups;


      }

      throw new AuthenticationError('You are not logged in!');
    },

    updateCohortRoster: async (parent, { cohortId, newRoster }, context) => {
      if (context.user) {
        const updatedCohort = await Cohort.findOneAndUpdate({ _id: cohortId }, { $set: { studentRoster: newRoster } }, { new: true }).populate({ path: 'notes', populate: 'createdBy' }).populate('groups')
        return updatedCohort;

      }
      throw new AuthenticationError('You are not logged in!');

    }

  },





};

module.exports = resolvers;
