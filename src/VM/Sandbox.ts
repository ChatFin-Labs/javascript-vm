import IsolatedVM from "isolated-vm";
import { Dictionary, GenDictionary } from "../Models/General";
import { Inspector } from "./Inspector";
import { IsolateEngine } from "./IsolateEngine";

export class ExecSandbox {
  private engine: IsolateEngine;
  private inspector?: Inspector;

  private get context(): IsolatedVM.Context {
    return this.engine.context;
  }

  constructor(ctx: GenDictionary, debug = false, port = 3000) {
    this.engine = new IsolateEngine();
    if (debug) this.inspector = new Inspector(this.engine.isolate, port);
    this.baseInit(ctx, debug);
  }

  private baseInit(ctx: GenDictionary, debug: boolean): void {
    const sandbox = this.context.global;
    sandbox.setSync("global", sandbox.derefInto());
    sandbox.setSync("_execCtxArgs", new IsolatedVM.ExternalCopy(ctx));

    const baseSetup = `
      const enableDebug = ${debug};
      const execCtxArgs = _execCtxArgs.copy();
      delete _execCtxArgs;
      function awaitDebugger() {
        if (!enableDebug) return;
        let startTime = Date.now();
        let debugGoNext = false;
        while (!debugGoNext) {
          if (Date.now() - startTime > 15000)
            throw new Error("Debugger enabled but not connected");
          debugger;
        }
      }
      function scopedContext(target) {
        return new Proxy(target, {
          has(target, prop) {
            return true;
          },
          get(target, prop) {
            return (prop in target ? target : global)[prop];
          },
        });
      }
    `;
    this.context.evalSync(baseSetup, { filename: "baseInit.js" });
  }

  private prepFn(name: string, fn: Function): string {
    const ivmRef = new IsolatedVM.Reference(async function (...args: any[]) {
      const res = await fn.apply(null, args);
      return new IsolatedVM.ExternalCopy(res);
    });
    this.context.global.setSync(`_main_${name}`, ivmRef);
    const script = `
    function ${name}() {
      const args = Array.from(arguments);
      if(args.length === 0) args.push({});
      args.push(execCtxArgs);
      const result = _main_${name}.applySyncPromise(undefined, args, {
        arguments: { copy: true },
      });
      return result.copy();
    }`;
    return script;
  }

  addFns(name: string, fns: Map<string, { fn: Function }>): void {
    let finalScript = "";
    fns.forEach((value, key) => {
      finalScript += "\n" + this.prepFn(key, value.fn);
    });
    this.context.evalSync(finalScript, { filename: `${name}.js` });
  }

  private evalScript(code: string): IsolatedVM.Reference<any> {
    const script = `
      (function(scopeVars) {
        scopeVars = scopeVars.copy();
        awaitDebugger();
        with (scopedContext(scopeVars)) {
          ${code}
        }
        return scopeVars;
      })`;
    const scriptRef = this.context.evalSync(script, {
      filename: "runCode.js",
      reference: true,
    });
    return scriptRef;
  }

  run(code: string, scopeVars: GenDictionary): Promise<any> {
    const scriptRef = this.evalScript(code);
    const scriptScope = new IsolatedVM.ExternalCopy(scopeVars);
    return new Promise((resolve, reject) => {
      scriptRef
        .apply(undefined, [scriptScope], {
          result: { copy: true },
        })
          .then((response: any) => {
            resolve(response);
          })
          .catch((err: any) => {
            reject(err);
          });
    });
  }

  private getStats(): Dictionary<string> {
    const heapStats = this.engine.isolate.getHeapStatisticsSync();
    const getMB = (val: number): string =>
      Math.round((val / 1000 / 1000) * 100) / 100 + "MB";
    const getMS = (val: bigint): string =>
      Math.round((Number(val / BigInt(1000)) / 1000) * 100) / 100 + "MS";
    const stats = {
      cpu_time: getMS(this.engine.isolate.cpuTime),
      wall_time: getMS(this.engine.isolate.wallTime),
      ext_alloc: getMB(heapStats.externally_allocated_size),
      heap_lim: getMB(heapStats.heap_size_limit),
      malloc: getMB(heapStats.malloced_memory),
      peak_malloc: getMB(heapStats.peak_malloced_memory),
      total_avail: getMB(heapStats.total_available_size),
      total_heap: getMB(heapStats.total_heap_size),
      total_heap_exec: getMB(heapStats.total_heap_size_executable),
      total_phys: getMB(heapStats.total_physical_size),
      used_heap: getMB(heapStats.used_heap_size),
    };
    return stats;
  }

  dispose(): void {
    this.inspector?.close();
    this.engine.close();
  }
}
