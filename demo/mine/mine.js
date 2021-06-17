const log = console.log.bind(console)

const es = function(selector) {
    let elements = document.querySelectorAll(selector)
    if (elements.length === 0) {
        let s = `元素没找到, 选择器 ${selector} 错误`
        alert(s)
        //
        return []
    } else {
        return elements
    }
}

const e = function(selector) {
    let element = document.querySelector(selector)
    if (element === null) {
        let s = `元素没找到, 选择器 ${selector} 错误`
        alert(s)
        //
        return null
    } else {
        return element
    }
}

let numberColors = ['#3498db', '#2ecc71', '#e74c3c', '#9b59b6', '#f1c40f', '#1abc9c', '#34495e', '#7f8c8d',]
let endscreenContent = {win: '<span>✔</span> you won!', loose: '💣 Booom! Game over.'}
let gameOver = false

const random01 = function() {
    let n = Math.random()
    n = n * 10
    n = Math.floor(n)
    return n % 2
}

const randomLine01 = function(n) {
    let l = []
    for (let i = 0; i < n; i++) {
        let r = random01()
        l.push(r)
    }
    return l
}

const randomLine09 = function(n) {
    let line = randomLine01(n)
    for (let i = 0; i < line.length; i++) {
        if (line[i] === 1) {
            line[i] = 9
        }
    }
    return line
}

const randomSquare09 = function(n) {
    let square = []
    for (let i = 0; i < n; i++) {
        square.push(randomLine09(n))
    }
    return square
}

const clonedArray = function(array) {
    let l = []
    for (let i = 0; i < array.length; i++) {
        l.push(array[i])
    }
    return l
}

const clonedSquare = function(array) {
    let square = []
    for (let i = 0; i < array.length; i++) {
        let line = array[i]
        let l = clonedArray(line)
        square.push(l)
    }
    return square
}

const plus1 = function(array, x, y) {
    let n = array.length
    if (x >= 0 && x < n && y >= 0 && y < n) {
        if (array[x][y] !== 9) {
            array[x][y] += 1
        }
    }
}

const markAround = function(array, x, y) {
    if (array[x][y] === 9) {
        // 先标记上边 3 个
        plus1(array, x - 1, y - 1)
        plus1(array, x - 1, y)
        plus1(array, x - 1, y + 1)
        // 标记中间  2 个
        plus1(array, x, y - 1)
        plus1(array, x, y + 1)
        // 标记下边 3 个
        plus1(array, x + 1, y - 1)
        plus1(array, x + 1, y)
        plus1(array, x + 1, y + 1)
    }
}

const markedSquare = function(array) {
    let square = clonedSquare(array)
    for (let i = 0; i < square.length; i++) {
        let line = square[i]
        for (let j = 0; j < line.length; j++) {
            markAround(square, i, j)
        }
    }
    return square
}

const bindAll = function(elements, eventName, callback) {
    for (let i = 0; i < elements.length; i++) {
        let tag = elements[i]
        tag.addEventListener(eventName, callback)
    }
}

const templateCell = function(line, x) {
    let html = ''
    for (let i = 0; i < line.length; i++) {
        html += `<td class="cell" data-number="${line[i]}" data-x="${x}" data-y="${i}">${line[i]}</td>`
    }
    return '<tr class="row-clearfix">' + html + '</tr>'
}

const templateRow = function(square) {
    let html = ''
    for (let i = 0; i < square.length; i++) {
        html += templateCell(square[i], i)
    }
    return html
}

const renderSquare = function(square) {
    let html = templateRow(square)
    let s = e('#id-div-mine')
    s.innerHTML = html
}

const bindEventDelegate = function(square) {
    let cells = es('.cell')
    bindAll(cells, 'click', function(event) {
        let cell = event.target
        vjkl(cell, square)
    })
    bindAll(cells, 'contextmenu', (event) => {
        event.preventDefault()
        let cell = event.target
        if (!cell.classList.contains('opened')) {
            cell.classList.toggle('flag')
            cell.innerHTML = '🚩'
        }
    })
}

const findOpened = function() {
    let s = es('.cell')
    for (let i = 0; i < s.length; i++) {
        if (s[i].classList.contains('opened')) {
            return false
        }
    }
    return true
}

const ditu = function() {
    let square = randomSquare09(9)
    square = markedSquare(square)
    renderSquare(square)
    bindEventDelegate(square)
    bindEventButton()
    return square
}

const shouTime = function() {
    if (findOpened()) {
        let time = 0
        const Interval = setInterval(function() {
            let currentTime = e('.currentTime')
            time += 1
            let s = `${time}`
            let t = '000'
            t = t.slice(0, t.length - s.length)
            currentTime.innerHTML = t + `${time}`
    }, 1000)
    }
}

const vjkl = function(cell, square) {
    let n = cell.dataset.number
    let x = cell.dataset.x
    let y = cell.dataset.y
    let index = findOpened()
    if (n !== '0' && index) {
        while (true) {
            let s = ditu()
            if (s[x][y] === 0) {
                shouTime()
                let i = e(`[data-x = '${x}'][data-y = '${y}']`)
                i.classList.add('opened')
                i.classList.add('noshow')
                vjklAround(square, x, y)
                break
            }
        }
    } else {
        if (gameOver) {
            return
        }
        if (n === '9') {
            cell.classList.add('opened')
            let s = es(`[data-number = '9']`)
            for (let i = 0; i < s.length; i++) {
                s[i].classList.add('mine')
                s[i].innerHTML = '💣'
            }
            let end = e('.endscreen')
            let currentTime = e('.currentTime')
            clearInterval(1)
            end.innerHTML = endscreenContent.loose + `用时${currentTime.innerHTML}秒`
            end.classList.add('show')
            gameOver = true
            // setTimeout(function() {
            //     alert(`Game Over,所用时间是${currentTime.innerHTML}秒`)
            //     window.location.reload()
            // },100)
        } else if (n === '0') {
            cell.classList.add('opened')
            cell.classList.add('noshow')
            let x = cell.dataset.x
            let y = cell.dataset.y
            vjklAround(square, x, y)
        } else {
            if (gameOver) {
                return
            }
            cell.classList.add('opened')
            cell.style.color = numberColors[n - 1]
        }
    }
}

const vjklAround = function(square, x1, y1) {
    let x = Number(x1)
    let y = Number(y1)
    vjkl1(square, x - 1, y - 1)
    vjkl1(square, x - 1, y)
    vjkl1(square, x - 1, y + 1)

    vjkl1(square, x, y - 1)
    vjkl1(square, x, y + 1)

    vjkl1(square, x + 1, y - 1)
    vjkl1(square, x + 1, y)
    vjkl1(square, x + 1, y + 1)
}

const vjkl1 = function(square, x, y) {
    if (x >= 0 && x < square.length && y >= 0 && y < square.length) {
        let cell = e(`[data-x = '${x}'][data-y = '${y}']`)
        if (cell.classList.contains('opened') || cell.dataset.number === '9') {
            return
        } else if(cell.dataset.number === '0') {
            cell.classList.add('opened')
            cell.classList.add('noshow')
            vjklAround(square, x, y)
        } else {
            cell.classList.add('opened')
            let n = cell.dataset.number
            cell.style.color = numberColors[n - 1]
        }
    }
}

const bindEventButton = function() {
    let b = e('#again')
    b.addEventListener('mousedown', () => {
        b.innerHTML = '😮'
    })
    b.addEventListener('mouseup',function() {
        gameOver = false
        let end = e('.endscreen')
        end.classList.remove('show')
        window.location.reload()
    })
}

const __main = function () {
    ditu()
}

__main()