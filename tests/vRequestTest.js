require('dotenv').config();

const request = require('supertest');
const mongoose = require('mongoose');
const mocha = require('mocha');
const describe = mocha.describe;
const it = mocha.it;
const before = mocha.before;
const beforeEach = mocha.beforeEach;

const app = require('../app');
const vRequest = require('../models/vRequest');

const vRequestTestList = [
    {
        rType: 'algo',
        title: 'Ayuda 1',
        description: 'Yo soy tu padre',
        location: 'Madrid',
        reqDate: Date.now(),
        reqEnd: Date.now(),
        status: 1,
        rating: 0
    }];

describe('vRequest tests', function () {
    this.timeout(10000);

    before(function (done) {
        mongoose.connect('mongodb://localhost/solidariosTest', {
            useNewUrlParser: true,
            useCreateIndex: true,
        }).then(() => {
            mongoose.connection.db.listCollections({name: 'vRequest'})
                .next(function (err, collinfo) {
                    if (err) return done(err);
                    if (!collinfo) {
                        let vrequest = new vRequest(vRequestTestList[0]); //Adding a dummy document to force the collection creation
                        vrequest.save((err) => {
                            if (err) return done(err);
                            return done();
                        });
                    } else {
                        return done();
                    }
                });
        });
    });

    beforeEach((done) => {
        vRequest.collection.drop((err, result) => {
            let vRequestPromises = vRequestTestList.map((userTemp) => {
                let vReq = new vRequest(userTemp);
                return vReq.save();
            });
            Promise.all(vRequestPromises).then(() => {
                done();
            });
        });
    });

    it('Create a vRequest', (done) => {
        request(app)
            .post('/vRequest')
            .send({
                rType: 'algo',
                title: 'Ayuda 2',
                description: 'Yo soy tu madre',
                location: 'Madrid',
                reqDate: Date.now(),
                reqEnd: Date.now()
            })
            .expect(201, done);
    });

    it('Get a vRequest list', (done) => {
        request(app)
            .get('/vRequest')
            .expect(function (res) {
                delete res.body.data.vrequests[0]._id;
                delete res.body.data.vrequests[0].reqDate;
                delete res.body.data.vrequests[0].reqEnd;
            })
            .expect(200,
                {
                    data: {
                        vrequests: [
                            {
                                description: 'Yo soy tu padre',
                                location: 'Madrid',
                                rType: 'algo',
                                rating: 0,
                                status: 1,
                                title: 'Ayuda 1'
                            }
                        ]
                    },
                    error: false,
                    message: ''
                },
                done);
    });

    it('Get a vRequest', (done) => {
        request(app)
            .get('/vRequest/')
            .expect(200, done);
    });


});