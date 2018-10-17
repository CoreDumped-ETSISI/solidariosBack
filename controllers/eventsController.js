'use strict';

const Event = require('../models/events');
const services = require('../services/inputValidators');

function getEvents(req, res) {
    Event.find({}, (err, events) => {
        if (err) {
            console.log(err);
            return res.status(500).send({
                error : true,
                message : 'Error en el servidor',
                data : {}
            });
        }
        if (!events) return res.status(404).send({
            error : true,
            message: 'Ningún evento encontrado',
            data : {}
        });

        return res.status(200).send({
            error : false,
            message : '',
            data : {events}
        });
    });
}

function getEvent(req, res) {
    let idEvent = req.params.idEvent;
    if(!services.validId(idEvent)) return res.status(400).send({
        error : true,
        message: 'Id inválido',
        data : {}
    });
    Event.find({_id: idEvent}, (err, event) => {
        if (err) {
            console.log(err);
            return res.status(500).send({
                error : true,
                message : 'Error en el servidor',
                data : {}
            });
        }
        if (!event) return res.status(404).send({
            error : true,
            message: 'Ningún evento encontrado',
            data : {}
        });
        return res.status(200).send({
            error : false,
            message : '',
            data : {event}
        });
    });
}

function createEvent(req, res) {

    let pig = req.body.pig;
    let name = req.body.name;
    let description = req.body.description;
    let date = req.body.date;
    let location = req.body.location;
    let capacity = req.body.capacity;
    let participants = req.body.participants;
    let photo = req.body.photo;

    //TODO: Check all inputs
    if(!services.validName(name)) return res.status(400).send({
        error : true,
        message: 'Nombre inválido',
        data : {}
    });
    if(!services.validInt(capacity)) return res.status(400).send({
        error : true,
        message: 'Capacidad inválida',
        data : {}
    });
    if(!services.validInt(participants)) return res.status(400).send({
        error : true,
        message: 'Participantes inválidos',
        data : {}
    });

    let event = new Event({
        pig: pig,
        name: name,
        description: description,
        date: date,
        location: location,
        capacity: capacity,
        participants: participants,
        photo: photo
    });

    event.save(function (err, EventSaved) {
        if (err) {
            console.log(err);
            return res.status(500).send({
                error : true,
                message : 'Error guardando el evento',
                data : {}
            });
        }
        return res.status(201).send({
            error : false,
            message : 'Evento creado',
            data : {}
        });
    });
}

function deleteEvent(req, res) {
    let idEvent = req.params.idEvent;

    if (!services.validId(idEvent)) return res.status(400).send({
        error : true,
        message: 'Id inválido',
        data : {}
    });

    Event.findOne({_id: idEvent}, (err, events) => {
        if (err) {
            console.log(err);
            return res.status(500).send({'message': 'Error while processing request'});
        }
        if (!events) return res.status(404).send({
            error : true,
            message: 'Evento no encontrado en la base de datos',
            data : {}
        });

        Event.remove(events).exec((err, eventDeleted) => {
            if (err) {
                console.log(err);
                return res.status(500).send({
                    error : true,
                    message : 'Error en el servidor',
                    data : {}
                });
            }
            if (!eventDeleted) return res.status(404).send({
                error : true,
                message: 'Evento no encontrado',
                data : {}
            });

            return res.status(200).send({
                error : false,
                message : 'Evento borrado',
                data : {}
            });
        });
    });
}

module.exports = {
    getEvent,
    getEvents,
    createEvent,
    deleteEvent
};
