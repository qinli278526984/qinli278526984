class GameAnimation {
    constructor(game) {
        this.game = game
        this.animations = {
            bird: [],
        }
        for (let i = 1; i < 4; i++) {
            let name = `bird${i}`
            let img = game.imageByName(name)
            this.animations['bird'].push(img)
        }
        this.animationName = 'bird'
        this.image = this.frames()[0]
        this.x = 0
        this.y = 0
        this.w = this.image.width
        this.h = this.image.height
        this.frameIndex = 0
        this.frameCount = 3
        this.flipx = false
        this.rotation = 0
        //重力和加速度
        this.speed = 1
        this.gy = 10
        this.vy = 0
    }
    static new(game) {
        return new this(game)
    }
    hasPoint(x, y) {
        let xIn = x >= this.x && x <= this.x + this.w
        let yIn = y >= this.y && y <= this.y + this.h
        return xIn && yIn
    }
    frames() {
        return this.animations[this.animationName]
    }
    jump() {
        this.vy = -3
        this.rotation = -45
    }
    update() {
        if (window.paused) {
            return
        }
        //更新受力
        this.y += this.vy
        this.vy += this.gy * 0.1
        let h = 565
        if (this.y > h) {
            this.y = h
        }
        //更新角度
        if (this.rotation < 45) {
            this.rotation += 2
        }
        this.frameCount--
        if (this.frameCount === 0) {
            this.frameCount = 3
            this.frameIndex = (this.frameIndex + 1) % this.frames().length
            this.image = this.frames()[this.frameIndex]
        }
    }
    draw() {
        let image = this
        let context = this.game.ctx

        context.save()

        let w2 = this.w / 2
        let h2 = this.h / 2
        context.translate(this.x + w2, this.y + h2)
        if (this.flipx) {
            context.scale(-1, 1)
        }
        context.globalAlpha = this.alpha
        context.rotate(this.rotation * Math.PI / 180)
        context.translate(-w2, -h2)
        context.drawImage(image.image, 0, 0, image.w, image.h)

        context.restore()
    }
    move(x, keyStatus) {
        let animationName = {
            down: 'bird',
            up: 'bird',
        }
        this.flipx = (x < 0)
        let name = animationName[keyStatus]
        this.changeAnimation(name)
        this.x += x
    }
    changeAnimation(name) {
        this.animationName = name
    }
}