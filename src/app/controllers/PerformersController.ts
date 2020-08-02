import {Request, Response} from 'express';
import models from '../models';
import IPerformer from '../models/Performer';
import IError from '../interfaces/IError';
import {withMaxLimit, withOffset} from '../helpers/request';
const {Performer} = models;
const attributes = [
  'id',
  'name',
  'email',
  'location',
  'phone',
  'details',
  'rating',
  'website',
  'active',
];

export default class PerformersController {
  public async index(
    req: Request,
    res: Response<IError | IPerformer[]>,
  ): Promise<Response> {
    try {
      const limit = withMaxLimit(req.query.limit);
      const offset = withOffset(req.query.offset);
      const performers = await Performer.findAll({
        attributes: ['id', 'name', 'rating', 'type'],
        where: {active: true},
        order: [['id', 'DESC']],
        limit,
        offset,
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
      const performer = await Performer.findByPk(req.params.id, {attributes});
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
