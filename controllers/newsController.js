-'use strict'

<<<<<<< HEAD
const News = require ('../controllers/newsController')
=======
const News = require ('../models/news')
>>>>>>> 6395aca9462e73413dc242dd90a476c55d128aee

function getAllNews(req, res) {
  News.find({}, (err, news) => {
    if(err) return res.status(500).send({message: "Error while processing request"})
    if(!news) return res.status(404).send({message: "No news found"})
    return res.status(200).send(news)
  })
}

function getNews(req, res) {
  let idNews = req.params.idNews
  if(!idNews) return res.sendStatus(400)

  News.find({_id : idNews}, (err, news) => {
    if(err) return res.status (500).send({message:"Error while processing request"})
    if(!news) return res.status(404).send({message: "No news found"});
    return res.status(200).send(news)
  })
}

function createNews(req, res) {
  let pig = req.body.pig
  let title = req.body.title
  let content = req.body.content
  let date = req.body.date
  let photo = req.body.photo


  if(!pig) return res.status(400).send({message: `No type variable was found.`})
  if(!title) return res.status(400).send({message: `No title variable was found.`})
  if(!content) return res.status(400).send({message: `No description variable was found.`})
  if(!date) return res.status(400).send({message: `No date variable was found.`})

    let news = new News ({
      pig : pig,
      title : title,
      content : content,
      date : date,
      photo : photo

    })
     
      news.save((err, newsSaved) => {
      if(err) return res.status(500).send({message: "Error while processing request"})
      if(!newsSaved) return res.status(500).send({message: "Error news not saved"})
      return res.status(200).send({message: "news created"})
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
  let idNews = req.params.idNews

  if(!idNews) return res.status(404).send({message: "Error 'idNews' undefined"})

  News.findOne({_id: idNews}, (err, news) => {
    if(err) return res.status(500).send({message: "Error while processing request"})
    if(!news) return res.status(404).send({message: "News not in database"})

    News.remove({_id: idNews}).exec((err, newsDeleted) => {
      if(err) return res.status(500).send({message: "Error while processing request"})
      if(!newsDeleted) return res.status(404).send({message: "News not found"})

      return res.status(200).send({message: "News deleted"})
    })
  })
}

/*function deleteAllNews (req, res) {
    News.remove({}, (err) => {
      if(err) return res.status(500).send({message: "Error while processing request"})
      return res.status(200).send({message: "All news deleted"})
    })
}*/

module.exports = {
  getNews,
  getAllNews,
  createNews,
  updateNews,
  deleteNews, 
  //deleteAllNews   As this function won't be used, access to it has been restricted.
}