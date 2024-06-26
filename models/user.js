const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bycrypt = require('bcrypt');

const userSchema = new Schema({
    firstName: {type: String, required: [true, 'first name is required']},
    lastName: {type: String, required: [true, 'last name is required']},
    email: {type: String, required: [true, 'email is required'], unique: true},
    password: {type: String, required: [true, 'password is required']}
});

userSchema.pre('save', function(next){
    let user = this;
    if(!user.isModified('password')) return next();
    bycrypt.hash(user.password, 10)
        .then(hash=>{
            user.password = hash;
            next();
        })
        .catch(err=>next(err));
});

userSchema.methods.comparePassword = function(loginPassword, next){
    return bycrypt.compare(loginPassword, this.password);
};
module.exports = mongoose.model('User', userSchema);