window.paused = false
var blocks = []
const enableDebugMode = (enable, game) => {
    if (!enable) {
        return
    }
    window.addEventListener('keydown', (e) => {
        let k = e.key
        if (k === 'p') {
            window.paused = !window.paused
        } else if ('123456789'.includes(k)) {
            blocks = loadLevel(Number(k), game)
        }
    })
    //控制速度
    let m = document.querySelector('#id-input-fps')
    m.addEventListener('input', e => {
        var self = e.target
        window.fps = Number(self.value)
        if (window.fps === 0) {
            paused = true
        } else {
            paused = false
        }
    })
}

const __main = function () {
    var images = {
        bg: 'img/bg.png',
        pipe: 'img/pipe.png',
        ground: 'img/ground.png',
        bird1: 'img/bird1.png',
        bird2: 'img/bird2.png',
        bird3: 'img/bird3.png',
    }
    var game = Game.instance(30, images, function(game){
        // var s = SceneGame.new(game)
        var s = SceneTitle.new(game)
        game.runWithScene(s)
    })

    enableDebugMode(true, game)
}

__main()