import {Request, Response} from 'express';
import models from '../models';
import IPerformer from '../models/performer_model';
import IError from '../interfaces/IError';
const {Performer} = models;

export default class PerformersController {
  public async index(
    req: Request,
    res: Response<IError | IPerformer[]>,
  ): Promise<Response> {
    try {
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
      return res.send(performers);
    } catch (e) {
      return res.status(500).send({error: 'Error selecting performers.'});
    }
  }

  public async show(
    req: Request,
    res: Response<IError | IPerformer>,
  ): Promise<Response> {
    try {
      const id = parseInt(req.params.id);
      const performer = await Performer.basicFind(id);
      if (performer) {
        return res.send(performer);
      } else {
        return res.status(404).send({error: 'Record not found.'});
      }
    } catch (e) {
      return res.status(500).send({error: 'Error selecting performer.'});
    }
  }
}
