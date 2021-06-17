const log = console.log.bind(console)

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
    let s = e('#id-table-2048')
    s.innerHTML = html
}

const random = function(square) {
    let cells = es(`[data-number = '0']`)
    let index = true
    // log('random')
    while (index) {
        let n = Math.random()
        n = n * cells.length
        n = Math.floor(n) % cells.length
        let cell = cells[n]
        cell.dataset.number = '2'
        cell.innerHTML = '2'
        let x1 = Number(cell.dataset.x)
        let y1 = Number(cell.dataset.y)
        let m = Math.random() * 10
        m = Math.floor(m) % 2
        log(m)
        if (m === 0) {
            square[x1][y1] = 2
        }
        if (m === 1) {
            square[x1][y1] = 4
        }
        index =false
    }
    renderSquare(square)
}
//判断能否左移
const canLeft = function(square) {
    for (let i = 0; i < square.length; i++) {
        for (let j = 0; j < square.length; j++) {
            if (square[i][j] !== 0 && j !== 0) {
                if (square[i][j - 1] === 0 || square[i][j - 1] === square[i][j]) {
                    return true
                }
            }
        }
    }
    return false
}

const moveLeft = function(square){
    if (canLeft(square) === false) {
        return false
    }
    for (let i = 0; i < square.length; i++) {
        for (let j = 0; j < square.length; j++) {
            if (square[i][j] !== 0) {
                // log(i, j)
                for (let k = 0; k < j ; k++) {
                    if (square[i][k] === 0) {
                        if (square[i][k] !== square[i][j]) {
                            square[i][k] = square[i][j]
                            square[i][j] = 0
                        } 
                        if (square[i][k - 1] === square[i][k]){
                            square[i][k - 1] += square[i][k]
                            square[i][k] = 0
                        }
                    }
                }
                if (square[i][j - 1] === square[i][j]) {
                    square[i][j - 1] += square[i][j]
                    square[i][j] = 0
                }
            }
        }
    }
    renderSquare(square)
    random(square)
}

//判断能否右移
const canRight = function(square) {
    let n = square.length
    for (let i = 0; i < n; i++) {
        for (let j = n - 1; j >= 0; j--) {
            if (square[i][j] !== 0 && j !== n - 1) {
                if (square[i][j + 1] === 0 || square[i][j + 1] === square[i][j]) {
                    return true
                }
            }
        }
    }
    return false
}

const moveRight  = function(square){
    if (canRight(square) === false) {
        return false
    }
    let n = square.length
    for (let i = 0; i < n; i++) {
        for (let j = n - 1; j >= 0; j--) {
            if (square[i][j] !== 0) {
                // log(i, j)
                for (let k = n - 1; k >= 0 ; k--) {
                    if (square[i][k] === 0) {
                        if (square[i][k] !== square[i][j]) {
                            square[i][k] = square[i][j]
                            square[i][j] = 0
                        } 
                        if (square[i][k + 1] === square[i][k]){
                            square[i][k + 1] += square[i][k]
                            square[i][k] = 0
                        }
                    }
                }
                if (square[i][j + 1] === square[i][j]) {
                    square[i][j + 1] += square[i][j]
                    square[i][j] = 0
                }
            }
        }
    }
    renderSquare(square)
    random(square)
}

//判断能否上移
const canUp = function(square) {
    for (let i = 0; i < square.length; i++) {
        for (let j = 0; j < square.length; j++) {
            if (square[i][j] !== 0 && i !== 0) {
                if (square[i - 1][j] === 0 || square[i - 1][j] === square[i][j]) {
                    return true
                }
            }
        }
    }
    return false
}

