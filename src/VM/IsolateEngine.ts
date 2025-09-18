import IsolatedVM from "isolated-vm";

export class IsolateEngine {
  isolate: IsolatedVM.Isolate;
  context: IsolatedVM.Context;

  constructor(debug = false) {
    this.isolate = this.getIsolate(debug);
    this.context = this.getContext(debug);
  }

  close(): void {
    this.isolate.dispose();
  }

  private getIsolate(debug: boolean): IsolatedVM.Isolate {
    // Structure kept similar to original, but without config/logger/duration
    return new IsolatedVM.Isolate({
      memoryLimit: 1024,
      inspector: debug,
      onCatastrophicError: (message: string): void => {
        // Optionally handle catastrophic errors here
        process.emit("SIGINT");
      },
    });
  }

  private getContext(debug: boolean): IsolatedVM.Context {
    return this.isolate.createContextSync({ inspector: debug });
  }
}
