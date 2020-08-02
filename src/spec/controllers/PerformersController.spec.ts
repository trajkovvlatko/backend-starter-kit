import chai, {app} from '../spec_helper';
import create from '../factories';
import IUser from '../../app/models/User';
import IPerformer from '../../app/models/Performer';

describe('performers', () => {
  let user: IUser;

  beforeEach(async () => {
    user = await create('users', {});
  });

  describe('GET /performers', () => {
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
      res.body.should.deep.eq([
        {
          id: performer2.id,
          name: performer2.name,
          type: 'performer',
          rating: performer2.rating,
        },
        {
          id: performer1.id,
          name: performer1.name,
          type: 'performer',
          rating: performer1.rating,
        },
      ]);
    });

    it('uses limit if present', async () => {
      for (let i = 0; i < 5; i++) {
        await create('performers', {userId: user.id});
      }
      const res = await chai.request(app).get('/performers?limit=3');
      res.should.have.status(200);
      res.body.should.be.an('array');
      res.body.length.should.eq(3);
    });

    it('returns max 10 performers even if limit is set to more', async () => {
      for (let i = 0; i < 15; i++) {
        await create('performers', {userId: user.id});
      }
      const res = await chai.request(app).get('/performers?limit=15');
      res.should.have.status(200);
      res.body.should.be.an('array');
      res.body.length.should.eq(10);
    });

    it('uses offset if present', async () => {
      const p1 = await create('performers', {userId: user.id});
      const p2 = await create('performers', {userId: user.id});
      const p3 = await create('performers', {userId: user.id});
      const res1 = await chai.request(app).get('/performers');
      res1.should.have.status(200);
      res1.body.should.be.an('array');
      res1.body.length.should.eq(3);
      res1.body[0].id.should.eq(p3.id);
      res1.body[1].id.should.eq(p2.id);
      res1.body[2].id.should.eq(p1.id);

      const res2 = await chai.request(app).get('/performers?offset=1');
      res2.should.have.status(200);
      res2.body.should.be.an('array');
      res2.body.length.should.eq(2);
      res2.body[0].id.should.eq(p2.id);
      res2.body[1].id.should.eq(p1.id);

      const res3 = await chai.request(app).get('/performers?offset=-1');
      res3.should.have.status(200);
      res3.body.should.be.an('array');
      res3.body.length.should.eq(3);
      res3.body[0].id.should.eq(p3.id);
      res3.body[1].id.should.eq(p2.id);
      res3.body[2].id.should.eq(p1.id);

      const res4 = await chai.request(app).get('/performers?offset=10');
      res4.should.have.status(200);
      res4.body.should.be.an('array');
      res4.body.length.should.eq(0);
    });
  });

  describe('GET /performers/:id', () => {
    let id: number, performers: IPerformer[];

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
