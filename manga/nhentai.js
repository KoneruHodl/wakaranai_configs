function mapToConcreteView(json) {
  let item = JSON.parse( json.replace(/\\n/g, "\\n")  
      .replace(/\\'/g, "\\'")
      .replace(/\\"/g, '\\"')
      .replace(/\\&/g, "\\&")
      .replace(/\\r/g, "\\r")
      .replace(/\\t/g, "\\t")
      .replace(/\\b/g, "\\b")
      .replace(/\\f/g, "\\f")
      .replace(/	/g, ""));

      let title = {
        pretty: "",
        original: ""
      };


      if(item.title) {
          if(item.title.pretty) {
            title.pretty = item.title.pretty;
          } 
          
          if(item.title.japanese) {
            title.original = item.title.japanese;
          }
          else if(item.title.english) {
            title.original = item.title.english;
          }
      }


  return JSON.stringify({
    title: title,
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
  let result = JSON.parse( json.replace(/\\n/g, "\\n")  
      .replace(/\\'/g, "\\'")
      .replace(/\\"/g, '\\"')
      .replace(/\\&/g, "\\&")
      .replace(/\\r/g, "\\r")
      .replace(/\\t/g, "\\t")
      .replace(/\\b/g, "\\b")
      .replace(/\\f/g, "\\f")
      .replace(/	/g, "")).result;
  return JSON.stringify(result.map(e => {

    let title = "";

    if(e.title) {
      if(e.title.pretty) {
        title = e.title.pretty;
      } else if(e.title.japanese) {
        title = e.title.japanese;
      } else if(e.title.english) {
        title = e .title.english;
      } 
    }

    return {
      uid: e.id.toString(),
      title: title,
      cover: 'https://t5.nhentai.net/galleries/' +
        e.media_id +
        '/thumb.' +
        getImageType(e.images.thumbnail.t),
    };
  }));
}

function getHost() {
  return 'https://nhentai.net/api';
}

function getPostEndpoints() {
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
      payload: []
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
      payload: []
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
      payload: []
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