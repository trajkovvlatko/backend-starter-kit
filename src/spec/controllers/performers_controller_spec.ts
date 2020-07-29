import chai, {app} from '../spec_helper';
import create from '../factories';
import User from '../../app/models/user_model';
import Performer from '../../app/models/performer_model';

describe('performers', () => {
  let user: User;

  beforeEach(async () => {
    user = await create('users', {});
  });

  describe('GET /', () => {
    it('returns empty array for no performers present', async () => {
      const res = await chai.request(app).get('/performers');
      res.should.have.status(200);
      res.body.should.deep.eq([]);
    });

    it('returns list of active performers', async () => {
      const performer1 = await create('performers', {userId: user.id});
      const performer2 = await create('performers', {userId: user.id});
      await create('performers', {
        userId: user.id,
        active: false,
      });

      const res = await chai.request(app).get('/performers');
      res.should.have.status(200);
      res.body.should.be.an('array');
      res.body.length.should.eq(2);
      res.body
        .map((p: Performer) => p.id)
        .should.deep.eq([performer2.id, performer1.id]);
      Object.keys(res.body[0])
        .sort()
        .should.deep.eq(['id', 'type', 'name', 'rating'].sort());
      res.body[0].should.deep.eq({
        id: performer2.id,
        name: performer2.name,
        type: 'performer',
        rating: performer2.rating,
      });
      res.body[1].should.deep.eq({
        id: performer1.id,
        name: performer1.name,
        type: 'performer',
        rating: performer1.rating,
      });
    });
  });

  describe('GET /:id', () => {
    let id: number, performers: Performer[];

    beforeEach(async () => {
      const p1 = await create('performers', {userId: user.id});
      const p2 = await create('performers', {userId: user.id});
      performers = [p1, p2];
      id = performers[0].id;
    });

    it('returns an object with a performer', async () => {
      const res = await chai.request(app).get(`/performers/${id}`);
      const expected = performers[0];
      res.should.have.status(200);
      res.body.should.be.an('object');
      res.body.should.deep.eq({
        id: expected.id,
        name: expected.name,
        email: expected.email,
        location: expected.location,
        phone: expected.phone,
        details: expected.details,
        website: expected.website,
        type: 'performer',
        rating: expected.rating,
        active: expected.active,
      });
    });

    it('returns an error if performer is not found', async () => {
      const res = await chai.request(app).get('/performers/-1');
      res.should.have.status(404);
      res.body.should.be.an('object');
      res.body.error.should.eq('Record not found.');
    });
  });
});
