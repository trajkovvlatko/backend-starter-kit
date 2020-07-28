import {Response} from 'express';
import models from '../../models';
import {
  IAuthenticatedRequest,
  IAuthenticatedShowRequest,
  IAuthenticatedUpdateRequest,
  IAuthenticatedCreateRequest,
} from '../../interfaces/authenticated/IPerformer';
const {Performer} = models;

export default class UserPerformersController {
  public async index(
    req: IAuthenticatedRequest,
    res: Response,
  ): Promise<Response> {
    const performers = await Performer.findAll({
      attributes: ['id', 'name', 'rating', 'type'],
      where: {userId: req.user.id},
      order: [['id', 'DESC']],
    });
    return res.send(performers);
  }

  public async active(
    req: IAuthenticatedRequest,
    res: Response,
  ): Promise<Response> {
    const performers = await Performer.findAll({
      attributes: ['id', 'name', 'rating', 'type'],
      where: {active: true, userId: req.user.id},
      order: [['id', 'DESC']],
    });
    return res.send(performers);
  }

  public async show(
    req: IAuthenticatedShowRequest,
    res: Response,
  ): Promise<Response> {
    const performer = await Performer.basicFind(req.params.id, req.user.id);
    if (performer) {
      return res.send(performer);
    } else {
      return res.status(404).send({error: 'Performer not found.'});
    }
  }

  public async update(
    req: IAuthenticatedUpdateRequest,
    res: Response,
  ): Promise<Response> {
    try {
      const performer = await Performer.basicFind(req.params.id, req.user.id);
      if (performer instanceof Performer) {
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
    req: IAuthenticatedCreateRequest,
    res: Response,
  ): Promise<Response> {
    if (!req.user) {
      return res.send({err: true});
    }
    try {
      const {name, email, location, phone, details, website, active} = req.body;
      const performer = await Performer.create({
        name,
        email,
        location,
        phone,
        details,
        website,
        active,
        userId: req.user.id,
      });
      return res.send(performer);
    } catch (e) {
      return res.status(500).send({error: 'Error creating a performer.'});
    }
  }
}
