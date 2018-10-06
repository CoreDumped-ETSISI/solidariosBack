'use strict';

const vRequest = require('../models/vRequest');

function getvRequests(req, res) {
    vRequest.find({}, (err, vrequests) => {
        if (err) {
            console.log(err);
            return res.status(500).send({"message": 'Error while processing request'});
        }
        if (!vrequests) return res.status(404).send({message: 'No vrequests founds'});

        res.status(200).send({vrequests})
    })
}

function getvRequest(req, res) {
    const idvRequest = req.params.idvRequest;
    vRequest.find({_id: idvRequest}, (err, vrequests) => {
        if (err) {
            console.log(err);
            return res.status(500).send({"message": 'Error while processing request'});
        }
        if (!vrequests) return res.status(404).send({message: 'No vrequests found'});
        res.status(200).send({vrequests})
    })
}

function createvRequest(req, res) {
    let pig = req.body.pig;
    let title = req.body.title;
    let description = req.body.description;
    let creationDate = req.body.creationDate;
    let location = req.body.location;
    let reqDate = req.body.reqDate;
    let reqTime = req.body.reqTime;

    //TODO: Filter the inputs

    let vRequests = new vRequest({
        pig: pig,
        title: title,
        description: description,
        creationDate: creationDate,
        location: location,
        reqDate: reqDate,
        reqTime: reqTime

    });

    vRequests.save(function (err, vRequestSaved) {
        if (err) {
            console.log(err);
            return res.status(500).send({"message": 'Error while processing request'});
        }
        res.status(200).send({"message": 'vRequest created'})
    })
}

function deletevRequest(req, res) {
    let idvRequest = req.params.idvRequest;

    if (idvRequest === undefined)
        return res.status(404).send({message: 'Error vRequest undefined'});

    vRequest.findOne({_id: idvRequest}, (err, events) => {
        if (err) {
            console.log(err);
            return res.status(500).send({"message": 'Error while processing request'});
        }
        if (!vRequest) return res.status(404).send({message: 'vRequest not in database'});

        vRequest.remove(vRequest).exec((err, vRquestDeleted) => {
            if (err) {
                console.log(err);
                return res.status(500).send({"message": 'Error while processing request'});
            }
            if (!vRquestDeleted) return res.status(404).send({message: ''});

            res.status(200).send({message: 'vRequest deleted'})
        })
    })
}
function vRequestStatus(req,res){
    let state = req.body.state;
    if(!input.vRequestSatus(state)) return res.status(400).send({message:'Not a status'});
    vRequest.update({_id: req.body.id},{state: state },{multi : false},function(err){
        if(err){return res.status(400).send({message:'Could not update state'}) ;}
        console.log("Updated");
    })

    
}

function rateRequest(req, res){
    let rating = req.body.rating
    if(!input.validRating(rating)) return res.status(400).send({message:'Not a valid rating'});

    if(!rating) return res.status(400).send({message:'No rating was found'});


}



module.exports = {
    getvRequest,
    getvRequests,
    createvRequest,
    deletevRequest,
    rateRequest,
    vRequestSatus
};
  