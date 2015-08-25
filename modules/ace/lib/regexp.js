
'use strict';

var real = {
        exec: RegExp.prototype.exec,
        test: RegExp.prototype.test,
        match: String.prototype.match,
        replace: String.prototype.replace,
        split: String.prototype.split
    },
    compliantExecNpcg = real.exec.call(/()??/, "")[1] === undefined, // check `exec` handling of nonparticipating capturing groups
    compliantLastIndexIncrement = function () {
        var x = /^/g;
        real.test.call(x, "");
        return !x.lastIndex;
    }();

if (compliantLastIndexIncrement && compliantExecNpcg)
    return;
RegExp.prototype.exec = function (str) {
    var match = real.exec.apply(this, arguments),
        name, r2;
    if ( typeof(str) == 'string' && match) {
        if (!compliantExecNpcg && match.length > 1 && indexOf(match, "") > -1) {
            r2 = RegExp(this.source, real.replace.call(getNativeFlags(this), "g", ""));
            real.replace.call(str.slice(match.index), r2, function () {
                for (var i = 1; i < arguments.length - 2; i++) {
                    if (arguments[i] === undefined)
                        match[i] = undefined;
                }
            });
        }
        if (this._xregexp && this._xregexp.captureNames) {
            for (var i = 1; i < match.length; i++) {
                name = this._xregexp.captureNames[i - 1];
                if (name)
                   match[name] = match[i];
            }
        }
        if (!compliantLastIndexIncrement && this.global && !match[0].length && (this.lastIndex > match.index))
            this.lastIndex--;
    }
    return match;
};
if (!compliantLastIndexIncrement) {
    RegExp.prototype.test = function (str) {
        var match = real.exec.call(this, str);
        if (match && this.global && !match[0].length && (this.lastIndex > match.index))
            this.lastIndex--;
        return !!match;
    };
}

function getNativeFlags (regex) {
    return (regex.global     ? "g" : "") +
           (regex.ignoreCase ? "i" : "") +
           (regex.multiline  ? "m" : "") +
           (regex.extended   ? "x" : "") + // Proposed for ES4; included in AS3
           (regex.sticky     ? "y" : "");
}

function indexOf (array, item, from) {
    if (Array.prototype.indexOf) // Use the native array method if available
        return array.indexOf(item, from);
    for (var i = from || 0; i < array.length; i++) {
        if (array[i] === item)
            return i;
    }
    return -1;
}