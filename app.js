const express = require('express');
const Student = require('./routes/students.js');
const Subject = require('./routes/subjects.js');
const Teacher = require('./routes/teachers.js');
const app = express();

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: false}))

app.get('/', function (req, res) {
  res.render('home.ejs')
})

app.use('/students', Student);
app.use('/subjects', Subject);
app.use('/teachers', Teacher);


app.listen(3000, function() {
  console.log('server is listening to port 3000');
})
