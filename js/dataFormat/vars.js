// variables used across the app

// node elements boxes
var bxs = exports.nodeElemBoxes = {
    nameCont: {x:0, y:0, w:100, h:25},
    typeCont: {x:99, y:2, w:45, h:22},
    plot: {x:0, y:0, w:315, h:65},
    space: 25
}

bxs.nameCont.y = bxs.plot.h/2 - bxs.nameCont.h/2 - 4
bxs.typeCont.x = bxs.nameCont.x + bxs.nameCont.w - 1
bxs.typeCont.y = bxs.nameCont.y + 2
bxs.typeCont.h = bxs.nameCont.h - 4

bxs.plot.x = bxs.typeCont.x + bxs.typeCont.w + bxs.space

bxs.size = [bxs.plot.x, bxs.plot.y + bxs.plot.h]

exports.margins = {
    plot: {t:7, b:7, l:0, r:35}
}