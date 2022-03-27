function mapToChapter(html) {
    return JSON.stringify((new FastHTMLParser(html)).getElementById("comics").getElementsByTagName("img").map(e => "https://manga.in.ua" + e.getAttribute("data-src")));
}

function mapToConcreteView(html) {

    let doc = (new FastHTMLParser(html));

    let chapters = doc.getElementsByClassName('customajaxpagination_wrapper')
                        .map(e => e.getElementsByClassName('ltcitems')[0])
                        .map(e => e.getElementsByTagName('a')[0]
                        .getAttribute('href')).map(e => {
        return {
            uid: e.split('/')[4],
            pages: []
        };
    });

    doc.getElementsByClassName('customajaxpagination_wrapper')
            .map(e => e.getElementsByClassName('ltcitems')[0])
            .map(e => e.getElementsByTagName('a')[0].textContent)
            .forEach((e, i) => chapters[i].title = e);
    doc.getElementsByClassName('customajaxpagination_wrapper')
            .map(e => e.getElementsByClassName('ltcitems')[0])
            .map(e => e.getElementsByClassName('ltcright')[0].textContent)
            .forEach((e, i) => chapters[i].timestamp = e);



    return JSON.stringify({
        title: {
          pretty: doc.getElementsByClassName('UAname')[0].textContent,
          original: doc.getElementsByClassName('item__full-sidebar--description')[4].textContent
        },
        description: doc.getElementsByClassName('item__full-description')[0].textContent,
        cover: 'https://manga.in.ua' + doc.getElementsByClassName('item__full-sidebar--poster')[0].getElementsByTagName('img')[0].getAttribute('src'),
        tags: doc.getElementsByClassName('item__full-sidebar--description')[3].getElementsByTagName('a').map(e => e.textContent),
        chapters: chapters
      });

}

function mapToPage(html) {

    return JSON.stringify(
        (new FastHTMLParser(html))
        .getElementsByClassName('loadcomicsimages')[0].getElementsByTagName('img').map(e => 'https://manga.in.ua' + e.getAttribute('data-src')
        ));

}
function mapToGalleryView(html) {

    return JSON.stringify(
       (new FastHTMLParser(html))
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
                    .getAttribute('href').split('/').slice(4).reduce((a, v) => a += '/' + v );
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
                    let dataSrc =  e.getElementsByTagName('figure')[0]
                        .getElementsByTagName('img')[0].getAttribute('data-src')
                    if(!dataSrc) {
                        cover = getHost() + e.getElementsByTagName('figure')[0]
                        .getElementsByTagName('img')[0].getAttribute('src');
                    } else {
                    cover = getHost() + dataSrc;
                    }
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


function getPostEndpoints() {
    return JSON.stringify([
        {
            path: '/index.php?do=search',
            type: 'SEARCH',
            mappingFunctionName: 'mapToGalleryView',
            paths: [],
            parameters: [],
            payload: [
                {
                    name: 'do',
                    type: 'STATIC',
                    staticValue: 'search'
                },
                {
                    name: 'subaction',
                    type: 'STATIC',
                    staticValue: 'search'
                },
                {
                    name: 'full_search',
                    type: 'STATIC',
                    staticValue: '0'
                },
                {
                    name: 'story',
                    type: 'QUERY',
                },
                {
                    name: 'search_start',
                    type: 'PAGINATION'
                }
            ]
        }
    ]);
  }

function getGetEndpoints() {
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
            parameters: [],
            payload: []
        },
        {
            path: '/mangas/{id}',
            type: 'CONCRETE',
            mappingFunctionName: 'mapToConcreteView',
            paths: [
              {
                name: 'id',
                type: 'ID'
              }
            ],
            parameters: [],
            payload: []
        },
        {
            path: '/chapters/{id}',
            type: 'CHAPTER',
            options: {
                collectWithConcreteMapping: true
            },
            mappingFunctionName: 'mapToChapter',
            paths: [
              {
                name: 'id',
                type: 'ID'
              }
            ],
            parameters: [],
            payload: []
          },
    ]);
}

function getConfigInfo() {
    return JSON.stringify({
        name: "Manga/in/UA",
        logoUrl: "https://manga.in.ua/templates/MGinUA/images/logo.png",
        nsfw: false
    });
}
