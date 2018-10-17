const request = require('supertest');

const app = require('../app');

const mongoose = require('mongoose');
const mocha = require('mocha');

const config = require('../config');

const User = require('../models/user');

const userTestList = [
    {
        role: "admin",
        email: "admin@coredumped.es",
        name: "Admin",
        surname: "Test",
        dni: "00000000A",
        description: "Yo soy tu padre",
        address: "C/María de Molina Nº1 1ºA",
        age: 100,
        phone: 999999999,
        gender: "Male",
        status: "Verified"
    }, {
        role: "needer",
        email: "nedeer@coredumped.es",
        name: "Nedeer",
        surname: "Test",
        dni: "00000002A",
        description: "Socorro!!",
        address: "C/María de Molina Nº1 1ºA",
        age: 77,
        phone: 999999999,
        gender: "Male",
        status: "Verified"
    }, {
        role: "volunteer",
        email: "volunteer@coredumped.es",
        name: "Volunteer",
        surname: "Test",
        dni: "00000001A",
        description: "Hi!",
        address: "C/María de Molina Nº1 1ºA",
        age: 27,
        phone: 999999999,
        gender: "Male",
        status: "Verified"
    }];

describe('User tests', function () {
    this.timeout(10000);

    let token;

    before(function (done) {
        mongoose.connect('mongodb://localhost/solidariosTest', {useNewUrlParser: true}).then((err) => {
            return done();
        });
    });

    beforeEach((done) => {
        User.collection.drop((err, result) => {
            let userPromises = userTestList.map((userTemp) => {
                let user = new User(userTemp);
                if (user.role === 'admin') user.admin = config.ADMIN_TOKEN;
                user.password = config.ADMIN_PASS;
                return user.save();
            });
            Promise.all(userPromises).then((result) => {
                setTimeout(() => {
                    request(app)
                        .post('/user/login')
                        .send({
                            email: 'admin@coredumped.es',
                            password: config.ADMIN_PASS
                        })
                        .end((err, res) => {
                            let result = JSON.parse(res.text);
                            token = result.token;
                            done();
                        });
                }, 300);

            })
        });
    });


    it('Register a new user', (done) => {
        request(app)
            .post('/user/register')
            .send({
                name: 'Juan',
                surname: 'Martinez',
                password: 'securePassword',
                dni: '76452201S',
                email: 'test@coredumped.es',
                phone: '672912283',
                address: 'C/María de Molina Nº22 1ºB',
                age: '56',
                gender: 'Male',
                description: 'Yo soy tu padre',
                photo: 'http://www.girardatlarge.com/wp-content/uploads/2013/05/gravatar-60-grey.jpg'
            })
            .expect(201, done)
    });

    it('Get info for the user logged', function (done) {
        request(app)
            .get('/user')
            .set('Authorization', 'Bearer ' + token)
            .expect(200, userTestList[0], done);
    });

    it('Return user list', function (done) {
        request(app)
            .get('/user/list')
            .set('Authorization', 'Bearer ' + token)
            .expect(function (res) {
                res.body.map((user) => {
                    delete user._id;
                })
            })
            .expect(200, userTestList, done);
    });

    it('Update a user', function (done) {
        request(app)
            .patch('/user')
            .set('Authorization', 'Bearer ' + token)
            .send({
                name: "AdminTest",
                password: "securePassword2"
            })
            .expect(200, {
                error: false,
                message: "Datos actualizados",
                data: {
                    user: {
                        role: 'admin',
                        email: 'admin@coredumped.es',
                        name: 'AdminTest',
                        surname: 'Test',
                        dni: '00000000A',
                        description: 'Yo soy tu padre',
                        address: 'C/María de Molina Nº1 1ºA',
                        age: 100,
                        phone: 999999999,
                        gender: 'Male',
                        status: 'Verified',
                    }
                }
            }, done);
    });

    it('Return volunteer list', function (done) {
        request(app)
            .get('/user/volunteer')
            .set('Authorization', 'Bearer ' + token)
            .expect(function (res) {
                delete res.body[0]._id;
            })
            .expect(200, [userTestList[2]], done);
    });

    it('Delete a user', function (done) {
        let userId = '';
        request(app)
            .get('/user/volunteer')
            .set('Authorization', 'Bearer ' + token)
            .end((err, res) => {
                request(app)
                    .delete('/user/' + res.body[0]._id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200, done);
            });

    })

});