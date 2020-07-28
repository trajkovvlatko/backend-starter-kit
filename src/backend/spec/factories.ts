import User from '../app/models/user_model';
import Performer from '../app/models/performer_model';
import bcrypt from 'bcrypt';
const saltRounds = 10;

interface IOptions {
  [key: string]: string | boolean | number;
}

async function create<T>(
  table: 'performers',
  options: IOptions,
): Promise<Performer>;
async function create(table: 'users', options: IOptions): Promise<User>;

async function create(table: string, options: IOptions = {}): Promise<unknown> {
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
    name: options.name ? options.name.toString() : rand(),
    email: options.email
      ? options.email.toString()
      : `${rand()}@${rand()}.${rand()}`,
    password: hash,
    active:
      options.active === true || options.active === false
        ? options.active
        : true,
    createdAt: options.createdAt
      ? options.createdAt.toString()
      : new Date().toString(),
    updatedAt: options.updatedAt
      ? options.updatedAt.toString()
      : new Date().toString(),
  });
  await user.save();
  user.password = password ? password.toString() : '';
  return user;
}

async function addPerformer(options: IOptions) {
  if (!options.userId) {
    throw 'Invalid user id for performer.';
  }
  const performer = Performer.build({
    name: options.name ? options.name.toString() : rand(),
    email: options.email ? options.email.toString() : `${rand()}@${rand()}.com`,
    userId: typeof options.userId === 'number' ? options.userId : 0,
    location: options.location ? options.location.toString() : rand(),
    phone: options.phone ? options.phone.toString() : rand(),
    details: options.details ? options.details.toString() : rand(),
    website: options.website ? options.website.toString() : rand(),
    rating: typeof options.rating === 'number' ? options.rating : 2,
    active:
      options.active === true || options.active === false
        ? options.active
        : true,
    createdAt: options.createdAt
      ? options.createdAt.toString()
      : new Date().toString(),
    updatedAt: options.updatedAt
      ? options.updatedAt.toString()
      : new Date().toString(),
  });
  await performer.save();
  return performer;
}

function rand() {
  return Math.random().toString(36).substring(7);
}

export default create;
