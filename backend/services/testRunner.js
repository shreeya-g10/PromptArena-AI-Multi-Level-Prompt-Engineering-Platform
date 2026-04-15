import { execSync } from "child_process";
import fs from "fs";

export function runTestCases(problem, code) {

  if (!problem || !problem.test_cases) {
    return { passed: 0, total: 0, results: [] };
  }

  const functionName = extractFunctionName(code) || "solution";

  const results = [];
  let passed = 0;

  problem.test_cases.forEach((tc, index) => {

    // 🔥 unique filename to avoid conflicts
    const fileName = `temp_${Date.now()}_${index}.py`;

    try {
  // ✅ CLEAN AI CODE
  const cleanCode = code.replace(/```python|```/g, "");

  // ✅ Build executable Python script
  const pythonCode = `
${cleanCode}

try:
    result = ${functionName}(${formatInput(tc.input)})
    print(result)
except Exception as e:
    print("ERROR")
`;

  // create temp file
  fs.writeFileSync(fileName, pythonCode);

  // execute python
  const output = execSync(`python3 ${fileName}`)
    .toString()
    .trim()
    .split("\n")
    .pop();

  const expected = tc.expectedOutput.replace(/"/g, "").trim();

  const isPass = output === expected;

  if (isPass) passed++;

  results.push({
    input: tc.input,
    expected,
    actual: output,
    passed: isPass
  });

} catch {
  results.push({
    input: tc.input,
    expected: tc.expectedOutput,
    actual: "Error",
    passed: false
  });
}
     finally {
      // 🔥 ALWAYS DELETE FILE (even if error happens)
      if (fs.existsSync(fileName)) {
        fs.unlinkSync(fileName);
      }
    }
  });

  return {
    passed,
    total: problem.test_cases.length,
    results
  };
}


// 🔥 Extract function name automatically
function extractFunctionName(code) {
  const match = code.match(/def\s+(\w+)\s*\(/);
  return match ? match[1] : null;
}


// format input
function formatInput(input) {
  if (input.startsWith('"') || input.startsWith("'")) return input;
  return input;
}