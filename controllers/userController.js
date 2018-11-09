'use strict';

const services = require('../services');
const input = require('../services/inputValidators');
const token = require('../services/token');
const mail = require('../services/mailManager');
const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const User = require('../models/user');
const config = require('../config');

function signUp(req, res) {
    let name = req.body.name;
    let surname = req.body.surname;
    let password = req.body.password;
    let dni = req.body.dni;
    let email = req.body.email;
    let phone = req.body.phone;
    let address = req.body.address;
    let age = req.body.age;
    let gender = req.body.gender;
    let description = req.body.description;
    let avatarImage = req.body.avatarImage;

    if (!req.body.avatarImage) avatarImage = config.PREDEFINED_USER_IMAGE;

    //TODO: Validate all inputs
    if (!input.validEmail(email)) return res.status(400).send({
        error: true,
        message: 'El email no es válido',
        data: {}
    });
    email = services.normEmail(email);
    if (!input.validPassword(password)) return res.status(400).send({
        error: true,
        message: 'La contraseña no es válida',
        data: {}
    });
    if (!input.validName(name)) return res.status(400).send({
        error: true,
        message: 'El nombre no es válido',
        data: {}
    });

    User.findOne({ $or: [{ email: email }, { dni: dni }, { phone: phone }] })
        .exec((err, userExist) => {
            if (err) return res.status(500).send({
                error: true,
                message: 'Error del servidor',
                data: {}
            });
            if (userExist) return res.status(409).send({
                error: true,
                message: 'Ya existe un usuario con ese email',
                data: {}
            });

            crypto.randomBytes(20, (err, token) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send({
                        error: true,
                        message: 'Error del servidor',
                        data: {}
                    });
                }
                if (!token) return res.status(500).send({
                    error: true,
                    message: 'Error al generar una autorización',
                    data: {}
                });
                const expires = Date.now() + 3600000 * config.VERIFY_EMAIL_EXP;
                const user = new User({
                    role: 'needer',
                    name: name,
                    surname: surname,
                    password: password,
                    dni: dni,
                    email: email,
                    phone: phone,
                    address: address,
                    age: age,
                    gender: gender,
                    description: description,
                    avatarImage: avatarImage,
                    status: 'Verified',
                    verifyEmailToken: token.toString('hex'),
                    verifyEmailExpires: expires
                });
                user.save((err, user) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).send({
                            error: true,
                            message: 'Error de la base de datos',
                            data: {}
                        });
                    }
                    if (!user) return res.status(500).send({
                        error: true,
                        message: 'Error del servidor al guardar el usuario',
                        data: {}
                    });
                    user.password = undefined;

                    if (config.SEND_WELCOME_EMAIL)
                        mail.sendWelcomeEmail(user.email, user.name, user.verifyEmailToken);
                    return res.status(201).send({
                        error: false,
                        message: 'Usuario creado',
                        data: {}
                    });
                });
            });
        });
}

function login(req, res) {
    if (!input.validEmail(req.body.email)) return res.status(400).send({
        error: true,
        message: 'El email no es válido',
        data: {}
    });
    if (!req.body.password) return res.status(400).send({
        error: true,
        message: 'La contraseña no es válida',
        data: {}
    });

    User.findOne({ email: req.body.email })
        .select('+password')
        .exec((err, user) => {
            if (err) return res.status(500).send({
                error: true,
                message: 'Error del servidor',
                data: {}
            });
            if (!user) return res.status(404).send({
                error: true,
                message: 'Usuario y/o contraseña erroneos',
                data: {}
            });

            //if (user.status !== 'Verified') return res.sendStatus(401);

            bcrypt.compare(req.body.password, user.password, (err, equals) => {
                if (err) return res.status(500).send({
                    error: true,
                    message: 'Error del servidor',
                    data: {}
                });
                if (!equals) return res.status(404).send({
                    error: true,
                    message: 'Usuario y/o contraseña erroneos',
                    data: {}
                });
                user.password = undefined;
                return res.status(200).send({
                    token: token.generate(user),
                    user: user
                });
            });
        });
}

function renew(req, res) {
    console.log('req.user: ' + req.user);
    User.findById(req.user)
        .select('-_id')
        .exec((err, user) => {
            if (err) return res.status(500).send({
                error: true,
                message: 'Error del servidor',
                data: {}
            });
            if (!user) return res.status(404).send({
                error: true,
                message: 'Usuario no encontrado',
                data: {}
            });
            return res.status(200).send({
                isAdmin: services.isAdmin(user),
                token: token.generate(user),
                user: user
            });
        });
}

