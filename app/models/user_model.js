const {DataTypes, Model, Op} = require('sequelize');
const sequelize = require('../../config/database');
const bcrypt = require('bcrypt');
const saltRounds = 10;

class User extends Model {
  static async findByCredentials(email, password) {
    try {
      // Must return a plain object to passport
      const u = await User.findOne({
        attributes: ['id', 'name', 'email', 'password'],
        where: {
          email: email,
        },
      });

      if (!u) return {error: 'User not found.'};

      const match = await bcrypt.compare(password, u.password);
      if (!match) return {error: "Passwords doesn't match."};

      return u;
    } catch (e) {
      return {error: e};
    }
  }

  static async register(name, email, password) {
    const hash = await bcrypt.hash(password, saltRounds);
    const user = User.build({
      name: name,
      email: email,
      password: hash,
      active: true,
    });
    return await user.save();
  }

  static async find(id) {
    try {
      // Return a user object
      return await User.findByPk(id, {
        attributes: ['id', 'name', 'email'],
      });
    } catch (e) {
      return {error: e};
    }
  }

  static async findByEmail(email) {
    try {
      // Return a user object
      return await User.findOne({
        attributes: ['id', 'name', 'email'],
        where: {
          email: email,
        },
      });
    } catch (e) {
      return {error: e};
    }
  }

  static associate(models) {
    User.hasMany(models.Performer, {foreignKey: 'userId'});
  }
}
User.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    tableName: 'users',
  },
);

module.exports = User;
