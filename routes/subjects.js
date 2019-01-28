const router = require('express').Router();
const Model = require("../models");

router.get('/', function (req, res) {
	Model.Subject.findAll()
	.then(subjects => {
		let newSubjects = subjects.map(item => {
			return new Promise ( (resolve, reject) => {
				item.getTeachers()
				.then( data => {
					item.dataValues['Teachers'] = data;
					resolve(item);
				})
				.catch( err => {
					reject(err);
				})
			})
		})
		return Promise.all(newSubjects)
		.then( dataAll => {
			res.render('subjects.ejs', {
				title : 'Subject List',
				data : dataAll
			})
		})
		.catch( err => {
			res.send(err)
		})
	})
	.catch(err => {
		res.render('subjects.ejs', {
			title: 'Subject List',
			data: err
		})
	})
})

router.get('/add', function (req, res) {
	res.render('addsubject.ejs')
})

router.post('/add', function (req, res) {
	//add subject ke db
	console.log(req.body);
	Model.Subject.create(req.body)
	.then(data => {
		console.log(req.body, 'saved');
		res.redirect('/subjects');
	})
	.catch(err => {
		console.log(err);
	})
})

router.get('/edit/:id', function (req, res) {
	// res.render('editsubject.ejs')
	let value = req.params.id
	console.log(req.params.id);
	Model.Subject.findOne({
		where: {
			id: req.params.id
		}
	})

	.then(item => {
		console.log(item);
		if (item != null) {
			res.render('editsubject.ejs', {
				title: 'Edit Subject Data',
				data: item.dataValues
			})

		}
	})
	.catch(err => {
		res.render('editsubject.ejs', {
			title: 'Subject id',
			data: 'error'
		})
	})
})

router.post('/edit/:id', function (req, res) {
	Model.Subject.update(
		req.body, {
			where: {
				id: req.params.id
			}
		}
	)
	.then((data) => {
		console.log('success');
		res.redirect('/subjects')
	})
	.catch(err => {
		res.send(err);
		console.log(err);
	})
})

router.get('/delete/:id', function (req, res) {
	Model.Subject.destroy({
		where: {
			id: req.params.id
		}
	})
	.then(() => {
		res.redirect('/subjects')
	})
	.catch(err => {
		res.send(err);
		console.log(err);
	})
})

router.get('/:id/enrolled-students', function (req,res) {
	Model.Subject.findOne({
		where : {
			id : req.params.id
		},
		include : [{
			model : Model.Student
		}]
	})
	.then ( subjectData => {
		res.render('enrolledStudents.ejs', {
			title: subjectData.name,
			data: subjectData
		})
		// res.send(subjectData)
	})
	.catch( err => {
		res.send('err')
	})
})

router.get('/:id/give-score', function (req, res) {
	Model.StudentSubject.findByPk(req.params.id)
		.then(dataScore => {
			res.render('giveScore.ejs', {
				data: dataScore
			})
			// res.send(dataScore)
		})
		.catch(err => {
			res.send(err)
		})
})

router.post('/:id/give-score', function (req, res) {
	let score = req.body.score;
	var obj = {
		score: score
	}
	Model.StudentSubject.update(obj, {
			where: {
				id: req.params.id
			}
		})
		.then(data => {
			res.redirect(`/subjects/${req.params.id}/enrolled-students`)
		})
		.catch(err => {
			res.send(err)
		})
})

module.exports = router;