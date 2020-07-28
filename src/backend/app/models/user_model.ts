import {DataTypes, Model, Optional} from 'sequelize';
import sequelize from '../config/database';
import bcrypt from 'bcrypt';
import IModelsList from '../interfaces/IModelsList';
import Performer from './performer_model';
const saltRounds = 10;

type PossibleUser = User | null;

interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UserCreationAttributes
  extends Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export default class User extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public active!: boolean;

  public readonly createdAt: string;
  public readonly updatedAt: string;

  public readonly performers?: Performer[];

  static async findByCredentials(email: string, password: string) {
    try {
      // Must return a plain object to passport
      const u: PossibleUser = await User.findOne({
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

  static async register(name: string, email: string, password: string) {
    const hash = await bcrypt.hash(password, saltRounds);
    const user = User.build({
      name,
      email,
      password: hash,
      active: true,
    });
    return await user.save();
  }

  static async find(id: number) {
    try {
      // Return a user object
      return await User.findByPk(id, {
        attributes: ['id', 'name', 'email'],
      });
    } catch (e) {
      return {error: e};
    }
  }

  static async findByEmail(email: string) {
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

  static associate(models: IModelsList) {
    User.hasMany(models.Performer, {foreignKey: 'userId'});
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
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
    schema: 'public',
    tableName: 'users',
  },
);
