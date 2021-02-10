const express = require('express')
const router = express.Router()
const { ensureAuthenticated } = require('../config/auth')
const Article = require('../models/article')
const User = require('../models/User')

//Welcome Page
router.get('/',(req,res)=> res.render('welcome'))

//DashBoard
  router.get('/dashboard',ensureAuthenticated,async(req,res) =>{
    const articles =await Article.find().sort({
        createdAt:'desc'
    })
    res.render('dashboard',{
      articles:articles,
      name:req.user.name,
      userId:req.user.userId,
      email:req.user.email
    })
  })

  router.get('/articles/new',ensureAuthenticated,async(req,res) =>{
    res.render('articles/new',{
      article: new Article(),
      name:req.user.name,
      userId:req.user.userId,
      email:req.user.email
    })
  })
router.post('/articles/',ensureAuthenticated,async (req,res,next)=>{
  req.article = new Article()
  next()
},saveArticleAndRedirect('new'))

router.get('/articles/edit/:id',ensureAuthenticated, async (req,res)=>{
  const article = await Article.findById(req.params.id)
  const hello = await Article.findById(req.params.id)
  res.render('articles/edit',{
    article:article,
    hello,
    name:req.user.name,
    userId:req.user.userId,
  })
})

router.put('/articles/:id',ensureAuthenticated,async (req,res,next)=>{
  req.article = await Article.findById(req.params.id)
  next()
},saveArticleAndRedirect('edit'))

function saveArticleAndRedirect(path){
  return async (req,res)=>{
      let article = req.article
          // article.id= req.params.id 
          article.title= req.body.title
          article.description= req.body.description
          article.markdown= req.body.markdown
          article.name= req.user.name
          article.userId= req.user.userId

      try{
          article = await article.save()
          res.redirect(`/articles/${article.slug}`)
      }
      catch(e){
          res.render(`articles/${path}`,{article:article})
      }
  }
}





router.get('/profile',ensureAuthenticated,async(req,res) =>{
  const articles =await Article.find().sort({
      createdAt:'desc'
  })
  res.render('profile',{
    articles:articles,
    name:req.user.name,
    userId:req.user.userId,
    email:req.user.email
  })
})


const Value = require('../models/Value')

router.get('/search',ensureAuthenticated,async(req,res) =>{
  const users =await User.find().sort({
      createdAt:'desc'
  })
  res.render('search',{
    users:users,
    userId:null
  })
})

router.post('/search',ensureAuthenticated,async(req,res) =>{
  const { userId } = req.body 
  const newUserId = new Value({
    userId
  })
  const users =await User.find().sort({
    createdAt:'desc'
  })

  newUserId.save()
  .then(userId => {
    res.render('search',{
      users:users,
      userId:req.body.userId
    })
  })
  .catch(err => console.log(err))
})



router.get('/find/:id',async(req,res) => {
  const articles =await Article.find().sort({
    createdAt:'desc'
  })
  const users =await User.find().sort({
    createdAt:'desc'
  })
  hello = await User.findById(req.params.id)
  res.render('find',{
    articles:articles,
    users:users,
    hello,
  })
})




module.exports = router;