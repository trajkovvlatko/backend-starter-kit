import User from './User';
import Performer from './Performer';

function initModels() {
  const models = {
    User: User,
    Performer: Performer,
  };
  Object.values(models).forEach((model) => {
    if (model.associate) {
      model.associate(models);
    }
  });
  return models;
}

export default initModels();
