"use strict";
var UndoManager = function() {
    this.reset();
};

(function() {
    this.execute = function(options) {
        var deltaSets = options.args[0];
        this.$doc  = options.args[1];
        if (options.merge && this.hasUndo()){
            this.dirtyCounter--;
            deltaSets = this.$undoStack.pop().concat(deltaSets);
        }
        this.$undoStack.push(deltaSets);
        this.$redoStack = [];
        if (this.dirtyCounter < 0) {
            this.dirtyCounter = NaN;
        }
        this.dirtyCounter++;
    };
    this.undo = function(dontSelect) {
        var deltaSets = this.$undoStack.pop();
        var undoSelectionRange = null;
        if (deltaSets) {
            undoSelectionRange = this.$doc.undoChanges(this.$deserializeDeltas(deltaSets), dontSelect);
            this.$redoStack.push(deltaSets);
            this.dirtyCounter--;
        }

        return undoSelectionRange;
    };
    this.redo = function(dontSelect) {
        var deltaSets = this.$redoStack.pop();
        var redoSelectionRange = null;
        if (deltaSets) {
            redoSelectionRange =
                this.$doc.redoChanges(this.$deserializeDeltas(deltaSets), dontSelect);
            this.$undoStack.push(deltaSets);
            this.dirtyCounter++;
        }
        return redoSelectionRange;
    };
    this.reset = function() {
        this.$undoStack = [];
        this.$redoStack = [];
        this.dirtyCounter = 0;
    };
    this.hasUndo = function() {
        return this.$undoStack.length > 0;
    };
    this.hasRedo = function() {
        return this.$redoStack.length > 0;
    };
    this.markClean = function() {
        this.dirtyCounter = 0;
    };
    this.isClean = function() {
        return this.dirtyCounter === 0;
    };
    this.$serializeDeltas = function(deltaSets) {
        return cloneDeltaSetsObj(deltaSets, $serializeDelta);
    };
    this.$deserializeDeltas = function(deltaSets) {
        return cloneDeltaSetsObj(deltaSets, $deserializeDelta);
    };
    
    function $serializeDelta(delta){
        return {
            action: delta.action,
            start: delta.start,
            end: delta.end,
            lines: delta.lines.length == 1 ? null : delta.lines,
            text: delta.lines.length == 1 ? delta.lines[0] : null,
        };
    }
        
    function $deserializeDelta(delta) {
        return {
            action: delta.action,
            start: delta.start,
            end: delta.end,
            lines: delta.lines || [delta.text]
        };
    }
    
    function cloneDeltaSetsObj(deltaSets_old, fnGetModifiedDelta) {
        var deltaSets_new = new Array(deltaSets_old.length);
        for (var i = 0; i < deltaSets_old.length; i++) {
            var deltaSet_old = deltaSets_old[i];
            var deltaSet_new = { group: deltaSet_old.group, deltas: new Array(deltaSet_old.length)};
            
            for (var j = 0; j < deltaSet_old.deltas.length; j++) {
                var delta_old = deltaSet_old.deltas[j];
                deltaSet_new.deltas[j] = fnGetModifiedDelta(delta_old);
            }
            
            deltaSets_new[i] = deltaSet_new;
        }
        return deltaSets_new;
    }
    
}).call(UndoManager.prototype);

exports.UndoManager = UndoManager;