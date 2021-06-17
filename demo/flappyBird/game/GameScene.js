class GameScene {
    constructor(game) {
        this.game = game
        this.debugModeEnabled = true
        this.elements = []
    }
    static new(game) {
        var i = new this(game)
        return i
    }
    addelement(GameImage) {
        GameImage.scene = this
        this.elements.push(GameImage)
    }
    draw() {
        for (let e of this.elements) {
            e.draw()
        }
    }
    update() {
        if (this.debugModeEnabled) {
            for (let i = 0; i < this.elements.length; i++) {
                var e = this.elements[i]
                //有则调用e.debug()
                e.debug && e.debug()
            }
        }
        for (let i = 0; i < this.elements.length; i++) {
            var e = this.elements[i]
            e.update()
        }
    }
}