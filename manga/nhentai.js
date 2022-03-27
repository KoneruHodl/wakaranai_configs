function mapToConcreteView(json) {
  let item = JSON.parse(json.replaceAll(/	/gi, '')).result;
  return JSON.stringify({
    title: {
      pretty: item.title.pretty,
      original: item.title.japanese
    },
    description: '',
    cover: 'https://t5.nhentai.net/galleries/' +
      item.media_id +
      '/cover.' +
      getImageType(item.images.cover.t),
    tags: item.tags.map(e => e.name),
    chapters: [
      {
        uid: item.media_id,
        title: 'Chapter 1',
        pages: item.images.pages.map((e, index) => 'https://i.nhentai.net/galleries/'
          + item.media_id +
          '/' + index + '.' + getImageType(e.t)),
        timestamp: item.upload_date.toString() + '000'
      }
    ]
  });
}

function mapToGalleryView(json) {
  let result = JSON.parse(json.replaceAll(/	/gi, '')).result;
  return JSON.stringify(result.map(e => {
    return {
      uid: e.id.toString(),
      title: e.title.pretty,
      cover: 'https://t5.nhentai.net/galleries/' +
        e.media_id +
        '/thumb.' +
        getImageType(e.images.thumbnail.t),
    }
  }))
}

function getHost() {
  return 'https://nhentai.net/api';
}

function getPostEndpoitns() {
  return JSON.stringify([

  ]);
}

function getGetEndpoints() {
  return JSON.stringify([
    {
      path: '/galleries/all',
      type: 'GALLERY',
      mappingFunctionName: 'mapToGalleryView',
      paths: [],
      parameters: [
        {
          name: 'page',
          type: 'PAGINATION'
        }
      ],
      payloads: []
    },
    {
      path: '/galleries/search',
      type: 'SEARCH',
      mappingFunctionName: 'mapToGalleryView',
      parameters: [
        {
          name: 'query',
          type: 'QUERY'
        },
        {
          name: 'page',
          type: 'PAGINATION'
        }
      ],
      paths: [],
      payloads: []
    },
    {
      path: '/gallery/{id}',
      type: 'CONCRETE',
      mappingFunctionName: 'mapToConcreteView',
      paths: [
        {
          name: 'id',
          type: 'ID'
        }
      ],
      parameters: [],
      payloads: []
    }
  ]);
}

function getConfigInfo() {
  return JSON.stringify({
    name: "NHentai",
    logoUrl: "https://nhentai.to/img/logo.650c98bbb08e.svg",
    nsfw: true
  });
}

function getImageType(type) {
  if (type === 'p') {
    return 'png';
  } else if (type === 'j') {
    return 'jpg';
  } else if (type === 'g') {
    return 'gif';
  }
}