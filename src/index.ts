import { ExecSandbox } from "./VM/Sandbox";
import { GenDictionary } from "./Models/General";

// Sample calculator code to run in the sandbox
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