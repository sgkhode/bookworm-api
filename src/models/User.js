import mongoose from 'mongoose';
import brcypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import uniqueValidator from 'mongoose-unique-validator';

// TODO: Add uniqueness and email validation

const schema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        index: true,
        unique: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    confirmed: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

schema.methods.isValidPassword = function isValidPassword(password) {
    return brcypt.compareSync(password, this.passwordHash);
}

schema.methods.setPassword = function setPassword(password) {
    this.passwordHash = brcypt.hashSync(password, 10);
}

schema.methods.generateJWT = function generateJWT() {
    return jwt.sign({
        email: this.email
    }, process.env.JWT_SECRET)
}

schema.methods.toAuthJSON = function toAuthJSON() {
    return {
        email: this.email,
        confirmed: this.confirmed,
        token: this.generateJWT()
    }
}

schema.plugin(uniqueValidator, { message: 'This Email is already registered' });

export default mongoose.model('User', schema);