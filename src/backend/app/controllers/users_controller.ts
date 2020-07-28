import {Request, Response} from 'express';

export default class UsersController {
  public async profile(req: Request, res: Response) {
    res.send(req.user);
  }
}
