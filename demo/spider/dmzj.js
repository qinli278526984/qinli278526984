const fs = require('fs')

const request = require('syncrequest')
const cheerio = require('cheerio')

const log = console.log.bind(console)


class Comic {
    constructor() {
        this.ranking = ''
        this.update = ''
        this.name = ''
        this.state = ''
        this.author = ''
        this.class = ''
        this.theme = ''
        this.coverUrl = ''
    }
}

const comicFromDiv = (div) => {
    let e = cheerio.load(div)
    let comic = new Comic()

    comic.ranking = e('.righter-no').text()
    comic.name = e('.title').text()
    comic.update = e('.righter-mr').first().find('span').eq(1).text()
    if (comic.update === '') {
        comic.update = '无'
    }
    comic.author = e('.righter-text').find('p').eq(1).find('span').eq(0).text()
    comic.state = e('.righter-text').find('p').eq(1).find('span').eq(1).text()
    comic.class = e('.righter-text').find('p').eq(1).find('span').eq(2).text()
    comic.theme = e('.righter-text').find('p').eq(1).find('span').eq(3).text()

    let pic = e('.righter-img')
    comic.coverUrl = pic.find('img').attr('src')

    return comic
}

const ensurePath = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir)
    }
}

const cachedUrl = (url) => {
    let dir = 'cached_html'
    ensurePath(dir)
    let name = url.split('-')[2]
    let cacheFile = ''
    if (name === undefined) {
        cacheFile = `${dir}/1-shtml.html`
    } else {
        name = name.split('.').join('-')
        cacheFile = `${dir}/${name}.html`
    }
    let exists = fs.existsSync(cacheFile)
    if (exists) {
        let data = fs.readFileSync(cacheFile)
        return data
    } else {
        let r = request.get.sync(url)
        let body = r.body

        fs.writeFileSync(cacheFile, body)
        return body
    }
}

const comicsFromUrl = (url) => {
    let body = cachedUrl(url)
    let e = cheerio.load(body)
    let comicDivs = e('.middlerighter')

    log('length', comicDivs.length)
    let comics = []
    for (let i = 0; i < comicDivs.length; i++) {
        let div = comicDivs[i]
        let m = comicFromDiv(div)
        comics.push(m)
    }
    return comics
}

const saveComic = (comics) => {
    let s = JSON.stringify(comics, null, 2)
    let path = 'dmzj.json'
    fs.writeFileSync(path, s)
}

// const downloadCovers = (comics) => {
//     let dir = 'cover'
//     ensurePath(dir)
//     for (let i = 0; i < 1; i++) {
//         let c = comics[i]
//         let url = c.coverUrl
//         let ranking = c.ranking
//         let name = c.name
//         let file = dir + '/' + ranking + '_' + name + '.jpg'
//         request.sync(url, {
//             pipe: file,
//         })
//     }
// }

const __main = () => {
    let comics = []
    console.time('dmzj')
    for (let i = 0; i < 10; i++) {
        let url = ''
        if (i === 0) {
            url = `https://manhua.dmzj.com/rank/`
        } else {
            url = `https://manhua.dmzj.com/rank/total-block-${i + 1}.shtml`
        }
        log(url)
        let comicsInPage = comicsFromUrl(url)
        comics = [...comics, ...comicsInPage]
    }
    log('comic length', comics.length)
    console.timeEnd('dmzj')
    saveComic(comics)
    // downloadCovers(comics)
    log('抓取成功, 数据已经写入到 dmzj.json 中')
}

__main()
