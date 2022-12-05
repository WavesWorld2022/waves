import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StringParserService {

  constructor() { }

  replaceURLs(message: any) {
    if(!message) return;

    const urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
    return message.replace(urlRegex, (url: any) => {
      let hyperlink = url;
      if (!hyperlink.match('^https?:\/\/')) {
        hyperlink = 'http://' + hyperlink;
      }
      if(hyperlink.includes('youtube.com') || hyperlink.includes('youtu.be')) {
        let you;

        if (hyperlink.includes('watch?v=')) {
          hyperlink = hyperlink.replace('watch?v=', '');
        }

        hyperlink.includes('www.youtube.com')
        ? you = 'https://www.youtube.com/embed/' + hyperlink.replace('https://www.youtube.com/', '')
        : you = 'https://www.youtube.com/embed/' + hyperlink.replace(hyperlink.includes('youtube.com') ? 'https://youtube.com/' : 'https://youtu.be/', '');
        return '<div class="youtube"><iframe width="100%" height="400" src="' + you + '" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>';
      } else if(hyperlink.includes('vimeo.com')) {
        let vim = 'https://player.vimeo.com/video/' + hyperlink.replace('https://vimeo.com/', '')
        return '<div class="youtube"><iframe src="' + vim + '" width="100%" height="500" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>';
      } else if (hyperlink.includes('png') || hyperlink.includes('jpg') || hyperlink.includes('jpeg')) {
        return hyperlink;
      } else {
        return '<a href="' + hyperlink + '" target="_blank" rel="noopener noreferrer">' + url + '</a>'
      }
    }).replace(/Source:/gi, '<br><strong>Source:</strong>');
  }
}
