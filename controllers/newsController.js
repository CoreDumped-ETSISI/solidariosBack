'use strict';

const News = require('../models/news');
const service = require("../services/inputValidators");

function getAllNews(req, res) {
    News.find({}, (err, news) => {
        if (err) {
            console.log(err);
            return res.status(500).send({"message": 'Error while processing request'});
        }
        if (!news) return res.status(404).send({message: "No news found"});
        return res.status(200).send(news);
    })
}

function getNews(req, res) {
    let idNews = req.params.idNews;
    if (!service.validId(idNews)) return res.status(400).send({message: "Invalid Id"});

    News.find({_id: idNews}, (err, news) => {
        if (err) {
            console.log(err);
            return res.status(500).send({"message": 'Error while processing request'});
        }
        if (!news) return res.status(404).send({message: "No news found"});
        return res.status(200).send(news);
    })
}

function createNews(req, res) {
    let pig = req.body.pig;
    let title = req.body.title;
    let content = req.body.content;
    let date = req.body.date;
    let photo = req.body.photo;

    //TODO: Validate all the inputs
    if (!pig) return res.status(400).send({message: `No type variable was found.`});
    if (!title) return res.status(400).send({message: `No title variable was found.`});
    if (!content) return res.status(400).send({message: `No description variable was found.`});
    if (!date) return res.status(400).send({message: `No date variable was found.`});

    let news = new News({
        pig: pig,
        title: title,
        content: content,
        date: date,
        photo: photo

    });

    news.save((err, newsSaved) => {
        if (err) {
            console.log(err);
            return res.status(500).send({"message": 'Error while processing request'});
        }
        if (!newsSaved) return res.status(500).send({message: "Error news not saved"});
        return res.status(201).send({message: "News created"})
    })
}

function updateNews(req, res) {
    let idNews = req.query.idNews;
    let type = req.body.type;
    let title = req.body.title;
    let description = req.body.description;
    let date = req.body.date;
    let photo = req.body.photo;

    if (!service.validId(idNews)) return res.status(400).send({message: "Invalid Id"});

    News.update({idNews: idNews}, {type: type}, {title: title}, {description: description}, {date: date}, {photo: photo}, (err, updatedGun) => {
        if (err) {
            console.log(err);
            return res.status(500).send({"message": 'Error while processing request'});
        }
        if (!updatedNews) return res.status(404).send({message: "News not found"});
        return res.status(200).send({message: "News updated"});
    })
}

function deleteNews(req, res) {
    let idNews = req.params.idNews;

    if (!service.validId(idNews)) return res.status(400).send({message: "Invalid Id"});

    News.findOne({_id: idNews}, (err, news) => {
        if (err) {
            console.log(err);
            return res.status(500).send({"message": 'Error while processing request'});
        }
        if (!news) return res.status(404).send({message: "News not in database"});

        News.remove({_id: idNews}).exec((err, newsDeleted) => {
            if (err) {
                console.log(err);
                return res.status(500).send({"message": 'Error while processing request'});
            }
            if (!newsDeleted) return res.status(404).send({message: "News not found"});

            return res.status(200).send({message: "News deleted"});
        })
    })
}

module.exports = {
    getNews,
    getAllNews,
    createNews,
    updateNews,
    deleteNews
};
