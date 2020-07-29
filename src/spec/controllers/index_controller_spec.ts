import chai, {app} from '../spec_helper';

describe('index', () => {
  describe('GET /', () => {
    it('should return 200', (done) => {
      chai
        .request(app)
        .get('/')
        .end((_, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.success.should.equal(true);
          done();
        });
    });
  });
});
