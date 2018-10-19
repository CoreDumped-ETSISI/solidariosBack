'use strict';

const vRequest = require('../models/vRequest');
const input = require('../services/inputValidators');

function getvRequests(req, res) {
    vRequest.find({}, (err, vrequests) => {
        if (err) {
            return res.status(500).send({
                error : true,
                message : 'Error en el servidor',
                data : {}
            });
        }
        if (!vrequests) return res.status(404).send({
            error : true,
            message : 'Ningún vRequest encontrado',
            data : {}
        });

        return res.status(200).send({
            error : false,
            message : '',
            data : {vrequests}
        });
    });
}

function getvRequest(req, res) {
    const idvRequest = req.params.idvRequest;
    vRequest.find({_id: idvRequest}, (err, vrequests) => {
        if (err) {
            return res.status(500).send({
                error : true,
                message : 'Error en el servidor',
                data : {}
            });
        }
        if (!vrequests) return res.status(404).send({
            error : true,
            message : 'Ningún vRequest encontrado',
            data : {}
        });
        return res.status(200).send({
            error : false,
            message : '',
            data : {vrequests}
        });
    });
}

function createvRequest(req, res) {
    let rType = req.body.rType;
    let title = req.body.title;
    let description = req.body.description;
    let creationDate = req.body.creationDate;
    let location = req.body.location;
    let reqDate = req.body.reqDate;
    let reqTime = req.body.reqTime;

    //TODO: Filter the inputs

    let vRequests = new vRequest({
        rType: rType,
        title: title,
        description: description,
        creationDate: creationDate,
        location: location,
        reqDate: reqDate,
        reqTime: reqTime

    });

    vRequests.save(function (err, vRequestSaved) {
        if (err) {
            return res.status(500).send({
                error : true,
                message : 'Error en el servidor',
                data : {}
            });
        }
        return res.status(201).send({
            error : false,
            message : 'vRequest creada',
            data : {}
        });
    });
}

function deletevRequest(req, res) {
    let idvRequest = req.params.idvRequest;

    if (idvRequest === undefined)
        return res.status(404).send({
            error : true,
            message : 'vRequest no definida',
            data : {}
        });

    vRequest.findOne({_id: idvRequest}, (err, events) => {
        if (err) {
            return res.status(500).send({
                error : true,
                message : 'Error en el servidor',
                data : {}
            });
        }
        if (!vRequest) return res.status(404).send({
            error : true,
            message : 'vRequest no está en la base de datos',
            data : {}
        });

        vRequest.remove(vRequest).exec((err, vRquestDeleted) => {
            if (err) {
                return res.status(500).send({
                    error : true,
                    message : 'Error en el servidor',
                    data : {}
                });
            }
            if (!vRquestDeleted) return res.status(404).send({
                error : true,
                message : 'vRequest no encontrado',
                data : {}
            });

            return res.status(200).send({
                error : false,
                message : 'vRequest borrada',
                data : {}
            });
        });
    });
}
function vRequestStatus(req,res){
    let state = req.body.state;
    if(!input.vRequestStatus(state))
        return res.status(400).send({
            error : true,
            message : 'No es un status',
            data : {}
        });

    vRequest.update({_id: req.body.id}, {state: state }, {multi : false}, function(err) {
        if(err) { 
            return res.status(500).send({
                error : true,
                message : 'Error en el servidor',
                data : {}
            });
        }
        return res.status(200).send({
            error : false,
            message : 'OK',
            data : {}
        });

    });  
}

function rateRequest(req, res){
    let rating = req.body.rating;
    if(!input.validRating(rating))
        return res.status(400).send({
            error : true,
            message : 'Rating no válido',
            data : {}
        });

    if(!rating)
        return res.status(404).send({
            error : true,
            message : 'Rating no encontrado',
            data : {}
        });

    return res.status(200).send({
        error : false,
        message : 'OK',
        data : {/*vrequests*/}
    });
}



module.exports = {
    getvRequest,
    getvRequests,
    createvRequest,
    deletevRequest,
    rateRequest,
    vRequestStatus
};