function updateUserData(req, res) {
    if (!req.body.name &&
        !req.body.avatarImage &&
        !req.body.password)
        return res.status(400).send({
            error: true,
            message: 'Debe insertar un nombre o una contraseña',
            data: {}
        });

    let updatedFields = {};
    if (req.body.name) {
        updatedFields.name = req.body.name;
        if (!input.validName(updatedFields.name)) return res.status(400).send({
            error: true,
            message: 'El nombre no es válido',
            data: {}
        });
    }
    if (req.body.avatarImage) {
        updatedFields.avatarImage = req.body.avatarImage;
        if (!input.validURL(updatedFields.avatarImage)) return res.status(400).send({
            error: true,
            message: 'La url no es válida',
            data: {}
        });
    }
    if (req.body.password) {
        updatedFields.password = req.body.password;
        if (!input.validPassword(updatedFields.password)) return res.status(400).send({
            error: true,
            message: 'La contraseña no es válida',
            data: {}
        });
    }
    User.findById(req.user, (err, user) => {
        if (err) return res.status(500).send({
            error: true,
            message: 'Error del servidor',
            data: {}
        });
        if (!user) return res.status(404).send({
            error: true,
            message: 'Usuario no encontrado',
            data: {}
        });
        user.set(updatedFields);
        user.save((err, userSaved) => {
            if (err) return res.status(500).send({
                error: true,
                message: 'Error del servidor',
                data: {}
            });
            userSaved = JSON.parse(JSON.stringify(userSaved));
            userSaved.password = undefined;
            userSaved._id = undefined;
            return res.status(200).send({
                error: false,
                message: 'Datos actualizados',
                data: {
                    user: userSaved
                }
            });
        });
    });
}

function getUserData(req, res) {
    User.findById(req.user)
        .select('-_id')
        .exec((err, user) => {
            if (err) return res.status(500).send({
                error: true,
                message: 'Error del servidor',
                data: {}
            });
            if (!user) return res.status(404).send({
                error: true,
                message: 'Usuario no encontrado',
                data: {}
            });
            return res.status(200).send(user);
        });
}

function getUser(req, res) {
    let userId = req.params.id;
    if (!input.validId(userId)) return res.status(400).send({
        error: true,
        message: 'El id no es válido',
        data: {}
    });

    User.findById(userId, (err, user) => {
        if (err) return res.status(500).send({
            error: true,
            message: 'Error del servidor',
            data: {}
        });
        if (!user) return res.status(404).send({
            error: true,
            message: 'Usuario no encontrado',
            data: {}
        });
        return res.status(200).send(user);
    });
}

function getUserList(req, res) {
    var query = {};
    let role = req.query.role;
    if (role && role !== 'needer' && role !== 'volunteer' && role !== 'admin') {
        return res.status(400).send({
            error: true,
            message: 'Invalid role',
            data: {}
        });
    }
    if (role) query.role = role;
    User.find(query)
        .sort('role')
        .exec((err, users) => {
            if (err) return res.status(500).send({
                error: true,
                message: 'Error del servidor',
                data: { err }
            });
            if (!users) return res.status(404).send({
                error: true,
                message: 'Usuario no encontrado',
                data: {}
            });
            console.log(users);
            res.status(200).send(users);
        });
}

function restorePassword(req, res) {
    const email = req.query.email;
    if (!input.validEmail(email)) return res.status(400).send({
        error: true,
        message: 'El email no es válido',
        data: {}
    });

    User.findOne({ email: email })
        .exec((err, user) => {
            if (!user) return res.status(404).send({
                error: true,
                message: 'Usuario no encontrado',
                data: {}
            });
            crypto.randomBytes(20, (err, token) => {
                if (err) return res.status(500).send({
                    error: true,
                    message: 'Error del servidor',
                    data: {}
                });
                if (!token) return res.status(500).send({
                    error: true,
                    message: 'Error del servidor',
                    data: {}
                });
                user.resetPasswordToken = token.toString('hex');
                user.resetPasswordExpires = Date.now() + 3600000 * config.RESTORE_PASS_EXP;
                user.save((err, user) => {
                    mail.sendPasswordEmail(user.email, user.name, user.resetPasswordToken);
                    return res.sendStatus(200);
                });
            });
        });
}

