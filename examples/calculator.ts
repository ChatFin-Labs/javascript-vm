import { ExecSandbox, GenDictionary } from '../src/index';

// Simple calculator example
const calculatorCode = `
  function add(a, b) { return a + b; }
  function subtract(a, b) { return a - b; }
  function multiply(a, b) { return a * b; }
  function divide(a, b) { return a / b; }
  
  result = {
    add: add(5, 3),
    subtract: subtract(10, 4),
    multiply: multiply(6, 7),
    divide: divide(15, 3)
  };
`;

async function runCalculatorExample(): Promise<void> {
  console.log('🧮 Calculator Example (TypeScript)');
  
  const sandbox = new ExecSandbox(false);
  try {
    const output = await sandbox.run(calculatorCode, {} as GenDictionary);
    console.log("Results:", output.result);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    sandbox.dispose();
  }
}

runCalculatorExample();