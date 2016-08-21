app.classes.BallonController = function(options) {
    this.ballon = options.ballon;
    this.eventBus = options.eventBus;
    this._isBallonInMotion = false;
}

app.classes.BallonController.prototype = {

    settings: {
        rotationValue: 0,
        rotationStep: 0.018,
        rotationSpeed: 240,
        applyRotationAfter: 0.7
    },

    setBallonPosition: function(position) {
        this.ballon.setPosition({
            position:position
        });
    },

    isBallonInMotion: function() {
        return this._isBallonInMotion;
    },

    animateBallon: function(currentScenePosition) {
        var ballonYPosition = this.ballon.getPosition().y,
            applyRotationAfter = this.settings.applyRotationAfter;

        if (ballonYPosition < currentScenePosition) {
            this.ballon.moveUp();
            this._setBallonInMotionPropertyToTrueAndTriggerEvent();
        } else {
            this._setBallonInMotionPropertyToFalseAndTriggerEvent();
        }

        if (ballonYPosition > applyRotationAfter) {
            this._applyRotationYToBallonByCos();
        }
    },

    _setBallonInMotionPropertyToTrueAndTriggerEvent: function() {
        if (!this._isBallonInMotion) {
            this.eventBus.trigger("ballon:inMotion");
        }
        this._isBallonInMotion = true;
    },

    _setBallonInMotionPropertyToFalseAndTriggerEvent: function() {
        if (this._isBallonInMotion) {
            this.eventBus.trigger("ballon:inIdle");
        }

        this._isBallonInMotion = false;
    },

    _applyRotationYToBallonByCos: function() {
        var currentRotationValue = this.settings.rotationValue,
            factor = Math.cos(currentRotationValue) / this.settings.rotationSpeed;

        this.ballon.rotateY(factor);

        this.settings.rotationValue += this.settings.rotationStep;
    }
}
