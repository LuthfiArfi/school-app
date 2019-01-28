const router = require("express").Router();
const Model = require("../models");

router.get('/', function (req, res) {
  Model.Teacher.findAll({
    include : [Model.Subject],
    order : [['id', 'ASC']]
  })
    .then(teachers => {
      console.log(teachers[0].Subjsect)
      res.render('teachers.ejs', {
        title: 'Teacher List',
        data: teachers,
        message : req.query.success
      })
    // res.send(teachers)
    })
    .catch(err => {
      res.send(err)
    })
})

router.get('/add', function (req, res) {
  res.render('addteacher.ejs', {
    err : req.query.error
  })
})

router.post('/add', function (req, res) {
  //add teacher ke db
  Model.Teacher.create(req.body)
    .then(data => {
      res.redirect(`/teachers?success=${req.body.first_name} ${req.body.last_name} created`);
    })
    .catch(err => {
    	res.redirect(`/teachers/add?error=${err}`);
    })
})

router.get('/edit/:id', function (req, res) {
  // res.render('editteacher.ejs')
  Model.Teacher.findOne({
      where: {
        id: req.params.id
      }
    })
    .then(item => {
      if (item != null) {
        res.render('editteacher.ejs', {
          title: 'Edit Teacher data',
          data: item.dataValues
        })

      }
    })
    .catch(err => {
      res.render('editteacher.ejs', {
        title: 'Teacher id',
        data: 'error'
      })
    })
})

router.post('/edit/:id', function (req, res) {
  let obj = req.body;
  obj['id'] = req.params.id;
  Model.Teacher.update(
      obj, {
        where: {
          id: req.params.id
        }
      }
    )
    .then((data) => {
      res.redirect('/teachers')
    })
    .catch(err => {
      res.send(err);
    })
})

router.get('/delete/:id', function (req, res) {
  Model.Teacher.destroy({
      where: {
        id: req.params.id
      }
    })
    .then(() => {
      res.redirect('/teachers')
    })
    .catch(err => {
      res.send(err);
    })
})

module.exports = router;