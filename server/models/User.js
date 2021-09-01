const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
require('dotenv').config();


function encryptBCS(password, bcsEmail) {
  // console.log({ crypto })

  // ENCRYPT BCS LOGIN INFO USING NODE.JS CRYPTO
  const algorithm = 'aes-256-cbc';

  // generate 16 bytes salted key using user email as a base 
  const initVector = crypto.scryptSync(bcsEmail, 'salt', 16);

  // secret key generate 32 bytes salted key using user email as a base
  const SecurityKey = crypto.scryptSync(bcsEmail, 'salt', 32);

  // the cipher function
  const cipher = crypto.createCipheriv(algorithm, SecurityKey, initVector)

  let encryptedPassword = cipher.update(password, "utf-8", "hex")

  encryptedPassword += cipher.final('hex')

  console.log({ encryptedPassword })

  return encryptedPassword;
}

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

  if (!this.isModified('password') || !this.isModified('bcsLoginInfo')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    this.bcsLoginInfo.bcsPassword = await encryptBCS(this.bcsLoginInfo.bcsPassword, this.bcsLoginInfo.bcsEmail)
    return next();
  } catch (err) {
    return next(err);
  }



});

UserSchema.pre('findOneAndUpdate', async function update(next) {
  if (!this.getUpdate().$set) { return next() }

  let bcsPassword = this.getUpdate().$set.bcsLoginInfo.bcsPassword;
  let bcsEmail = this.getUpdate().$set.bcsLoginInfo.bcsEmail;
  // if no change to bcs password...
  if (!bcsPassword) {
    return next()
  };


  try {
    this.getUpdate().$set.bcsLoginInfo.bcsPassword = await encryptBCS(bcsPassword, bcsEmail)
    next();
  } catch (err) {
    return next(err);
  }
})

UserSchema.methods.validatePassword = async function validatePassword(data) {
  return bcrypt.compare(data, this.password);
};

const User = model('User', UserSchema);

module.exports = User;
