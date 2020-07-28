import {ModelStatic, Model} from 'sequelize/types';

export default interface IModelsList {
  [Key: string]: ModelStatic<Model>;
}
