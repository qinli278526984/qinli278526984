window.paused = false
window.score = 0

class Pipes {
    constructor(game) {
        this.game = game
        this.pipes = []
        this.pipeSpace = 150
        this.space = 200
        this.numberOfPipes = 3
        for (let i = 0; i < this.numberOfPipes; i++) {
            let p1 = GameImage.new(game, 'pipe')
            p1.flipY = true
            p1.x = 500 + i * 200
            let p2 = GameImage.new(game, 'pipe')
            p2.x = p1.x
            this.resetPipePosition(p1, p2)
            this.pipes.push(p1)
            this.pipes.push(p2)
        }
    }
    static new(game) {
        return new this(game)
    }
    resetPipePosition(p1, p2) {
        p1.y = randomBetween(-500, -150)
        p2.y = p1.y + +p1.h + this.pipeSpace
    }
    debug() {
        this.pipeSpace = config.pipe_space.value
        this.space = config.pipe_rowspace.value
    }
    update() {
        if (window.paused) {
            return
        }
        for (let i = 0; i < this.pipes.length / 2; i++) {
            let p1 = this.pipes[i*2]
            let p2 = this.pipes[i*2 + 1]
            p1.x -= 1
            p2.x -= 1
            if (p1.x < -100) {
                p1.x += this.space * this.numberOfPipes
            }
            if (p2.x < -100) {
                p2.x += this.space * this.numberOfPipes
                this.resetPipePosition(p1, p2)
            }
        }
    }
    draw() {
        let context = this.game.ctx
        for (let p of this.pipes) {
            context.save()

            let w2 = p.w / 2
            let h2 = p.h / 2
            context.translate(p.x + w2, p.y + h2)
            let scaleX = 1
            let scaleY = p.flipY ? -1 : 1
            context.scale(scaleX, scaleY)
            context.rotate(this.rotation * Math.PI / 180)
            context.translate(-w2, -h2)
            context.drawImage(p.image, 0, 0, p.w, p.h)
    
            context.restore()
        }
    }
}
class SceneTitle extends GameScene {
    constructor(game) {
        super(game)
        let bg = GameImage.new(game, 'bg')
        this.addelement(bg)
        //pipe
        this.pipe = Pipes.new(game)
        this.addelement(this.pipe)

        let ground = GameImage.new(game, 'ground')
        this.ground = ground
        ground.x = 0
        ground.y = 600
        this.addelement(ground)
        this.skipCount = 5

        let b = GameAnimation.new(game)
        b.x = 200
        b.y = 200
        this.b = b
        this.addelement(b)

        let label = GameLabel.new(game, `分数：0`)
        this.label = label
        this.addelement(label)
        this.setupInputs()
    }

    draw() {
        super.draw()
    }
    update() {
        super.update()
        if (window.paused) {
            return
        }
        let ps = this.pipe.pipes
        for (let i = 0; i < ps.length / 2; i++) {
            let p = ps[i * 2 + 1]
            if (p.in && this.b.x > p.x + p.w) {
                window.score += 10
                this.label.text = `分数：${window.score}`
                p.in = false
            }
            if (p.collide(this.b)) {
                var s = new SceneEnd(this.game)
                this.game.replaceScene(s)
            }
        }
        this.skipCount--
        let offset = 4
        if (this.skipCount === 0) {
            this.skipCount = 5
            offset = -(this.skipCount - 1) * offset
        }
        let g = this.ground
        g.x -= offset
    }
    setupInputs() {
        var game = this.game
        game.registrAction('a', (keyStatus) => {
            this.b.move(-this.b.speed, keyStatus)
        })
        game.registrAction('d', (keyStatus) => {
            this.b.move(this.b.speed, keyStatus)
        })
        game.registrAction('j', (keyStatus) => {
            this.b.jump()
        })
        let enableDrag = false
        let ball = this.b
        if (enableDrag) {
            game.canvas.addEventListener('mousedown', e => {
                let x = e.offsetX
                let y = e.offsetY
                //检查是否点中ball
                if (ball.hasPoint(x, y)) {
                    enableDrag = true
                }
            })
            game.canvas.addEventListener('mousemove', e => {
                let x = e.offsetX
                let y = e.offsetY
                if (enableDrag) {
                    ball.x = x
                    ball.y = y
                }
            })
            game.canvas.addEventListener('mouseup', e => {
                enableDrag = false
            })
        }

    }
}