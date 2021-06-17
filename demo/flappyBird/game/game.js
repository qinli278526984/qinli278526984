class Game {
    constructor(fps, images, runcallback) {
        //images 是一个对象，里面是图片的名字和
        //程序在所有图片载入成功后运行
        window.fps = fps
        this.images = images
        this.runcallback = runcallback

        let canvas = document.getElementById('canvas')
        let ctx = canvas.getContext('2d')
        this.canvas = canvas
        this.ctx = ctx

        this.scene = null
        this.actions = {}
        this.keydowns = {}

        this.init()
    }
    static instance(...args) {
        this.i = this.i || new this(...args)
        return this.i
    }
    imageByName(name) {
        let img = this.images[name]
        return img
    }
    update() {
        this.scene.update()
    }
    draw() {
        this.scene.draw()
    }
    //registrAction
    registrAction(key, callback) {
        this.actions[key] = callback
    }

    drawImage(image) {
        this.ctx.drawImage(image.image, image.x, image.y, image.w, image.h)
    }
    runWithScene(s) {
        let self = this
        this.scene = s
        setTimeout(function() {
            self.runloop()
        }, 1000 / window.fps)
    }
    //timer
    runloop() {
        let self = this
        //events
        let actions = Object.keys(this.actions)
        for (let i = 0; i < actions.length; i++) {
            var key = actions[i]
            let status = this.keydowns[key]
            if (status === 'down') {
                //如果按键按下，调用注册的函数
                this.actions[key]('down')
            } else if(status === 'up') {
                this.actions[key]('up')
                this.keydowns[key] = null
            }
        }
        this.update()
        this.ctx.clearRect(0, 0, canvas.width, canvas.height)
        this.draw()
        //next run loop
        setTimeout(function () {
            self.runloop()
        }, 1000 / window.fps)
    }

    init() {
        //预先载入所有图片
        let self = this
        let loads = []
        let keys = Object.keys(this.images)
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i]
            let path = this.images[key]
            let img = new Image()
            img.src = path
            img.onload = function() {
                //存入 this.images 中
                self.images[key] = img
                loads.push(1)
                if (loads.length === keys.length) {
                    self.__start(self)
                    }
                }
        }
        //注册events
        window.addEventListener('keydown', function (event) {
            self.keydowns[event.key] = 'down'
        })
        window.addEventListener('keyup', event => {
            this.keydowns[event.key] = 'up'
        })
    }

    replaceScene(scene) {
        this.scene = scene
    }

    __start(self) {
        this.runcallback(self)
    }
}