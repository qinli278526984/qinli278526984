class GameImage {
    constructor(game, name) {
        this.game = game
        this.image = game.imageByName(name)
        this.x = 0
        this.y = 0
        this.w = this.image.width
        this.h = this.image.height
        this.flipY = false
        this.rotation = 0
        this.in = false
    }
    static new(game, name) {
        var i = new this(game, name)
        return i
    }
    update() {}
    draw() {
        this.game.drawImage(this)
    }
    collide(b) {
        if (b.x + b.w > this.x && b.x <= this.x + this.w) {
            this.in = true
            if (b.y + b.h > this.y || b.y < this.y - config.pipe_space.value) {
                return true
            }
        }
        return false
    }
}

const randomBetween = (strat, end) =>{
    let n  = Math.random() * (end - strat + 1)
    return Math.floor(n + strat)
}