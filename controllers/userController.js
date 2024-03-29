const user = require('../models/user');
const model = require('../models/user');
const flash = require('connect-flash');

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
    .then(user=> res.redirect('./login'))
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
    console.log(req);
    let {email, password} = req.body;
    model.findOne({email})
        .then(user=>{
            console.log(user);
            if(user) {
                user.comparePassword(password)
                    .then(isMatch=>{
                        if(isMatch) {
                            req.session.user = user._id;
                            req.flash('success', 'You are now logged in');
                            return res.redirect('./profile');
                        } else {
                            req.flash('error', 'Invalid password');
                            res.redirect('./login');
                        }
                });
            } else {
                req.flash('error', 'Invalid email');
                res.redirect('./login');
            }
        })
        .catch(err=>next(err));
}

exports.profile = (req, res)=>{
    if(req.session.user === undefined) return res.redirect('./login');
    let id = req.session.user;
    model.findById(id)
        .then(user=>res.render('./user/profile', {user}))
        .catch(err=>next(err));
}

exports.logout = (req, res, next)=>{
    req.session.destroy(err=>{
        if(err) 
            return next(err);
        else 
            return res.redirect('/');
    });
    res.redirect('/');
}