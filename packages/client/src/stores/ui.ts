import { makeAutoObservable } from 'mobx';

export class UiStore {
  private _isScoreBoardOpen = false;

  constructor() {
    makeAutoObservable(this);
  }

  public closeScoreBoard = () => {
    this._isScoreBoardOpen = false;
  };

  public openScoreBoard = () => {
    this._isScoreBoardOpen = true;
  };

  public get isScoreBoardOpen() {
    return this._isScoreBoardOpen;
  }
}

export default new UiStore();
