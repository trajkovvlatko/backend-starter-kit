import {DataTypes, Model, Optional} from 'sequelize';
import sequelize from '../config/database';

interface PerformerAttributes {
  id: number;
  name: string;
  email: string;
  location: string;
  phone: string;
  details: string;
  rating: number;
  website: string;
  userId: number;
  type: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

type PerformerCreationAttributes = Optional<
  PerformerAttributes,
  'id' | 'type' | 'rating' | 'createdAt' | 'updatedAt'
>;

export default class Performer
  extends Model<PerformerAttributes, PerformerCreationAttributes>
  implements PerformerAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public location!: string;
  public phone!: string;
  public details!: string;
  public rating!: number;
  public website!: string;
  public userId!: number;
  public active!: boolean;

  public readonly createdAt: string;
  public readonly updatedAt: string;
  public readonly type: string = 'performer';

  static associate(): void {
    return;
  }
}

Performer.init(
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
    sequelize,
    schema: 'public',
    tableName: 'performers',
  },
);
