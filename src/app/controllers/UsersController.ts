import {Request, Response} from 'express';

export default class UsersController {
  public profile(req: Request, res: Response): Response {
    return res.send(req.user);
  }
}
