
export interface YouTubeVideo {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  thumbnail: string;
  author: string;
}

export const CHANNEL_ID = 'UC87i3_n-zR6xNfR_Yy-Y75A';
export const RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

export const FALLBACK_VIDEOS: YouTubeVideo[] = [
  {
    id: 'Q4TXZUBR0yA',
    title: 'Сургаал ба Залбирал | Илчлэлт Сүм',
    link: 'https://youtu.be/Q4TXZUBR0yA',
    pubDate: '2024-03-01',
    thumbnail: 'https://img.youtube.com/vi/Q4TXZUBR0yA/maxresdefault.jpg',
    author: 'Илчлэлт Сүм'
  },
  {
    id: 'JDwKU9aAw74',
    title: 'Итгэлийн хүч - Магтан хүндэтгэл',
    link: 'https://youtu.be/JDwKU9aAw74',
    pubDate: '2024-02-28',
    thumbnail: 'https://img.youtube.com/vi/JDwKU9aAw74/maxresdefault.jpg',
    author: 'Илчлэлт Сүм'
  },
  {
    id: '4AoPz2YVyuI',
    title: 'Бурханы хайр бидний амьдралд',
    link: 'https://youtu.be/4AoPz2YVyuI',
    pubDate: '2024-02-25',
    thumbnail: 'https://img.youtube.com/vi/4AoPz2YVyuI/maxresdefault.jpg',
    author: 'Илчлэлт Сүм'
  },
  {
    id: 'B9Z1MMpKJAQ',
    title: 'Сүнслэг өсөлт ба нөхөрлөл',
    link: 'https://youtu.be/B9Z1MMpKJAQ',
    pubDate: '2024-02-20',
    thumbnail: 'https://img.youtube.com/vi/B9Z1MMpKJAQ/maxresdefault.jpg',
    author: 'Илчлэлт Сүм'
  },
  {
    id: '1TBJdqg0XWk',
    title: 'Библийн гүнзгийрүүлсэн судлал',
    link: 'https://youtu.be/1TBJdqg0XWk',
    pubDate: '2024-02-15',
    thumbnail: 'https://img.youtube.com/vi/1TBJdqg0XWk/maxresdefault.jpg',
    author: 'Илчлэлт Сүм'
  },
  {
    id: 'y515MrzLqqw',
    title: 'Гэр бүлийн цуглаан - Сургаал',
    link: 'https://youtu.be/y515MrzLqqw',
    pubDate: '2024-02-10',
    thumbnail: 'https://img.youtube.com/vi/y515MrzLqqw/maxresdefault.jpg',
    author: 'Илчлэлт Сүм'
  },
  {
    id: '-oYxPfGYdaw',
    title: 'Итгэл найдвар биднийг хөтөлнө',
    link: 'https://youtu.be/-oYxPfGYdaw',
    pubDate: '2024-02-05',
    thumbnail: 'https://img.youtube.com/vi/-oYxPfGYdaw/maxresdefault.jpg',
    author: 'Илчлэлт Сүм'
  },
  {
    id: 'd80xFbQ1ry8',
    title: 'Бурханы Үг - Амьдралын Гэрэл | Илчлэлт Сүм',
    link: 'https://youtu.be/d80xFbQ1ry8',
    pubDate: '2024-03-20',
    thumbnail: 'https://img.youtube.com/vi/d80xFbQ1ry8/maxresdefault.jpg',
    author: 'Илчлэлт Сүм'
  }
];

const getTagValue = (entry: Element, tagName: string): string => {
  try {
    const elements = entry.getElementsByTagName('*');
    for (let i = 0; i < elements.length; i++) {
      const nodeName = elements[i].localName || elements[i].nodeName.split(':').pop();
      if (nodeName && nodeName.toLowerCase() === tagName.toLowerCase()) {
        return elements[i].textContent || '';
      }
    }
  } catch (e) {
    return '';
  }
  return '';
};

export const fetchSermons = async (): Promise<YouTubeVideo[]> => {
  const proxies = [
    (url: string) => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}&timestamp=${Date.now()}`,
    (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}&timestamp=${Date.now()}`,
    (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
    (url: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`
  ];

  let lastError: any = null;

  for (const getProxyUrl of proxies) {
    try {
      const proxyUrl = getProxyUrl(RSS_URL);
      console.log(`Attempting sync with proxy: ${proxyUrl}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

      const response = await fetch(proxyUrl, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) throw new Error(`Fetch failed with status: ${response.status}`);
      
      let xmlContent = '';
      const contentType = response.headers.get('content-type') || '';
      
      if (proxyUrl.includes('allorigins.win/get')) {
        const data = await response.json();
        if (!data.contents) throw new Error('No content from allorigins JSON');
        xmlContent = data.contents;
      } else {
        xmlContent = await response.text();
      }

      if (!xmlContent || xmlContent.length < 100) {
        throw new Error("Received suspicious or empty content");
      }

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlContent, "text/xml");
      
      const parserError = xmlDoc.getElementsByTagName("parsererror");
      if (parserError.length > 0) {
        console.warn("XML parsing error details:", parserError[0].textContent);
        throw new Error("XML parsing failed");
      }

      const entries = Array.from(xmlDoc.getElementsByTagName("entry"));
      
      if (entries.length > 0) {
        const fetchedVideos: YouTubeVideo[] = entries.map(entry => {
          const videoId = getTagValue(entry, "videoId");
          return {
            id: videoId,
            title: getTagValue(entry, "title") || "Сургаал",
            link: `https://www.youtube.com/watch?v=${videoId}`,
            pubDate: getTagValue(entry, "published"),
            thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
            author: 'Илчлэлт Сүм'
          };
        }).filter(v => v.id);

        if (fetchedVideos.length > 0) {
          console.log(`Successfully synced ${fetchedVideos.length} videos`);
          const all = [...fetchedVideos, ...FALLBACK_VIDEOS];
          const unique = Array.from(new Map(all.map(v => [v.id, v])).values());
          return unique.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
        }
      }
      
      throw new Error("No video entries found in the RSS feed");
    } catch (err: any) {
      const msg = err.name === 'AbortError' ? 'Timeout' : err.message;
      console.warn(`Proxy attempt failed (${msg})`);
      lastError = err;
      continue;
    }
  }

  console.error('All RSS sync attempts failed. Last error:', lastError);
  // We throw here so the UI can show the error state
  throw new Error(lastError?.message || "Бүх холболтын оролдлого амжилтгүй боллоо.");
};
