const fs = require('fs');
const path = require('path');
const vm = require('vm');

/**
 * Loads one or more browser-style global-object scripts (files that assign
 * to plain identifiers like `const CONFIG = {...}`, no module.exports) into
 * an isolated vm context, in order, so tests can read the resulting globals
 * without touching the app's source files.
 * @param {string[]} relativePaths - paths relative to the project root, in load order
 * @returns {vm.Context} context with the scripts' globals attached
 */
function loadScripts(relativePaths) {
    const sandbox = {};
    const context = vm.createContext(sandbox);

    relativePaths.forEach((relativePath) => {
        const fullPath = path.join(__dirname, '..', '..', relativePath);
        const code = fs.readFileSync(fullPath, 'utf8');
        vm.runInContext(code, context, { filename: relativePath });
    });

    // Top-level `const`/`let` bindings (the browser <script> style used by
    // this project) don't attach to the global object, so pull the known
    // globals out explicitly via `this.X =`, which does attach.
    const GLOBAL_NAMES = ['CONFIG', 'Calculator', 'UI'];
    const exposeGlobals = GLOBAL_NAMES
        .map((name) => `this.${name} = (typeof ${name} !== 'undefined') ? ${name} : undefined;`)
        .join('\n');
    vm.runInContext(exposeGlobals, context, { filename: '(expose-globals)' });

    return sandbox;
}

module.exports = { loadScripts };
