import User from '../app/models/user_model';
import Performer from '../app/models/performer_model';
import bcrypt from 'bcrypt';
const saltRounds = 10;

interface IOptions {
  [key: string]: any;
}

async function create<T>(
  table: 'performers',
  options: IOptions,
): Promise<Performer>;
async function create(table: 'users', options: IOptions): Promise<User>;

async function create(table: string, options: IOptions = {}) {
  switch (table) {
    case 'performers':
      return await addPerformer(options);
    case 'users':
      return await addUser(options);
    default:
      throw `No factory for table '${table}'`;
  }
}

async function addUser(options: IOptions) {
  const password = options.password || rand();
  const hash = await bcrypt.hash(password, saltRounds);
  const user = User.build({
    name: options.name || rand(),
    email: options.email || `${rand()}@${rand()}.${rand()}`,
    password: hash,
    active:
      typeof options.active !== 'undefined' && options.active !== null
        ? options.active
        : true,
    createdAt: options.createdAt || new Date(),
    updatedAt: options.updatedAt || new Date(),
  });
  await user.save();
  user.password = password;
  return user;
}

async function addPerformer(options: IOptions) {
  const performer = Performer.build({
    name: options.name || rand(),
    email: options.email || `${rand()}@${rand()}.com`,
    userId: options.userId,
    location: options.location || rand(),
    phone: options.phone || rand(),
    details: options.details || rand(),
    website: options.website || rand(),
    rating: options.rating || 2,
    active:
      typeof options.active !== 'undefined' && options.active !== null
        ? options.active
        : true,
    createdAt: options.createdAt || new Date(),
    updatedAt: options.updatedAt || new Date(),
  });
  await performer.save();
  return performer;
}

function rand() {
  return Math.random().toString(36).substring(7);
}

export default create;
