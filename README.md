# JavaScript VM

A secure, isolated JavaScript VM for Node.js, built with TypeScript. Developed and maintained as an open source project by ChatFinAI.

## Find Us 

Visit our official website:  
👉 [ChatFin – AI Finance Platform](https://chatfin.ai)

Connect with us on LinkedIn:  
👉 [ChatFin LinkedIn](https://www.linkedin.com/company/94238033/)

Explore our SuiteApp listing on NetSuite:  
👉 [ChatFin AI for NetSuite – SuiteApp](https://www.suiteapp.com/Chatfin-AI-for-NetSuite)

Read our latest press release:  
👉 [ChatFin Launches Next-Gen AI Releases to Revolutionize Finance](https://www.openpr.com/news/4205936/chatfin-launches-next-gen-ai-releases-to-revolutionize-finance)

Book a Demo:  
👉 [Book Demo](https://chatfin.ai/talk-to-us)


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

#### From npm (Recommended)
```sh
npm install @chatfinai/javascript-vm
```

#### From source
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
Run the sample calculator example:
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

### TypeScript
```typescript
import { ExecSandbox, GenDictionary } from '@chatfinai/javascript-vm';

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
  const sandbox = new ExecSandbox(false);
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

### JavaScript (CommonJS)
```javascript
const { ExecSandbox } = require('@chatfinai/javascript-vm');

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
  const sandbox = new ExecSandbox(false);
  try {
    const output = await sandbox.run(calculatorCode, {});
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
- `src/index.ts` — Main exports for npm package
- `examples/` — Calculator usage examples (JavaScript and TypeScript)

## Examples

The `examples/` directory contains calculator examples showing how to use the VM:

- `calculator.js` — JavaScript (CommonJS) example
- `calculator.ts` — TypeScript example with proper types

### Running Examples

#### If you installed from npm:
```sh
npm install @chatfinai/javascript-vm
```

Then update the import statements in the examples:
- In `calculator.js`: Change `require('../dist/index.js')` to `require('@chatfinai/javascript-vm')`
- In `calculator.ts`: Change `from '../src/index'` to `from '@chatfinai/javascript-vm'`

```sh
# Run JavaScript example
node examples/calculator.js

# Run TypeScript example
npx ts-node examples/calculator.ts
```

#### If you're running from source:
```sh
# First, build the project
npm run build

# Run JavaScript example (uses dist/index.js)
node examples/calculator.js

# Run TypeScript example (uses src/index.ts)
npx ts-node examples/calculator.ts
```

## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Maintainers
- ChatFinAI Open Source Team (<support@chatfin.ai>)

## Support
For questions or support, open an issue on GitHub or contact us at <support@chatfin.ai>.