function resetPasswordPost(req, res) {
    const tokenSplit = req.query.token.split('/');
    const email = services.decrypt(tokenSplit[0]);
    const token = tokenSplit[1];
    const password = req.body.password;

    if (!input.validPassword(password)) return res.status(400).send({
        error: true,
        message: 'La contraseña no es válida',
        data: {}
    });

    User.findOne({ email: email })
        .select('+password +resetPasswordExpires +resetPasswordToken')
        .exec((err, user) => {
            if (err) return res.status(500).send({
                error: true,
                message: 'Error del servidor',
                data: {}
            });
            if (!user) return res.status(404).send({
                error: true,
                message: 'Usuario no encontrado',
                data: {}
            });
            if (!user.resetPasswordExpires ||
                user.resetPasswordExpires < Date.now()) return res.sendStatus(410);
            if (!user.resetPasswordToken ||
                user.resetPasswordToken !== token) return res.sendStatus(401);

            user.password = password;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            user.save((err, user) => {
                if (err) return res.status(500).send({
                    error: true,
                    message: 'Error del servidor',
                    data: {}
                });
                return res.sendStatus(200);
            });
        });
}

function deleteUser(req, res) {
    let userId = req.params.id;
    if (!input.validId(userId)) return res.status(400).send({
        error: true,
        message: 'El id no es válido',
        data: {}
    });

    User.findById(userId, (err, user) => {
        if (err) return res.status(500).send({
            error: true,
            message: 'Error del servidor',
            data: {}
        });
        if (!user) return res.status(404).send({
            error: true,
            message: 'Usuario no encontrado',
            data: {}
        });
        user.remove();
        return res.sendStatus(200);
    });
}

function setUserStatus(req, res) {   //TODO: Change this by a email validation
    let userId = req.params.id;
    let status = req.query.status;
    if (!input.validId(userId)) return res.status(400).send({
        error: true,
        message: 'El id no es válido',
        data: {}
    });
    if (!input.validStatus(status)) return res.status(400).send({
        error: true,
        message: 'El status no es válido',
        data: {}
    });

    User.findById(userId, (err, user) => {
        if (err) return res.status(500).send({
            error: true,
            message: 'Error del servidor',
            data: {}
        });
        if (!user) return res.status(404).send({
            error: true,
            message: 'Usuario no encontrado',
            data: {}
        });
        user.set({ status: status });
        user.save((err, userSaved) => {
            if (err) return res.status(500).send({
                error: true,
                message: 'Error al guardar los cambios',
                data: {}
            });
            return res.status(200).send({
                error: false,
                message: 'Estado actualizado',
                data: {}
            });
        });
    });
}

function verifyEmail(req, res) {
    const tokenSplit = req.query.token.split('/');
    const email = services.decrypt(tokenSplit[0]);
    const token = tokenSplit[1];

    User.findOne({ email: email })
        .select('+verifyEmailToken +verifyEmailExpires')
        .exec((err, user) => {
            if (err) return res.status(500).send({
                error: true,
                message: 'Error del servidor',
                data: {}
            });
            if (!user) return res.status(404).send({
                error: true,
                message: 'Usuario no encontrado',
                data: {}
            });
            if (user.status === 'Verified') return res.status(410).send({
                error: true,
                message: 'Usuario ya verificado',
                data: {}
            });
            if (!user.verifyEmailExpires ||
                user.verifyEmailExpires < Date.now()) return res.status(410).send({
                    error: true,
                    message: 'El token a expirado',
                    data: {}
                });
            if (!user.verifyEmailToken ||
                user.verifyEmailToken !== token) return res.status(401).send({
                    error: true,
                    message: 'Token inválido',
                    data: {}
                });

            user.status = 'Verified';
            user.verifyEmailToken = undefined;
            user.verifyEmailExpires = undefined;
            user.save((err, user) => {
                if (err) return res.status(500).send({
                    error: true,
                    message: 'Error del servidor',
                    data: {}
                });
                return res.sendStatus(200);  //TODO: return token
            });
        });
}

module.exports = {
    signUp,
    login,
    renew,
    updateUserData,
    getUserData,
    getUser,
    getUserList,
    restorePassword,
    resetPasswordPost,
    deleteUser,
    setUserStatus,
    verifyEmail
};
