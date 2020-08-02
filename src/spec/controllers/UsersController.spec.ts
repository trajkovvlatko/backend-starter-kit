import chai, {app, authUser} from '../spec_helper';
import create from '../factories';

describe('users', () => {
  describe('GET /user/profile', () => {
    it('returns 401 error for user is not signed in', async () => {
      await create('users', {});
      const res = await chai.request(app).get('/user/profile');
      res.should.have.status(401);
      res.body.should.be.an('object');
      res.body.should.deep.eq({});
    });

    it('returns user profile for signed-in user', async () => {
      const user = await create('users', {});
      const email: string = user.email;
      const password: string = user.password;
      const token = await authUser({
        email,
        password,
      });
      const res = await chai
        .request(app)
        .get('/user/profile')
        .set('Authorization', `Bearer ${token}`);

      res.should.have.status(200);
      res.body.should.be.an('object');
      res.body.should.deep.eq({
        id: user.id,
        name: user.name,
        email: user.email,
      });
    });
  });
});
