function addTags(
    text: string,
    start: number,
    end: number,
    key: string
  ): string {
    let text1 = text.substring(0, start);
    let text2 = text.substring(start, end);
    let text3 = text.substring(end, text.length);
  
    const tags: Record<string, string[]> = {
      'b': ['__', '__'],
      'u': ['<u>', '</u>'],
      's': ['~~', '~~'],
      'i': ['_', '_'],
      'l': ['- ', '']
    }
  
    const tagStart = tags[key.toLocaleLowerCase()][0]
    const tagEnd = tags[key.toLocaleLowerCase()][1]
  
    if(text2.startsWith(' ')) {
      text1 = `${text1} `
    }
  
    if(text2.endsWith(' ')) {
      text3 = ` ${text3}`
    }
  
    text2 = text2.trim().split('\n').join(`${tagEnd}\n${tagStart}`)
  
    return `${text1}${tagStart}${text2}${tagEnd}${text3}`;
  }

  export default addTags