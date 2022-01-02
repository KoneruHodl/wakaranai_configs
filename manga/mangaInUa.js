const lb = require('fast-html-dom-parser');

const FstHtmlPrsr = lb.FastHTMLParser;

function mapToConcreteView(html) {

    
}

function mapToGalleryView(html) {
    return JSON.stringify(new FstHtmlPrsr(html)
        .getElementsByClassName('movie').slice(0, -1)
        .map(e => {
            return {
                uid: e.getElementsByTagName('h3')[0].getElementsByTagName('a')[0]
                    .getAttribute('href').split('/')[5].split('-')[0],
                title: e.getElementsByTagName('h3')[0].getElementsByTagName('a')[0].textContent,
                cover: getHost() + e.getElementsByTagName('figure')[0]
                    .getElementsByTagName('img')[0].getAttribute('data-src')
            }
        }));
}

function getHost() {
    return 'https://manga.in.ua';
}

function getEndpoints() {
    return JSON.stringify([
        {
            path: '/mangas/page/{page}',
            type: 'GALLERY',
            mappingFunctionName: 'mapToGalleryView',
            paths: [
                {
                    name: 'page',
                    type: 'PAGINATION'
                }
            ],
            parameters: []
        }
    ]);
}

function getConfigInfo() {
    return JSON.stringify({
        name: "Manga/in/UA",
        logoUrl: "https://manga.in.ua/templates/MGinUA/images/logo.png",
        nsfw: false
    });
}