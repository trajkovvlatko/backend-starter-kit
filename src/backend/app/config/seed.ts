import db from './database';
import models from '../models/index';
import bcrypt from 'bcrypt';
import IUser from '../interfaces/IUser';

const saltRounds = 10;
const locations = ['Sweden', 'Denmark', 'Norway'];
const phones = [
  '070 441 45 62',
  '071 442 55 63',
  '072 443 65 64',
  '073 444 75 65',
  '070 445 85 66',
  '071 446 95 67',
  '072 447 15 68',
  '073 448 25 69',
  '070 449 35 61',
  '071 414 41 62',
  '072 424 52 63',
  '073 434 63 64',
  '070 444 74 65',
];

const performerNames = [
  'Scrummy September',
  'Tower Metal',
  'Maggieatron',
  'Megatower',
  'E.N.T.E.R.T.A.I.N.I.N.G.',
  'Panic',
  'Head',
  'The Bouncing Bananas',
  'Saving Maggie',
  'One Zilliondust',
  'Maggie and the Singers',
  'One Zillion Seconds',
  'Bouncing Twins',
  'Wild Bouncing Rabbits',
  'The Bouncing Arm Pits',
  'Rubbish Rabbits',
  'Entertaining Tooth',
  'The Strippers',
  'Bathtub Bouncing',
  'Thunder Arm',
  'Deaf Rabbits',
  'Disciples Of Venus',
  'Entertaining Entertaining Entertaining',
  'The Sisters',
  'Maggie and the Scrummy Humans',
  'Beyond Prague',
  'Twilight of the Gods',
  'Tribute Towel',
  'Scrummy Bananas',
  'Entertaining Bananas of the Blue Towel',
];

function randomElement(arr: string[] | number[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function rand() {
  return Math.round(Math.random() * 1000000);
}

async function addPerformer(user: IUser) {
  const i = rand();

  const performer = models.Performer.build({
    userId: user.id,
    name: randomElement(performerNames).toString(),
    location: randomElement(locations).toString(),
    phone: randomElement(phones).toString(),
    email: `email-${i}@performer.com`,
    details: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled. Lorem Ipsum is simply dummy text of the printing typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled`,
    website: `http://performers-website-${i}.com`,
    rating: parseInt(randomElement([3, 4, 5]).toString()),
    active: true,
  });
  await performer.save();
  return performer;
}

(async function () {
  await db.query('TRUNCATE TABLE public.users RESTART IDENTITY CASCADE;');

  for (let i = 1; i <= 3; i++) {
    const userHash = await bcrypt.hash('password', saltRounds);
    const user = models.User.build({
      name: `User name ${i}`,
      email: `user-${i}@name.com`,
      password: userHash,
      active: true,
    });
    await user.save();

    await addPerformer(user);
    await addPerformer(user);
  }
})();
