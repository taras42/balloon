app.classes.CompositeText = function(options) {
    this.textSequence = options.textSequence || [];
    this.textDisplayZones = options.textDisplayZones || [];

    this.initialize();
}

app.classes.CompositeText.prototype = {

    DEFAULT_TIMEOUT: 1000,

    initialize: function() {
        this.currentTextInSequence = 0;
        this.currentDisplayZone = 0;

        this._setTextIntoDisplayZone();
    },

    next: function() {
        if (this.currentDisplayZone < this.textDisplayZones.length - 1) {
            this.currentDisplayZone += 1;
        } else {
            this.currentDisplayZone = 0;
        }

        this.currentTextInSequence += 1;

        this._resetCountersIfNecessary();
        this._setTextIntoDisplayZone();

        return this;
    },

    _resetCountersIfNecessary: function() {
        if (this.currentTextInSequence > this.textSequence.length) {
            this.currentTextInSequence = 0;
            this.currentDisplayZone = 0;
        }
    },

    _setTextIntoDisplayZone: function() {
        var textDisplayZone = this.textDisplayZones[this.currentDisplayZone],
            text = this.textSequence[this.currentTextInSequence];

        textDisplayZone && $(textDisplayZone).text(text);
    },

    getCurrentTextDisplayZone: function() {
        return $(this.textDisplayZones[this.currentDisplayZone]);
    },

    fadeIn: function(miliseconds) {
        var currentDisplayZone = this.getCurrentTextDisplayZone();

        currentDisplayZone && currentDisplayZone.fadeIn(miliseconds
            || this.DEFAULT_TIMEOUT);
    },

    fadeOut: function(miliseconds) {
        var currentDisplayZone = this.getCurrentTextDisplayZone();

        currentDisplayZone && currentDisplayZone.fadeOut(miliseconds
            || this.DEFAULT_TIMEOUT);
    }

}
