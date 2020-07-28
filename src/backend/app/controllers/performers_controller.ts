import {Request, Response} from 'express';
import models from '../models';
import {parse} from 'querystring';
const {Performer} = models;

export default class PerformersController {
  public async index(req: Request, res: Response) {
    let limit = 10;
    if (typeof req.query.limit === 'string') {
      limit = parseInt(req.query.limit);
    }
    if (isNaN(limit) || limit > 10) limit = 10;

    const performers = await Performer.findAll({
      attributes: ['id', 'name', 'rating', 'type'],
      where: {active: true},
      order: [['id', 'DESC']],
    });
    res.send(performers);
  }

  public async show(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const performer = await Performer.basicFind(id);
    if (performer) {
      res.send(performer);
    } else {
      res.status(404).send({error: 'Record not found.'});
    }
  }
}
