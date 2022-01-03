

function mapToConcreteView(html) {


}

function mapToGalleryView(html) {

    return JSON.stringify(
        new (require('fast-html-dom-parser')).FastHTMLParser(html)
            .getElementsByClassName('movie').slice(0, -1)
            .map(e => {

                let uid = null;
                let title = null;
                let cover = null;

                if (e.getElementsByTagName('h3')[0] == undefined ||
                    e.getElementsByTagName('h3')[0].getElementsByTagName('a')[0] == undefined ||
                    e.getElementsByTagName('h3')[0].getElementsByTagName('a')[0].getAttribute('href') == undefined) {
                    uid = '';
                } else {
                    uid = e.getElementsByTagName('h3')[0].getElementsByTagName('a')[0]
                        .getAttribute('href').split('/')[5].split('-')[0]
                }

                if (e.getElementsByTagName('h3')[0] == undefined ||
                    e.getElementsByTagName('h3')[0].getElementsByTagName('a')[0] == undefined) {
                    title = '';
                } else {
                    title = e.getElementsByTagName('h3')[0].getElementsByTagName('a')[0].textContent;
                }

                if (e.getElementsByTagName('figure')[0] == undefined ||
                    e.getElementsByTagName('figure')[0].getElementsByTagName('img')[0] == undefined ||
                    e.getElementsByTagName('figure')[0]
                        .getElementsByTagName('img')[0].getAttribute('data-src') == undefined
                ) {
                    cover = '';
                } else {
                    cover = getHost() + e.getElementsByTagName('figure')[0]
                        .getElementsByTagName('img')[0].getAttribute('data-src')
                }

                return {
                    uid: uid,
                    title: title,
                    cover: cover
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
