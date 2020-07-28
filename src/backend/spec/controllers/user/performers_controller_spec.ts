import chai, {authUser, app} from '../../spec_helper';
import create from '../../factories';

describe('user/performers', () => {
  context('when user is not signed in', () => {
    describe('GET /user/performers', () => {
      it('returns 401', async () => {
        const user = await create('users', {});
        await create('performers', {userId: user.id});
        const res = await chai.request(app).get(`/user/performers`);
        res.should.have.status(401);
        res.body.should.deep.eq({});
      });
    });

    describe('GET /user/performers/active', () => {
      it('returns 401', async () => {
        await create('performers', {
          userId: (await create('users', {})).id,
        });
        const res = await chai.request(app).get(`/user/performers/active`);
        res.should.have.status(401);
        res.body.should.deep.eq({});
      });
    });

    describe('GET /user/performers/:id', () => {
      it('returns 401', async () => {
        const id = (
          await create('performers', {
            userId: (await create('users', {})).id,
          })
        ).id;
        const res = await chai.request(app).get(`/user/performers/${id}`);
        res.should.have.status(401);
        res.body.should.deep.eq({});
      });
    });

    describe('PATCH /user/performers/:id', () => {
      it('returns 401', async () => {
        const id = (
          await create('performers', {
            userId: (await create('users', {})).id,
          })
        ).id;
        const options = {name: 'new name'};
        const res = await chai
          .request(app)
          .patch(`/user/performers/${id}`)
          .set('content-type', 'application/json')
          .send(options);
        res.should.have.status(401);
        res.body.should.deep.eq({});
      });
    });

    describe('POST /user/performers', () => {
      it('returns 401', async () => {
        const options = {
          name: 'new name',
          location: 'new location',
          phone: 'new phone',
          details: 'new details',
          website: 'new website',
          active: false,
        };
        const res = await chai
          .request(app)
          .post(`/user/performers`)
          .set('content-type', 'application/json')
          .send(options);
        res.should.have.status(401);
        res.body.should.deep.eq({});
      });
    });
  });

  context('when user is signed in', () => {
    let token: string, user: any;

    beforeEach(async () => {
      user = await create('users', {});
      token = await authUser(user);
    });

    describe('GET /user/performers', () => {
      it('returns empty array for no performers found for user', async () => {
        // performer owned by another user
        const userId = (await create('users', {})).id;
        await create('performers', {userId});
        const res = await chai
          .request(app)
          .get('/user/performers')
          .set('Authorization', `Bearer ${token}`);
        res.should.have.status(200);
        res.body.should.deep.eq([]);
      });

      it('returns an array of performers owned by a user', async () => {
        // performer owned by another user
        const userId = (await create('users', {})).id;
        await create('performers', {userId});

        // own performers
        const performer1 = await create('performers', {userId: user.id});
        const performer2 = await create('performers', {userId: user.id});

        const res = await chai
          .request(app)
          .get('/user/performers')
          .set('Authorization', `Bearer ${token}`);
        res.should.have.status(200);
        res.body.should.deep.eq([
          {
            id: performer2.id,
            name: performer2.name,
            rating: performer2.rating,
            type: 'performer',
          },
          {
            id: performer1.id,
            name: performer1.name,
            rating: performer1.rating,
            type: 'performer',
          },
        ]);
      });
    });

    describe('GET /user/performers/active', () => {
      it('returns empty array for no active performers found', async () => {
        // inactive performer
        await create('performers', {userId: user.id, active: false});
        const res = await chai
          .request(app)
          .get('/user/performers/active')
          .set('Authorization', `Bearer ${token}`);
        res.should.have.status(200);
        res.body.should.deep.eq([]);
      });

      it('returns an array of performers owned by a user', async () => {
        // performer owned by another user
        const userId = (await create('users', {})).id;
        await create('performers', {userId});
        // own performers
        const performer1 = await create('performers', {userId: user.id});
        const performer2 = await create('performers', {userId: user.id});
        // inactive performer
        await create('performers', {userId: user.id, active: false});

        const res = await chai
          .request(app)
          .get('/user/performers/active')
          .set('Authorization', `Bearer ${token}`);
        res.should.have.status(200);
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
    });

    describe('GET /user/performers/:id', () => {
      it('returns 404 for performer not found', async () => {
        const res = await chai
          .request(app)
          .get(`/user/performers/-1`)
          .set('Authorization', `Bearer ${token}`);
        res.should.have.status(404);
        res.body.error.should.eq('Performer not found.');
      });

      it('returns 404 for performer not owned by the user', async () => {
        const tmpUserId = (await create('users', {})).id;
        const id = (await create('performers', {userId: tmpUserId})).id;
        const res = await chai
          .request(app)
          .get(`/user/performers/${id}`)
          .set('Authorization', `Bearer ${token}`);
        res.should.have.status(404);
        res.body.error.should.eq('Performer not found.');
      });

      it('returns a performer when owned by a user', async () => {
        const performer = await create('performers', {userId: user.id});
        const res = await chai
          .request(app)
          .get(`/user/performers/${performer.id}`)
          .set('Authorization', `Bearer ${token}`);
        res.should.have.status(200);
        res.body.should.deep.eq({
          id: performer.id,
          name: performer.name,
          email: performer.email,
          active: performer.active,
          location: performer.location,
          details: performer.details,
          website: performer.website,
          phone: performer.phone,
          rating: performer.rating,
          type: 'performer',
        });
      });
    });

    describe('PATCH /user/performers/:id', () => {
      it("doesn't update performer not owned by the user", async () => {
        const userId = (await create('users', {})).id;
        const performer = await create('performers', {userId});
        const options = {name: 'new name'};
        const res = await chai
          .request(app)
          .patch(`/user/performers/${performer.id}`)
          .set('content-type', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .send(options);
        res.should.have.status(404);
        res.body.error.should.eq('Performer not found.');
      });

      it('updates performer data', async () => {
        const performer = await create('performers', {userId: user.id});
        const options = {
          name: 'new name',
          location: 'new location',
          phone: 'new phone',
          details: 'new details',
          website: 'new website',
          active: false,
        };
        const res = await chai
          .request(app)
          .patch(`/user/performers/${performer.id}`)
          .set('content-type', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .send(options);
        res.should.have.status(200);
        res.body.should.include(options);
        res.body.updatedAt.should.not.eq(performer.updatedAt);
      });
    });

    describe('POST /user/performers', () => {
      it('fails for missing data', async () => {
        const options = {active: false};
        const res = await chai
          .request(app)
          .post(`/user/performers`)
          .set('content-type', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .send(options);
        res.should.have.status(500);
        res.body.error.should.eq('Error creating a performer.');
      });

      it('creates a new performer', async () => {
        const options = {
          name: 'new name',
          email: 'new email',
          location: 'new location',
          phone: 'new phone',
          details: 'new details',
          website: 'new website',
          active: false,
        };
        const res = await chai
          .request(app)
          .post(`/user/performers`)
          .set('content-type', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .send(options);
        res.should.have.status(200);
        res.body.should.include(options);
        res.body.userId.should.eq(user.id);
      });
    });
  });
});
