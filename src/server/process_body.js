const cheerio = require('cheerio');
const slug = require('slug');

const processBody = body => {
  const $ = cheerio.load(body)
  const results = $('.gallery-item')
    .map(function(index, galleryItem) {
      const $this = $(this)
      const $img = $this.find('img')
      const src = $img.attr('src')
      const srcset = $img.attr('srcset')
      const alt = $img.attr('alt')
      // const link = `/gallery/${slug($img.attr('alt'), { lower: true })}`
      const caption = $this.find('.gallery-caption').html()
      const original = src.replace(/-150x150/, '');
      return {
        src,
        original,
        srcset,
        alt,
        // link,
        caption
      }
    })
    .get()
  return results
}

module.exports = processBody
