const express = require('express')
const Article = require('../models/article')
const router = express.Router()
const { ensureAuthenticated } = require('../config/auth')

/* router.get('/new', ensureAuthenticated ,(req,res)=>{
    res.render('articles/new',{article: new Article()})
}) */

/* router.get('/edit/:id',ensureAuthenticated, async (req,res)=>{
    const article = await Article.findById(req.params.id)
    res.render('articles/edit',{article:article})
}) */

router.get('/:slug',async(req,res)=>{
    const article = await Article.findOne({ slug:req.params.slug })
    res.render('articles/show',{article:article})
})

/* router.post('/',ensureAuthenticated,async (req,res,next)=>{
    req.article = new Article()
    next()
  },saveArticleAndRedirect('new')) */

/* router.put('/:id',ensureAuthenticated,async (req,res,next)=>{
    req.article = await Article.findById(req.params.id)
    next()
 },saveArticleAndRedirect('edit'))*/

router.delete('/:id',ensureAuthenticated,async (req,res)=>{
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/dashboard')
})

function saveArticleAndRedirect(path){
    return async (req,res)=>{
        let article = req.article
            article.title= req.body.title
            article.name= req.body.name
            article.description= req.body.description
            article.markdown= req.body.markdown

        try{
            article = await article.save()
            res.redirect(`/articles/${article.slug}`)
        }
        catch(e){
            res.render(`articles/${path}`,{article:article})
        }
    }
}

module.exports = router