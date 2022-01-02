function mapToConcreteView(html) {

}

function mapToGalleryView(html) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(html, 'text/html');
    let content = Array.from(doc.querySelectorAll('#dle-content > .movie'));
    return content.map(e => {
        return {
            uid: e.querySelector('h3 > a').getAttribute('href').split('/')[5].split('-')[0],
            title: e.querySelector('h3 > a').textContent,
            cover: getHost() + e.querySelector('figure > img').getAttribute('data-src')
        }
    });
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