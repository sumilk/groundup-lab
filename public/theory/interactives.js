/* Lab registry and mount bridge.

   Lab files under labs/ register themselves with GU.lab(id, mount); core.js
   supplies the shared plotting surface as GU.labkit. The reader calls
   GroundUpInteractives.mount(id, host) for every ```lab fence in a lesson. */
(() => {
  "use strict";
  const GU = window.GU = window.GU || {};
  const labs = GU._labs = GU._labs || {};
  GU.lab = (id, mount) => { labs[id] = mount; };

  window.GroundUpInteractives = {
    has: id => Object.prototype.hasOwnProperty.call(labs, id),
    names: () => Object.keys(labs),
    mount(id, host, spec) {
      const build = labs[id];
      if (!build) return false;
      host.className = "lab";
      host.setAttribute("data-lab", id);
      try { build(host, spec || {}); return true; }
      catch (error) { host.innerHTML = ""; return false; }
    }
  };
})();
