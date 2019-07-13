'use strict';

const eType = require('../models/eType');

function createType(req,res){
    let value = req.body.value;

    let eType = new eType({
        value: value
    });

    eType.save((err, eTypeSaved) => {
        if(err){
            console.log(err);
            return res.status(500).send({
                error: true,
                message: 'Error saving eType',
                data: {}
            });
        }
        return res.status(201).send({
            error: false,
            message: 'eType created',
            data: {}
        });
    });
}

function getEtypes(req, res) {
    eType.find({}, (err, eTypes)=>{
        if(err) {
            console.log(err);
            return res.status(500).send({
                error: true,
                message: 'Server error',
                data: {}
            });
        }
        if(!eTypes) return res.status(404).send({
            error: true,
            message: 'No eType find',
            data: {}
        });

        return res.status(200).send({
            error: false,
            message: '',
            data: {eTypes}
        });
    });
}

module.exports = {
    createType,
    getEtypes
};