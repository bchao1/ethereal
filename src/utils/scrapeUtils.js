const rp = require("request-promise");
const $ = require("cheerio");

async function getUrlMetaData(url){
    try{
        const html = await rp(url);
        const metas = $("meta", html);
        const links = $("link", html);
        const Url = new URL(url)

        const result = {
            description: "No description",
            icon: '/images/icon.jpg',
            shortUrl: "No short URL",
            title: 'New Bookmark'
        }

        for(let i = 0; i < metas.length; ++i){
            if(metas[i].attribs.name){
                if(metas[i].attribs.name.toLowerCase().includes("description")){
                    result["description"] = metas[i].attribs.content;
                    break;
                }
            }
        }

        for(let i = 0; i < metas.length; ++i){
            if(metas[i].attribs.property){
                if(metas[i].attribs.property.toLowerCase().includes('og:site_name')){
                    result["title"] = metas[i].attribs.content;
                    break;
                }
            }
        }
            //console.log(links);
        for(let i = 0; i < links.length; ++i){
            if(links[i].attribs.rel){
                if(links[i].attribs.rel.toLowerCase().includes("icon")){
                    result["icon"] = links[i].attribs.href;
                    // Is relative path
                    if(result["icon"][0] === '/') result["icon"] = url + result["icon"].substring(1);
                    break;
                }
            }
        }

        result['shortUrl'] = Url.hostname
        return result;
    }
    catch(err){
        console.log(err);
        return {
            description: `Please delete - ${url}`,
            icon:'https://d1nhio0ox7pgb.cloudfront.net/_img/g_collection_png/standard/256x256/sign_forbidden.png',
            shortUrl: '',
            title:'URL doesn\'t exist!!'
        }
    }
}

export {getUrlMetaData};
//const url = 'https://www.mainstreetroi.com/where-are-the-webpage-titles-descriptions-and-headers/';
//getUrlMetaData(url).then(ret => console.log(ret)).catch(err => console.log(err));}