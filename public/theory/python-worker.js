/* Python executes off the UI thread. Only the learner's local browser sees the code. */
const PYODIDE_INDEX = "https://cdn.jsdelivr.net/pyodide/v314.0.7/full/";
let pyodidePromise;
let checksCode = "";
let runnerCode = "";
let supportByTask = {};

function loadRuntime() {
  if (!pyodidePromise) {
    importScripts(PYODIDE_INDEX + "pyodide.js");
    pyodidePromise = loadPyodide({indexURL: PYODIDE_INDEX});
  }
  return pyodidePromise;
}

self.onmessage = async event => {
  const {id, type} = event.data;
  let pyodide;
  try {
    pyodide = await loadRuntime();
    if (type === "init") {
      checksCode = event.data.checks;
      runnerCode = event.data.runner;
      supportByTask = event.data.supportByTask || {};
      self.postMessage({id, ok: true, output: "Python runtime ready."});
      return;
    }
    if (type !== "execute") throw new Error("Unknown worker request.");

    pyodide.globals.set("__lab_code", event.data.code);
    pyodide.globals.set("__lab_checks", checksCode);
    pyodide.globals.set("__lab_task", event.data.task);
    pyodide.globals.set("__lab_mode", event.data.mode);
    pyodide.globals.set("__lab_support", supportByTask[event.data.task] || "");
    const result = JSON.parse(await pyodide.runPythonAsync(runnerCode));
    self.postMessage({id, ok: true, ...result});
  } catch (error) {
    self.postMessage({
      id,
      ok: false,
      passed: false,
      output: error instanceof Error ? error.message : String(error)
    });
  } finally {
    if (pyodide) {
      for (const name of ["__lab_code", "__lab_checks", "__lab_task", "__lab_mode", "__lab_support"]) {
        try { pyodide.globals.delete(name); } catch {}
      }
    }
  }
};
