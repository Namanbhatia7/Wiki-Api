//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

const app =express();

app.set('view engine', ejs);
app.use(bodyParser.urlencoded({
    extended:true
}))

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true})

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")
.get(function(req,res){
    Article.find(function(err,foundArticles){
        if(!err){
            // console.log(foundArticles);
            res.send(foundArticles);
        }else{
            console.log(!err)
        }
    });
})
.post(function(req,res){
    const newArticles = new Article({
        title: req.body.title,
        content: req.body.content
    });

    newArticles.save(function(err){
        if(!err){
            res.send("Succesfully added new entry")
        }else{
            res.send(err)
        }
    });
})
.delete(function(req,res){
    Article.deleteMany(function(err){
        if(!err){
            res.send("Successfully  Deleted All articles")
        }else{
            res.send(err)
        }
    })
});

/////////////////////////////// Request For a Particular Article ///////////////////////////////////////////

app.route("/articles/:articleTitle")
.get(function(req,res){
    Article.findOne({title: req.params.articleTitle}, function(err,foundArticle){
        if(foundArticle){
            res.send(foundArticle)
        }else{
            res.send("No such Article Found");
        }
    })
})

.put(function(req,res){
    Article.replaceOne(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        function(err){
            if(!err){
                res.send("Article Updated Successfully")
            }else{
                res.send(err)
            }
        }
    );
});


app.listen(3000,() =>{
    console.log("Listening on Port 3000")
});