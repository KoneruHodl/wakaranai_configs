async function mapToGalleryView(json) {
    let result = json.data;


    let array = result.map(async e => {

        let coverId = e.relationships.find(r => r.type === "cover_art");

        let cover = "";

        if (coverId) {
            cover = "https://uploads.mangadex.org/covers/" + e.id + "/" + (await (await fetch(getHost() + "/cover/" + coverId.id)).json()).data.attributes.fileName;
        }

        return {
            uid: e.id.toString(),
            title: e.attributes.title[Object.keys(e.attributes.title)[0]],
            cover: cover,
        };
    });

    console.log(await Promise.all(array));

    return JSON.stringify(array);
}

function getHost() {
    return 'https://api.mangadex.org';
}

function getPostEndpoints() {
    return JSON.stringify([]);
}

function getGetEndpoints() {
    return JSON.stringify([
        {
            path: '/manga',
            type: 'GALLERY',
            mappingFunctionName: 'mapToGalleryView',
            paths: [],
            options: {
                collectWithConcreteMapping: false,
                offsetDefaultIncrement: 10
            },
            parameters: [
                {
                    name: 'offset',
                    type: 'OFFSET'
                }
            ],
            payload: []
        },
        // {
        //     path: '/galleries/search',
        //     type: 'SEARCH',
        //     mappingFunctionName: 'mapToGalleryView',
        //     parameters: [
        //         {
        //             name: 'query',
        //             type: 'QUERY'
        //         },
        //         {
        //             name: 'page',
        //             type: 'PAGINATION'
        //         }
        //     ],
        //     paths: [],
        //     payload: []
        // },
        // {
        //     path: '/gallery/{id}',
        //     type: 'CONCRETE',
        //     mappingFunctionName: 'mapToConcreteView',
        //     paths: [
        //         {
        //             name: 'id',
        //             type: 'ID'
        //         }
        //     ],
        //     parameters: [],
        //     payload: []
        // }
    ]);
}

function getConfigInfo() {
    return JSON.stringify({
        name: "MangaDex",
        logoUrl: "https://mangadex.org/_nuxt/224793d3b16da1a3e970491b816cdc1f.svg",
        nsfw: false
    });
}

fetch("https://api.mangadex.org/manga").then(v => v.json()).then(v => mapToGalleryView(v));
