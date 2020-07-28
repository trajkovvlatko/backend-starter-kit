import {Request} from 'express';
import IUser from '../IUser';
import IPerformer from '../IPerformer';

interface Dictionary<T> {
  [key: string]: T;
}
type ParamsDictionary = Dictionary<string>;
type ParamsWithId = ParamsDictionary & {id: number};

export interface IAuthenticatedRequest extends Request {
  user: IUser;
}

export interface IAuthenticatedCreateRequest extends IAuthenticatedRequest {
  body: IPerformer;
}

export interface IAuthenticatedShowRequest extends IAuthenticatedRequest {
  params: ParamsWithId;
}

export interface IAuthenticatedUpdateRequest extends IAuthenticatedRequest {
  params: ParamsWithId;
  body: IPerformer;
}
