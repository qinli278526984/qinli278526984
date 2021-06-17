class GameLabel {
    constructor(game, text) {
        this.game = game
        this.text = text
    }
    static new(game, text) {
        return new this(game, text)
    }
    draw() {
        this.game.ctx.font = '40px serif'
        this.game.ctx.fillText(this.text, 0, 40)
    }
    update() {
    }
}