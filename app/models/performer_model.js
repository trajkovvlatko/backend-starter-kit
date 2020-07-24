const {Op, DataTypes, Model, col} = require('sequelize');
const db = require('../../config/database');

const BookingJoin = {
  [Op.or]: [
    {
      requesterId: {[Op.eq]: col('Performer.id')},
      requesterType: 'Performer',
    },
    {
      requestedId: {[Op.eq]: col('Performer.id')},
      requestedType: 'Performer',
    },
  ],
};

class Performer extends Model {
  static associate() {}

  static async allActive(sorting = 'latest', limit = 5, offset = 0) {
    switch (sorting) {
      case 'latest':
        sorting = ['id', 'DESC'];
        break;
      case 'top':
        sorting = ['rating', 'DESC'];
        break;
    }
    try {
      return await Performer.findAll({
        attributes: ['id', 'name', 'rating', 'type'],
        where: {active: true},
        order: [sorting],
        limit: limit || 10,
        offset: offset || 0,
      });
    } catch (e) {
      return {error: e};
    }
  }

  static async basicFind(id, userId) {
    const wheres = {id: id};
    if (userId) {
      wheres.userId = userId;
    }
    try {
      return await Performer.findOne({
        attributes: [
          'id',
          'name',
          'email',
          'location',
          'phone',
          'details',
          'rating',
          'website',
          'active',
        ],
        where: wheres,
      });
    } catch (e) {
      return {error: e};
    }
  }
}

Performer.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    details: {
      type: DataTypes.TEXT,
    },
    website: {
      type: DataTypes.STRING,
    },
    rating: {
      type: DataTypes.INTEGER,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.VIRTUAL,
      get() {
        return 'performer';
      },
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize: db,
    tableName: 'performers',
  },
);

module.exports = Performer;
