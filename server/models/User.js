const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  bcsLoginInfo: {
    bcsEmail: { type: String, required: true },
    bcsPassword: { type: String, required: true }
  },
  // array of cohort class codes
  cohorts: [{
    type: Schema.Types.ObjectId,
    ref: 'Cohort'
  }]

});

// BCRYPT PASSWORD ENCRYPTION
UserSchema.pre('save', async function save(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

UserSchema.methods.validatePassword = async function validatePassword(data) {
  return bcrypt.compare(data, this.password);
};

UserSchema.methods.validateBCSPassword = async function validateBCSPassword(data) {
  return bcrypt.compare(data, this.bcsLoginInfo.bcsPassword);
};

const User = model('User', UserSchema);

module.exports = User;
