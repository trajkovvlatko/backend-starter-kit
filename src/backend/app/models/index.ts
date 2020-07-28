import User from './user_model';
import Performer from './performer_model';

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
