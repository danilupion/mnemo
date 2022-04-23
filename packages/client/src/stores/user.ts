import { makeAutoObservable } from 'mobx';

const getName = () => {
  let name = localStorage.getItem('name');
  while (!name) {
    name = prompt('Enter your name');
  }
  localStorage.setItem('name', name);
  return name;
};

export class UserStore {
  private readonly _name: string;

  constructor() {
    this._name = getName();
    makeAutoObservable(this);
  }

  public get name() {
    return this._name;
  }
}

export default new UserStore();
