import {Request} from 'express';

export default interface IRequestWithCustomBody<T> extends Request {
  body: T;
}
