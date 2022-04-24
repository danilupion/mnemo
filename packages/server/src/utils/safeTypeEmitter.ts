import { EventEmitter } from 'events';

type EventsDescriptor<T> = {
  [key in keyof T]: (...args: any[]) => void;
};

export class SafeTypeEmitter<T extends EventsDescriptor<T>> {
  private emitter = new EventEmitter();

  protected emit<E extends keyof T>(event: E, ...args: Parameters<T[E]>) {
    return this.emitter.emit(event as string, ...args);
  }

  public on<E extends keyof T>(event: E, listener: (...args: Parameters<T[E]>) => void) {
    return this.emitter.on(event as string, listener as (...args: unknown[]) => void);
  }
}
