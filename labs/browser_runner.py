"""Executed by Pyodide with __lab_* values supplied by the reader worker."""
import contextlib
import io
import json
import traceback
import types


buffer = io.StringIO()
passed = True
with contextlib.redirect_stdout(buffer), contextlib.redirect_stderr(buffer):
    try:
        student = types.ModuleType("browser_student")
        if __lab_support:
            exec(__lab_support, student.__dict__)
        exec(__lab_code, student.__dict__)
        if __lab_mode == "test":
            checks_namespace = {"__name__": "browser_checks"}
            exec(__lab_checks, checks_namespace)
            checks_namespace["CHECKS"][__lab_task](student)
            print("PASS", __lab_task)
        elif not buffer.getvalue():
            print(
                "Code loaded successfully. Add a print call to inspect values, "
                "or run the behavioral checks."
            )
    except BaseException:
        passed = False
        traceback.print_exc()

json.dumps({"passed": passed, "output": buffer.getvalue()})
