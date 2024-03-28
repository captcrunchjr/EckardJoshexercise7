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
    model.findOne({email})
        .then(user=>{
            console.log(user);
            if(user) {
                user.comparePassword(password)
                    .then(isMatch=>{
                        if(isMatch) {
                            //req.session.userId = user._id;
                            return res.redirect('./profile');
                        } else {
                            console.log('Invalid password');
                            res.redirect('./login');
                        }
                });
            } else {
                console.log('Invalid email');
                res.redirect('./login');
            }
        })
        .catch(err=>next(err));
}

exports.profile = (req, res)=>{
    res.render('./user/profile');
}