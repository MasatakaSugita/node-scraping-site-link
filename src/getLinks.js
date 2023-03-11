const request = require('request');
const cheerio = require('cheerio');
const isUrl = require('is-url');
const url = require('url');

const baseUrl = process.env.BASE_URL;

const searchedUrl = [];
const urls = [];

function getLinks(searchLink) {

  request(searchLink,(error, response, body) => {

    if (error) {
      console.log('error:',error);
      return false;
    }

    if (searchedUrl.includes(searchLink)) {
      return;
    }
    searchedUrl.push(searchLink);

    const $ = cheerio.load(body);
    const links = $('a');

    links.each((i, link) => {
      const href = $(link).attr('href');

      const absoluteUrl = url.resolve(baseUrl, href);
      const parsedUrl = url.parse(absoluteUrl);

      //パラメータは扱わない
      const searchParams = parsedUrl.search;
      let replaceHref = href.replace(searchParams,'');

      //記事の詳細は扱わない
      const indexOf = replaceHref.lastIndexOf('/');
      const lastPath = replaceHref.substring(indexOf + 1,replaceHref.length);
      if (!isNaN(lastPath)) {
        replaceHref = replaceHref.replace(replaceHref.slice(indexOf, replaceHref.length),'');
      }

      if (!urls.includes(replaceHref) && isUrl(replaceHref) && parsedUrl.host === url.parse(baseUrl).host) {
        urls.push(replaceHref);
        getLinks(replaceHref);
      }
    });

    console.dir(urls, {'maxArrayLength': null});
  });
}

getLinks(baseUrl);

