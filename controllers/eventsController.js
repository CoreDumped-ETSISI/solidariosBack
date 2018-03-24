'use strict'

const Event = require ('../models/events')

function getEvents(req,res){
    Event.find({},(err, events) =>{
        if(err) return res.status(500).send({message :'Error while processing request'})
        if(!events) return res.status(404).send({message:'No events founds'})

        res.status(200).send({events})
     })
}

function getEvent(req,res){
    Event.find({idEvent: req.params.idEvent},(err,events)=>{
        if(err) return res.status(500).send({message:'Error while processing request'})
        if(!events) return res.status(404).send({message:'No events found'})
        res.status(200).send({events})
    })
}

function createEvent(req,res){

    let pig = req.body.pig  ;
    let name = req.body.name;
    let description = req.body.description;
    let date = req.body.date;
    let location = req.body.location;
    let capacity = req.body.capacity;
    let participants = req.body.participants;
    let photo = req.body.photo;

    let event = new Event({
        pig : pig,
        name : name,
        description : description,
        date: date,
        location : location,
        capacity : capacity,
        participants : participants,
        photo : photo
    })

    event.save(function(err,EventSaved){
        console.log(err);            
        if(err) return res.status(500).send({"message":'Error saving event...'})
        res.status(200).send({"message":'Yujuu'})
    })
}

function deleteEvent(req,res){
    let idEvent = req.params.idEvent

    if(idEvent == undefined)
        return res.status(404).send({message:'Error event undefined'})

    Event.findOne({_id: idEvent},(err,events)=>{
        if(err) return res.status(500).send({message:'Error while processing request'})
        if(!events) return res.status(404).send({message:'Event not in database'})


    Event.remove(events).exec((err,eventDeleted) => {
        if(err) return res.status(500).send({message:'Error while processing request: ${err}'})
        if(!eventDeleted) return res.status(404).send({message:''})

            res.status(200).send({message:'Event deleted'})
        })
    })
}

/*function deleteAllEvents (req, res) {

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
   */

  module.exports = {
      getEvent,
      getEvents,
      createEvent,
      deleteEvent
      //deleteAllEvents
  }
  