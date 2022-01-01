function mapGalleryResultToJson(json) {
  let result = JSON.parse(json).result;
  return JSON.stringify(result.map(e => {
    return {
      title: e.title.pretty,
      thumbnailUrl: 'https://t5.nhentai.net/galleries/' +
        e.mediaId +
        '/thumb.' +
        getImageType(e.images.thumbnail.t),
      coverUrl: 'https://t5.nhentai.net/galleries/' +
        e.mediaId +
        '/cover.' +
        getImageType(e.images.cover.t),
      tags: e.tags.map(e => e.name),
      pagesUrl: e.images.pages.map((e, index) => 'https://t5.nhentai.net/galleries/' +
        e.mediaId +
        '/' + index + 't.' + getImageType(e.t)),
      sourceUrl: e.images.pages.map((e, index) => 'https://i.nhentai.net/galleries/' +
        e.mediaId +
        '/' + index + '.' + getImageType(e.t)),
    };
  }));
}

function getHost() {
  return 'https://nhentai.net/api';
}

function getEndpoints() {
  return JSON.stringify([
    {
      path: '/galleries/all',
      mappingFunctionName: 'mapGalleryResultToJson',
      parameters: [
        {
          name: 'page',
          type: 'PAGINATION'
        }
      ]
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