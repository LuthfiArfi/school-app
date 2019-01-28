'use strict';
module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define('Student', {
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          args: true,
          msg: 'email is not valid'
        },
        isUnique: function (value) {
          return Student.findOne({
              where: {
                email: value
              }
            })
          .then(data => {
            if (data) {
              if (this.id != data.id) {
                throw new Error('email already registered');
              }
            }
          })
          .catch(err => {
            throw err;
          })
        }
        
      }
    }
  }, {});
  Student.associate = function(models) {
    // associations can be defined here
    Student.belongsToMany(models.Subject, {
      through : models.StudentSubject,
      foreignKey : 'StudentId'
    })
  };
  return Student;
};