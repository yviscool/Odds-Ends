/**
 *  get the tile.json of the metro (chrome extenstion)
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const Stream = require('stream');

const TILES_PATH =
        os.platform() === 'win32'
        ? path.join(os.homedir(), "Desktop", `tiles.json`)
        : path.join(os.homedir(), `tiles.json`);

const CONFIG_PATH = 
        os.platform() === 'win32'
        ? path.join(os.homedir(), "Desktop", `config.json`)
        : path.join(os.homedir(), `config.json`);

const source = ''; /*网页源代码*/

const ts = Stream.Transform({ objectMode: true });
const ws = Stream.Writable({ objectMode: true });

const pattern = /a.*?id="(.*?)".*?href="(.*?)".*?data-ancho="(.*?)".*?data-alto="(.*?)".*?&quot;(.*?)&quot.*?background-color:(.*?);".*?class="etiqueta".*?>(.*?)<\/div><\/a>/gi;

fs.appendFileSync(TILES_PATH, '[');

ws._write = function (json, enc, next) {
    json.orden ? fs.appendFileSync(TILES_PATH, ',') : function(){};
    fs.appendFileSync(TILES_PATH, JSON.stringify(json));
    next();
}

ws.on('finish', () => {
    fs.appendFileSync(TILES_PATH, ']')
});


source
    .match(pattern)
    .forEach((str, index) => {
        const config = {
            link: '',
            html: '',
            icono: '',
            hashid: '',
            bgcolor: '',
            etiqueta: '', /*标签*/
            bloque: '', /*滚动方块*/
            dimens: [], /*标签规格*/
            orden: 0, /*排序*/
            livetile: false,
        }
        str.match(pattern);
        config.orden    = index;
        config.bloque   = 'social';
        config.hashid   = RegExp.$1;
        config.link     = RegExp.$2;
        config.icono    = RegExp.$5;
        config.bgcolor  = RegExp.$6;
        config.etiqueta = RegExp.$7;
        config.link     === "http://time.is/" && (config.spfunc = {}) && (config.spfunc.preload = 'hora');
        config.dimens.push(RegExp.$3);
        config.dimens.push(RegExp.$4);
        ts.push(config);
});

ts.push(null);
ts.pipe(ws);
