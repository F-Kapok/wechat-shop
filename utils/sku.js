import { Joiner } from "./joiner";

const parseSpecValue = function (specs) {
    if (!specs) {
        return null;
    }
    const joiner = new Joiner("; ", 2);
    specs.map(spec => {
        joiner.join(spec.value);
    });
    return joiner.getStr();
}

const parseSpecValueArray = function (specValues) {
    if (specValues.length === 0) {
        return null;
    }
    const joiner = new Joiner("; ", 2);
    specValues.forEach(item => {
        joiner.join(item);
    });
    return joiner.getStr();
}

export {
    parseSpecValue,
    parseSpecValueArray
}