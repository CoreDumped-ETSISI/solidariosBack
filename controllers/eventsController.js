'use strict'

const Event = require ('../models/Events')

function getEvents(req,res){
    Event.find({},(err, events) =>{
        if(err) return res.status(500).send({message :'Error while processing request'})
        if(!events) return res.status(404).send({message:'No events founds'})

        res.status(200).send({events})
     })
}

function getEvent(req,res){
    Event.find({idEvent: req.query.idEvent},(err,events)=>{
        if(err) return res.status(500).send({message:'Error while processing request'})
        if(!events) return res.status(404).send({message:'No events found'})
        res.status(200).send({events})
    })
}

function createEvent(req,res){

    let type = req.body.type;
    let name = req.body.name;
    let description = req.body.description;
    let date = req.body.date;
    let location = req.body.location;
    let capacity = req.body.capacity;
    let participants = req.body.participants;
    let photo = req.body.photo;

    let event = new Event({
        type : type,
        name : name,
        description : description,
        date: date,
        location : location,
        capacity : capacity,
        participants : participants,
        photo : photo
    })
  

    createdEvent.save(function(err,EventSaved){
        if(err)return res.status(500).send({message:'Error saving event...'})

    })
}

function deleteEvent(req,res){
    let idEvent = req.body.idEvent

    if(idEvent == undefined)
        return res.status(404).send({message:'Error event undefined'})

    Event.findOne({idEvent: idEvent},(err,events)=>{
        if(err) return res.status(500).send({message:'Error while processing request'})
        if(!events) return res.status(404).send({message:'Event not in database'})


    Event.remove(events).exec((err,eventDeleted) => {
        if(err) return res.status(500).send({message:'Error while processing request: ${err}'})
        if(!eventDeleted) return res.status(404).send({message:''})

            res.status(200).send({message:'Event deleted'})
        })
    })
}

function deleteAllEvents (req, res) {

    Event.find({}, (err, events) => {
      if(err) return res.status (500).send({message:`Error while processing request`})
      if(!events) return res.status(404).send({message: 'Event not in database'})
  
      Event.remove(events).exec((err, eventsDeleted) => {
        if(err) return res.status(500).send({message: `Error while processing request: ${err}`})
        if(!eventsDeleted) return res.status(404).send({message: 'Not events in database'})
  
        res.status(200).send({message: `All events deleted`})
      })
    })
  }

  module.exports = {
      getEvent,
      getEvents,
      createEvent,
      deleteEvent,
      deleteAllEvents
  }
  