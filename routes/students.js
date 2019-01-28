const router = require("express").Router();
const Model = require("../models");

router.get('/', function (req, res) {
	Model.Student.findAll({ 
		include : [Model.Subject],
		order : [['id', 'ASC']]
	})
	.then(item => {
		res.render('students.ejs', {
			title: 'Student List',
			data: item,
			message: req.query.success
		})
	})
	.catch(err => {
		res.render('students.ejs', {
			title: 'Student List',
			data: err
		})
	})
})

router.get('/add', function (req, res) {
	res.render('addstudent.ejs',{
		err : req.query.error
	})
})

router.post('/add', function (req, res) {
	Model.Student.create(req.body)
	.then(data => {
		res.redirect(`/students?success=${req.body.first_name} ${req.body.last_name} created`);
	})
	.catch(err => {
		res.redirect(`/students/add?error=${err}`);
	})
})

router.get('/edit/:id', function (req, res) {
	Model.Student.findOne({
		where: {
			id: req.params.id
		}
	})
	.then(item => {
		console.log(item);
		if (item != null) {
			res.render('editstudent.ejs', {
				title: 'Edit Student data',
				data: item.dataValues
			})

		}
	})
	.catch(err => {
		res.render('editstudent.ejs', {
			title: 'Student id',
			data: 'error'
		})
	})
})

router.post('/edit/:id', function (req, res) {
	let obj = req.body;
	obj['id'] = req.params.id;
	Model.Student.update(
		obj, {
			where: {
				id: req.params.id
			}
		}
	)
	.then((data) => {
		console.log('success');
		res.redirect('/students')
	})
	.catch(err => {
		res.send(err);
	})
})

router.get('/delete/:id', function(req, res) {
	Model.Student.destroy({
		where: {
			id: req.params.id
		}
	})
	.then(() => {
		res.redirect('/students')
	})
	.catch(err => {
		console.log(err);
	})
})

router.get('/:id/add-subject', function(req,res) {
	let dataStudent = null;
	Model.Student.findByPk(req.params.id)
	.then(dataFind => {
		dataStudent = dataFind;
		return Model.Subject.findAll()
	})
	.then(dataSubject => {
		res.render('addstudentsubject.ejs', {
			title : 'Add Subject to Student',
			dataStudent : dataStudent,
			dataSubject : dataSubject
		})
	})
	.catch(err => {
		res.send(err)
	})
})

router.post('/:id/add-subject', function(req, res) {
	let obj = {
		StudentId : req.params.id,
		SubjectId : req.body.SubjectId
	}
	Model.StudentSubject.create(obj)
	.then(data => {
		res.redirect('/students');
	})
	.catch(err => {
		res.send(err);
	})
})
module.exports = router;