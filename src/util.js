exports.sealModule = function sealModule(target) {
    Object.freeze(target);
    for (const child of Object.values(target)) {
        if (child instanceof Object) sealModule(child);
    }
};
