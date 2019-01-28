'use strict';
module.exports = (sequelize, DataTypes) => {
  const Teacher = sequelize.define('Teacher', {
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email : {
      type : DataTypes.STRING,
      validate : {
        isEmail : {
          args : true,
          msg : 'email is not valid'
        },
        isUnique : function (value) {
          return Teacher.findOne({
            where : {
              email : value
            }
          })
          .then( data => {
            if (data) {
              if (this.id != data.id) {
                throw new Error('email already registered');
              }
            }
          })
          .catch( err =>{
            throw err;
          })
        }
      }
    },
    SubjectId: DataTypes.INTEGER
  }, {});
  Teacher.associate = function(models) {
    // associations can be defined heres
    Teacher.belongsTo(models.Subject, { foreignKey : "SubjectId"})
  };
  return Teacher;
};