'use strict'

const User = require ('../Models/User')

function getGuns(req, res) {
  Gun.find({}, (err, guns) => {
    if(err) return res.status(500).send({message: "Error while processing request"})
    if(!guns) return res.status(404).send({message: "No guns found"})
    return res.status(200).send(guns)
  })
}

function getGun(req, res) {
  let idGun = req.query.idGun
  if(!idGun) return res.sendStatus(400)

  Gun.find({idGun : idGun}, (err, gun) => {
    if(err) return res.status (500).send({message:"Error while processing request"})
    if(!gun) return res.status(404).send({message: "No gun found"});
    return res.status(200).send(gun)
  })
}

function createGun(req, res) {
  let
  let idGun = req.body.idGun
  let damage = req.body.damage

  if(!idGun) return res.sendStatus(400).send({message: `No was gun ID found.`})
  if(!damage) return res.sendStatus(400).send({message: `No was damage variable found.`})

  Gun.findOne({idGun: idGun}, (err, gunExists) => {
    if(err) return res.status(500).send({message: "Error while processing request"})
    if(gunExists) return res.status(409).send({message: "A gun with that 'idGun' already exists"})

    let gun = new Gun ()
    gun.idGun = idGun
    gun.damage = damage

    gun.save((err, gunSaved) => {
      if(err) return res.status(500).send({message: "Error while processing request"})
      if(!gunSaved) return res.status(500).send({message: "Error gun not saved"})
      return res.status(200).send({message: "Gun created"})
    })
  })
}

function updateGun(req, res) {
  let idGun = req.query.idGun
  let damage = req.body.damage

  if(!idGun) return res.status(404).send({message: "Error 'idGun' undefined"})

  Gun.update({idGun: idGun},{damage: damage}, (err, updatedGun) => {
    if(err) return res.status(500).send({message: "Error while processing request"})
    if(!updatedGun) return res.status(404).send({message: "Gun not found"})
    return res.status(200).send({message: "Gun updated"})
  })
}

function deleteGun(req, res) {
  let idGun = req.query.idGun

  if(!idGun) return res.status(404).send({message: "Error 'idGun' undefined"})

  Gun.findOne({idGun: idGun}, (err, gun) => {
    if(err) return res.status(500).send({message: "Error while processing request"})
    if(!gun) return res.status(404).send({message: "Gun not in database"})

    Gun.remove({idGun: idGun}).exec((err, gunDeleted) => {
      if(err) return res.status(500).send({message: "Error while processing request"})
      if(!gunDeleted) return res.status(404).send({message: "Gun not found"})

      return res.status(200).send({message: "Gun deleted"})
    })
  })
}

function deleteAllGuns (req, res) {
    Gun.remove({}, (err) => {
      if(err) return res.status(500).send({message: "Error while processing request"})
      return res.status(200).send({message: "All guns deleted"})
    })
}

module.exports = {
  getGuns,
  getGun,
  createGun,
  updateGun,
  deleteGun,
  deleteAllGuns
}
