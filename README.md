# JavaScript VM

A secure, isolated JavaScript VM for Node.js, built with TypeScript. Developed and maintained as an open source project by ChatFinAI.

## Features
- Run untrusted JavaScript code securely in an isolated VM
- TypeScript-first development
- Uses [isolated-vm](https://github.com/laverdet/isolated-vm) for sandboxing
- WebSocket inspector support for debugging
- Extensible sandbox API

## Getting Started

### Prerequisites
- Node.js >= 18
- npm >= 9

### Installation
Clone the repository and install dependencies:
```sh
git clone https://github.com/ChatFinAI/javascript-vm.git
cd javascript-vm
npm install
```

### Build
```sh
npm run build
```

### Development
Run the sample calculator sandbox:
```sh
npm run dev
```


### Debugging

#### Node.js Debugger
You can debug the TypeScript code using VS Code or any Node.js debugger:
```sh
node --inspect-brk -r ts-node/register src/index.ts
```
Then attach your debugger to `localhost:9229`.

#### WebSocket Inspector (VM Debugging)
To enable the VM inspector, instantiate `ExecSandbox` with `debug=true` and specify a port (default: 3000):
```typescript
const sandbox = new ExecSandbox({}, true, 3000);
```
This starts a WebSocket inspector server. You can connect Chrome DevTools to:
```
devtools://devtools/bundled/inspector.html?experiments=true&v8only=true&ws=127.0.0.1:3000
```
for live debugging of the isolated VM context.

### Type Checking
```sh
npm run type-check
```

## Usage Example
See `src/index.ts` for a sample usage:
```typescript
import { ExecSandbox } from "./VM/Sandbox";
import { GenDictionary } from "./Models/General";

const calculatorCode = `
  function add(a, b) { return a + b; }
  function subtract(a, b) { return a - b; }
  function multiply(a, b) { return a * b; }
  function divide(a, b) { return a / b; }
  result = {
    add: add(5, 3),
    subtract: subtract(5, 3),
    multiply: multiply(5, 3),
    divide: divide(5, 3)
  };
`;

async function runCalculatorSandbox() {
  const sandbox = new ExecSandbox({}, false);
  try {
    const output = await sandbox.run(calculatorCode, {} as GenDictionary);
    console.log("Calculator Results:", output.result);
  } catch (err) {
    console.error("Sandbox error:", err);
  } finally {
    sandbox.dispose();
  }
}

runCalculatorSandbox();
```

## Project Structure
- `src/VM/` — Core VM and sandbox classes
- `src/Models/` — Type definitions
- `src/index.ts` — Entry point and sample usage

## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Contributing
Pull requests, issues, and feature requests are welcome! Please see our [contributing guidelines](https://github.com/ChatFinAI/javascript-vm/blob/main/CONTRIBUTING.md).

## Maintainers
- ChatFinAI Open Source Team (<opensource@chatfinai.com>)

## Support
For questions or support, open an issue on GitHub or contact us at <opensource@chatfinai.com>.
