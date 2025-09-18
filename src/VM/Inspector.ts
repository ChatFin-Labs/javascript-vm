
import IsolatedVM from "isolated-vm";
import ws from "ws";

export class Inspector {
  private wss: ws.Server;

  constructor(ivm: IsolatedVM.Isolate, port: number) {
    this.wss = new ws.Server({ port });
  this.wss.on("connection", function (ws: ws.WebSocket) {
      const channel = ivm.createInspectorSession();
      function dispose(): void {
        try {
          channel.dispose();
        } catch (err) {
          /* empty */
        }
      }
      ws.on("error", dispose);
      ws.on("close", dispose);
      ws.on("message", function (message: any): void {
        try {
          channel.dispatchProtocolMessage(String(message));
        } catch (err) {
          ws.close();
        }
      });
      function send(message: any): void {
        try {
          ws.send(message);
        } catch (err) {
          dispose();
        }
      }
      channel.onResponse = (callId: any, message: any): void => send(message);
      channel.onNotification = send;
    });
    // eslint-disable-next-line no-console
    console.log(`Executor Debugger listening on ws://127.0.0.1:${port}/`);
  }

  close(): void {
    this.wss.close();
  }
}
