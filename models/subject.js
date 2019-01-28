'use strict';
module.exports = (sequelize, DataTypes) => {
  const Subject = sequelize.define('Subject', {
    name: DataTypes.STRING
  }, {});
  Subject.associate = function(models) {
    // associations can be defined here
    Subject.hasMany(models.Teacher, {
      foreignKey: 'SubjectId'
    });
    Subject.belongsToMany(models.Student, { 
      through : models.StudentSubject,
      foreignKey : 'SubjectId' 
    })
  };
  return Subject;
};