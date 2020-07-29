import {Request} from 'express';
import IUser from '../models/user_model';
import IDictionary from './IDictionary';

type ParamsDictionary = IDictionary<string>;
type ParamsWithId = ParamsDictionary & {id: number};

export interface IAuthenticatedRequest extends Request {
  user: IUser;
}

export interface IAuthenticatedCreateRequest<T> extends IAuthenticatedRequest {
  body: T;
}

export interface IAuthenticatedShowRequest extends IAuthenticatedRequest {
  params: ParamsWithId;
}

export interface IAuthenticatedUpdateRequest<T> extends IAuthenticatedRequest {
  params: ParamsWithId;
  body: T;
}

export interface IUnauthenticatedRequestWithCustomBody<T> extends Request {
  body: T;
}
