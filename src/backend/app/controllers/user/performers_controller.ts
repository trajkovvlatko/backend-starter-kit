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
  public async index(req: IAuthenticatedRequest, res: Response) {
    const performers = await Performer.findAll({
      attributes: ['id', 'name', 'rating', 'type'],
      where: {userId: req.user.id},
      order: [['id', 'DESC']],
    });
    res.send(performers);
  }

  public async active(req: IAuthenticatedRequest, res: Response) {
    const performers = await Performer.findAll({
      attributes: ['id', 'name', 'rating', 'type'],
      where: {active: true, userId: req.user.id},
      order: [['id', 'DESC']],
    });
    res.send(performers);
  }

  public async show(req: IAuthenticatedShowRequest, res: Response) {
    const performer = await Performer.basicFind(req.params.id, req.user.id);
    if (performer) {
      res.send(performer);
    } else {
      res.status(404).send({error: 'Performer not found.'});
    }
  }

  public async update(req: IAuthenticatedUpdateRequest, res: Response) {
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
        res.send(performer);
      } else {
        res.status(404).send({error: 'Performer not found.'});
      }
    } catch (e) {
      res.status(500).send({error: 'Cannot update performer.'});
    }
  }

  public async create(req: IAuthenticatedCreateRequest, res: Response) {
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
      res.send(performer);
    } catch (e) {
      res.status(500).send({error: 'Error creating a performer.'});
    }
  }
}