const moveUp = function(square){
    if (canUp(square) === false) {
        return false
    }
    for (let i = 0; i < square.length; i++) {
        for (let j = 0; j < square.length; j++) {
            // log(`i:${i}, j:${j}`, square[i][j] )
            if (square[j][i] !== 0) {
                // log(`i:${i}, j:${j}`, square[i][j] )
                for (let k = 0; k < j ; k++) {
                    // log('k', k, i,)
                    if (square[k][i] === 0) {
                        if (square[k][i] !== square[j][i]) {
                            square[k][i] = square[j][i]
                            square[j][i] = 0
                        } 
                        if (k > 0) {
                            if (square[k - 1][i] === square[k][i]){
                                square[k - 1][i] += square[k][i]
                                square[k][i] = 0
                            }
                        }
                    }
                }
                if (j > 0) {
                    if (square[j - 1][i] === square[j][i]) {
                        square[j - 1][i] += square[j][i]
                        square[j][i] = 0
                    }
                }
            }
        }
    }
    renderSquare(square)
    random(square)
}

//判断能否下移
const canDown = function(square) {
    let n = square.length
    for (let j = 0; j < n; j++) {
        for (let i = n - 1; i >= 0; i--) {
            if (square[i][j] !== 0 && i !== n - 1) {
                if (i < n - 1) {
                    if (square[i + 1][j] === 0 || square[i + 1][j] === square[i][j]) {
                        return true
                    }
                }
            }
        }
    }
    return false
}

const moveDown = function(square){
    if (canDown(square) === false) {
        return false
    }
    let n = square.length
    for (let i = 0; i < square.length; i++) {
        for (let j = 0; j < square.length; j++) {
            // log(`i:${i}, j:${j}`, square[i][j] )
            if (square[i][j] !== 0) {
                for (let k = n - 1; k > i ; k--) {
                    // log('k', k, i, j)
                    if (square[k][j] === 0) {
                        if (square[k][j] !== square[i][j]) {
                            square[k][j] = square[i][j]
                            square[i][j] = 0
                        }
                    }
                         if (k < n - 1) {
                             if (square[k + 1][j] === square[k][j]){
                                 square[k + 1][j] += square[k][j]
                                 square[k][j] = 0
                             }
                        }
                }
            }
            // log('fuck')
            if (i < n - 1) {
                // log('fuck')
                if (square[i + 1][j] === square[i][j]) {
                    square[i + 1][j] += square[i][j]
                    square[i][j] = 0
                }
            }
        }
    }
    renderSquare(square)
    random(square)
}

const bindEventMove = function(square) {
    window.addEventListener('keydown', element => {
        let k = element.key
        if (!canMove(square)) {
            setTimeout(function() {
                alert(`Game Over`)
                window.location.reload()
            },100)
        }
        let cells = es('.cell')
        for (let i = 0; i < cells.length; i++) {
            if (cells[i].dataset.number === '2048') {
                setTimeout(function() {
                    alert(`You Win`)
                    window.location.reload()
                },100)
            }
        }
        let ele = e('#arrow')
        if (k === 'ArrowLeft') {
            ele.classList.remove('left')
            ele.classList.remove('right')
            ele.classList.remove('up')
            ele.classList.remove('dpwn')
            ele.classList.add('left')
            moveLeft(square)
        }
        if (k === 'ArrowRight') {
            ele.classList.remove('left')
            ele.classList.remove('right')
            ele.classList.remove('up')
            ele.classList.remove('down')
            ele.classList.add('right')
            moveRight(square)
        }
        if (k === 'ArrowUp') {
            ele.classList.remove('left')
            ele.classList.remove('right')
            ele.classList.remove('up')
            ele.classList.remove('down')
            ele.classList.add('up')
            moveUp(square)
            // log(canUp(square))
        }
        if (k === 'ArrowDown') {
            ele.classList.remove('left')
            ele.classList.remove('right')
            ele.classList.remove('up')
            ele.classList.remove('down')
            ele.classList.add('down')
            moveDown(square)
        }
    })
}

const canMove = function(square){
    return canDown(square) || canUp(square) || canLeft(square) || canRight(square)
}

const bindEventButton = function() {
    let b = e('#again')
    b.addEventListener('click',function() {
        window.location.reload()
    })
}

const __main = function() {
    let square = [
        [0, 0, 0, 0,],
        [0, 0, 0, 0,],
        [0, 0, 0, 0,],
        [0, 0, 0, 0,],
    ]
    renderSquare(square)
    random(square)
    random(square)
    bindEventMove(square)
    bindEventButton()
}

__main()