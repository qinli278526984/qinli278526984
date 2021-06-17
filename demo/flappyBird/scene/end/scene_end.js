class SceneEnd extends GameScene {
    constructor(game) {
        super(game)
        game.registrAction('r', () => {
            var s = SceneTitle.new(game)
            game.replaceScene(s)
        })
    }

    draw = function() {
        //draw labels
        this.game.ctx.font = '15px serif'
        this.game.ctx.fillText(`游戏结束,按r返回游戏`, 200, 200)
    }
}