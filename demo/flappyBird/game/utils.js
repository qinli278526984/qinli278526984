const e = element => {
    return document.querySelector(element)
}

var log = console.log.bind(log)


const imageFromPath = path => {
    let image = new Image()
    image.src = path
    return image
}

const rectItersects = (a, b) => {
    if (Math.min(a.x + a.w, b.x + b.w) >= Math.max(a.x, b.x) && Math.max(a.y - a.h, b.y - b.h) <= Math.min(a.y, b.y)) {
        return true 
    }
    return false
}

const es = sel => document.querySelectorAll(sel)

const bindAll = function(sel, eventName, callback) {
    let l = es(sel)
    for (let i = 0; i < l.length; i++) {
        let e = l[i]
        e.addEventListener(eventName, event => {
            callback(event)
        })
    }
}