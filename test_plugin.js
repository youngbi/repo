const fs = require('fs');
const code = fs.readFileSync('./plugins/phimmoichill_plugin.js', 'utf8');
eval(code);

async function testFetch() {
    try {
        const detailResp = await fetch("https://phimmoichill.my/info/mua-em-ruc-ro-pm17173");
        const detailHtml = await detailResp.text();

        console.log(parseMovieDetail(detailHtml));
    } catch (e) {
        console.error(e);
    }
}
testFetch();
