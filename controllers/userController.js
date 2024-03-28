const user = require('../models/user');
const model = require('../models/user');

exports.index = (req, res, next)=>{
    model.find()
    .then(users=>res.render('./user/index', {users}))
    .catch(err=>next(err));
};

exports.signup = (req, res)=>{
    res.render('./user/new');
};

exports.create = (req, res, next)=>{
    let user = new model(req.body);
    user.save()
    .then(user=> res.redirect('./users/login'))
    .catch(err=>{
        if(err.name === 'ValidationError' ) {
            err.status = 400;
        }
        next(err);
    });
    
}

exports.login = (req, res)=>{
    res.render('./user/login');
};

exports.authenticate = (req, res, next)=>{
    let {email, password} = req.body;
    model.findOne({email: email}).select('firstName lastName email password')
        .then(user=>{
            console.log(user);
            if(user) {
                user.comparePassword(password)
                    .then(isMatch=>{
                        if(err) return next(err);
                        if(isMatch) {
                            //req.session.userId = user._id;
                            return res.redirect('/users/profile');
                        } else {
                            console.log('Invalid password');
                            redirect('/users/login');
                        }
                });
            } else {
                console.log('Invalid email');
                redirect('/users/login');
            }
        })
        .catch(err=>next(err));
}