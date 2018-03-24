'use strict'

const News = require ('../controllers/newsController')

function getAllNews(req, res) {
  News.find({}, (err, news) => {
    if(err) return res.status(500).send({message: "Error while processing request"})
    if(!news) return res.status(404).send({message: "No news found"})
    return res.status(200).send(news)
  })
}

function getNews(req, res) {
  let idNews = req.query.idNews
  if(!idNews) return res.sendStatus(400)

  News.find({idNews : idNews}, (err, news) => {
    if(err) return res.status (500).send({message:"Error while processing request"})
    if(!news) return res.status(404).send({message: "No news found"});
    return res.status(200).send(news)
  })
}

function createNews(req, res) {
  let idNews = req.body.idNews
  let type = req.body.type
  let title = req.body.title
  let description = req.body.description
  let date = req.body.date
  let photo = req.body.photo


  if(!idNews) return res.sendStatus(400).send({message: `No News ID was found.`})
  if(!type) return res.sendStatus(400).send({message: `No type variable was found.`})
  if(!title) return res.sendStatus(400).send({message: `No title variable was found.`})
  if(!description) return res.sendStatus(400).send({message: `No description variable was found.`})
  if(!date) return res.sendStatus(400).send({message: `No date variable was found.`})
  if(!photo) return res.sendStatus(400).send({message: `No photo variable was found.`})

  News.findOne({idNews: idNews}, (err, NewsExists) => {
    if(err) return res.status(500).send({message: "Error while processing request"})
    if(NewsExists) return res.status(409).send({message: "News with that 'idNews' already exists"})

    let news = new news ()
    news.idNews = idnews
    news.damage = damage

    news.save((err, NewsSaved) => {
      if(err) return res.status(500).send({message: "Error while processing request"})
      if(!newsSaved) return res.status(500).send({message: "Error news not saved"})
      return res.status(200).send({message: "news created"})
    })
  })
}

function updateNews(req, res) {
  let idNews = req.query.idNews
  let type = req.body.type
  let title = req.body.title
  let description = req.body.description
  let date = req.body.date
  let photo = req.body.photo

  if(!idNews) return res.status(404).send({message: "Error 'idNews' undefined"})

  News.update({idNews: idNews},{type: type},{title: title},{description: description}, {date: date}, {photo: photo}, (err, updatedGun) => {
    if(err) return res.status(500).send({message: "Error while processing request"})
    if(!updatedNews) return res.status(404).send({message: "News not found"})
    return res.status(200).send({message: "News updated"})
  })
}

function deleteNews(req, res) {
  let idNews = req.query.idNews

  if(!idNews) return res.status(404).send({message: "Error 'idNews' undefined"})

  News.findOne({idNews: idNews}, (err, news) => {
    if(err) return res.status(500).send({message: "Error while processing request"})
    if(!news) return res.status(404).send({message: "News not in database"})

    News.remove({idNews: idNews}).exec((err, newsDeleted) => {
      if(err) return res.status(500).send({message: "Error while processing request"})
      if(!newsDeleted) return res.status(404).send({message: "News not found"})

      return res.status(200).send({message: "News deleted"})
    })
  })
}

function deleteAllNews (req, res) {
    News.remove({}, (err) => {
      if(err) return res.status(500).send({message: "Error while processing request"})
      return res.status(200).send({message: "All news deleted"})
    })
}

module.exports = {
  getNews,
  getNew,
  createNews,
  updateNews,
  deleteNews,
  deleteAllNews
}
