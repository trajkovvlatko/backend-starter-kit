import {Response} from 'express';
import IPerformer from '../../models/performer_model';
import {
  IAuthenticatedRequest,
  IAuthenticatedShowRequest,
  IAuthenticatedUpdateRequest,
  IAuthenticatedCreateRequest,
} from '../../interfaces/requests';
import IError from '../../interfaces/IError';
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

export default class UserPerformersController {
  public async index(
    req: IAuthenticatedRequest,
    res: Response<IError | IPerformer[]>,
  ): Promise<Response> {
    try {
      const performers = await req.user.getPerformers({
        attributes: ['id', 'name', 'rating', 'type'],
        order: [['id', 'DESC']],
      });
      return res.send(performers);
    } catch (e) {
      return res.status(500).send({error: 'Error fetching performers.'});
    }
  }

  public async active(
    req: IAuthenticatedRequest,
    res: Response<IError | IPerformer[]>,
  ): Promise<Response> {
    try {
      const performers = await req.user.getPerformers({
        attributes: ['id', 'name', 'rating', 'type'],
        where: {active: true},
        order: [['id', 'DESC']],
      });
      return res.send(performers);
    } catch (e) {
      return res.status(500).send({error: 'Error fetching active performers.'});
    }
  }

  public async show(
    req: IAuthenticatedShowRequest,
    res: Response<IError | IPerformer>,
  ): Promise<Response> {
    const results = await req.user.getPerformers({
      attributes,
      where: {id: req.params.id},
      limit: 1,
    });
    if (results.length > 0) {
      return res.send(results[0]);
    } else {
      return res.status(404).send({error: 'Performer not found.'});
    }
  }

  public async update(
    req: IAuthenticatedUpdateRequest<IPerformer>,
    res: Response<IError | IPerformer>,
  ): Promise<Response> {
    try {
      const results = await req.user.getPerformers({
        attributes,
        where: {id: req.params.id},
        limit: 1,
      });
      const performer = results[0];
      if (performer) {
        const {
          name,
          email,
          location,
          phone,
          details,
          website,
          active,
        } = req.body;
        await performer.update({
          name,
          email,
          location,
          phone,
          details,
          website,
          active,
        });
        return res.send(performer);
      } else {
        return res.status(404).send({error: 'Performer not found.'});
      }
    } catch (e) {
      return res.status(500).send({error: 'Cannot update performer.'});
    }
  }

  public async create(
    req: IAuthenticatedCreateRequest<IPerformer>,
    res: Response<IError | IPerformer>,
  ): Promise<Response> {
    try {
      const {name, email, location, phone, details, website, active} = req.body;
      const performer = await req.user.createPerformer({
        name,
        email,
        location,
        phone,
        details,
        website,
        active,
      });
      return res.send(performer);
    } catch (e) {
      return res.status(500).send({error: 'Error creating a performer.'});
    }
  }

  public async delete(
    req: IAuthenticatedShowRequest,
    res: Response<IError | {success: true; id: number}>,
  ): Promise<Response> {
    try {
      const results = await req.user.getPerformers({
        attributes: ['id'],
        where: {id: req.params.id},
        limit: 1,
      });
      const performer = results[0];
      if (performer) {
        await performer.destroy();
        return res.send({success: true, id: performer.id});
      } else {
        return res.status(404).send({error: 'Performer not found.'});
      }
    } catch (e) {
      return res.status(500).send({error: 'Error while deleting performer.'});
    }
  }
}
