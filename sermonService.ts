
export interface YouTubeVideo {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  thumbnail: string;
  author: string;
  category?: 'sermons' | 'series';
}

export const CHANNEL_ID = 'UCcuWVaHkayGyttxoPDuaa1Q';
// Playlist IDs (Placeholders - user should provide real ones)
export const PLAYLIST_SERMONS = 'PL_SERMONS_PLACEHOLDER'; 
export const PLAYLIST_SERIES = 'PL_SERIES_PLACEHOLDER';

export const isPlaceholder = (id?: string) => !id || id.includes('PLACEHOLDER');

export const getRssUrl = (playlistId?: string) => {
  if (playlistId && !isPlaceholder(playlistId)) {
    return `https://www.youtube.com/feeds/videos.xml?playlist_id=${playlistId}`;
  }
  return `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
};

export const FALLBACK_VIDEOS: YouTubeVideo[] = [
  {
    id: '-2rCblislLQ',
    title: 'Илчлэлт Сүм',
    link: 'https://youtu.be/-2rCblislLQ',
    pubDate: '2024-03-15T00:00:00Z',
    thumbnail: 'https://img.youtube.com/vi/-2rCblislLQ/maxresdefault.jpg',
    author: 'Илчлэлт Сүм',
    category: 'sermons'
  },
  {
    id: 'Q4TXZUBR0yA',
    title: 'Илчлэлт Сүм',
    link: 'https://youtu.be/Q4TXZUBR0yA',
    pubDate: '2024-03-01',
    thumbnail: 'https://img.youtube.com/vi/Q4TXZUBR0yA/maxresdefault.jpg',
    author: 'Илчлэлт Сүм',
    category: 'sermons'
  },
  {
    id: 'd80xFbQ1ry8',
    title: 'Залуучуудын цуглаан',
    link: 'https://youtu.be/d80xFbQ1ry8',
    pubDate: '2024-03-20',
    thumbnail: 'https://img.youtube.com/vi/d80xFbQ1ry8/maxresdefault.jpg',
    author: 'Илчлэлт Сүм',
    category: 'sermons'
  },
  {
    id: 'JDwKU9aAw74',
    title: 'Гэр бүлийн хичээл',
    link: 'https://youtu.be/JDwKU9aAw74',
    pubDate: '2024-02-28',
    thumbnail: 'https://img.youtube.com/vi/JDwKU9aAw74/maxresdefault.jpg',
    author: 'Илчлэлт Сүм',
    category: 'sermons'
  },
  {
    id: '4AoPz2YVyuI',
    title: 'Өглөөний мөргөл',
    link: 'https://youtu.be/4AoPz2YVyuI',
    pubDate: '2024-02-25',
    thumbnail: 'https://img.youtube.com/vi/4AoPz2YVyuI/maxresdefault.jpg',
    author: 'Илчлэлт Сүм',
    category: 'sermons'
  },
  {
    id: 'B9Z1MMpKJAQ',
    title: 'Баярын мөргөл',
    link: 'https://youtu.be/B9Z1MMpKJAQ',
    pubDate: '2024-02-20',
    thumbnail: 'https://img.youtube.com/vi/B9Z1MMpKJAQ/maxresdefault.jpg',
    author: 'Илчлэлт Сүм',
    category: 'sermons'
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

export const fetchSermons = async (playlistId?: string): Promise<YouTubeVideo[]> => {
  let serverRateLimited = false;
  const rssUrl = getRssUrl(playlistId);

  try {
    // Try the new JSON endpoint first (Server-side parsed and cached)
    const apiUrl = playlistId && !isPlaceholder(playlistId)
      ? `/api/youtube-videos?playlistId=${playlistId}&t=${Date.now()}`
      : `/api/youtube-videos?t=${Date.now()}`;
      
    const response = await fetch(apiUrl);
    if (response.ok) {
      const fetchedVideos = await response.json();
      if (Array.isArray(fetchedVideos) && fetchedVideos.length > 0) {
        console.log(`Successfully fetched ${fetchedVideos.length} videos from JSON API`);
        const uniqueMap = new Map<string, YouTubeVideo>();
        // FALLBACK_VIDEOS first, so fetchedVideos can overwrite them while preserving fields like category
        [...FALLBACK_VIDEOS, ...fetchedVideos].forEach(v => {
          const id = (v.id || '').trim();
          if (id) {
            const existing = uniqueMap.get(id);
            uniqueMap.set(id, { ...existing, ...v, id });
          }
        });
        const unique = Array.from(uniqueMap.values());
        return unique.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
      }
    } else if (response.status === 429) {
      serverRateLimited = true;
      console.warn("Server is rate limited by YouTube (429)");
    }
  } catch (err) {
    console.warn("JSON API fetch failed, falling back to RSS proxy", err);
  }

  const proxies = [
    // 1. Local Server Proxy (RSS XML) - Skip if we already know server is rate limited
    ...(serverRateLimited ? [] : [(url: string) => {
      const base = `/api/sermons-rss?t=${Date.now()}`;
      return playlistId && !isPlaceholder(playlistId) ? `${base}&playlistId=${playlistId}` : base;
    }]),
    // 2. External Proxies (Fallbacks) - These use the USER'S IP
    (url: string) => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}&timestamp=${Date.now()}`,
    (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}&timestamp=${Date.now()}`,
    (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
    (url: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`
  ];

  let lastError: any = null;

  for (const getProxyUrl of proxies) {
    try {
      const proxyUrl = getProxyUrl(rssUrl);
      console.log(`Attempting sync with proxy: ${proxyUrl}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s timeout

      const response = await fetch(proxyUrl, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) throw new Error(`Fetch failed with status: ${response.status}`);
      
      let xmlContent = '';
      const contentType = response.headers.get('content-type') || '';
      
      if (proxyUrl.includes('allorigins.win/get')) {
        const data = await response.json();
        if (!data || !data.contents) {
          console.warn('No content from allorigins JSON, data:', data);
          throw new Error('No content from allorigins JSON');
        }
        xmlContent = data.contents;
      } else {
        xmlContent = await response.text();
      }

      if (!xmlContent || xmlContent.length < 100 || !xmlContent.trim().startsWith('<')) {
        throw new Error("Received suspicious or non-XML content");
      }

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlContent, "text/xml");
      
      const parserError = xmlDoc.getElementsByTagName("parsererror");
      let entries: Element[] = [];

      if (parserError.length > 0) {
        console.warn("XML parsing error detected, attempting regex fallback");
        // Regex fallback for video IDs if XML parsing fails
        // 1. Standard RSS tag
        const videoIdRegex = /<yt:videoId>([^<]+)<\/yt:videoId>/g;
        // 2. Common URL patterns in case we got HTML or malformed XML
        const watchRegex = /watch\?v=([a-zA-Z0-9_-]{11})/g;
        const embedRegex = /embed\/([a-zA-Z0-9_-]{11})/g;
        const shortUrlRegex = /youtu\.be\/([a-zA-Z0-9_-]{11})/g;
        const vParamRegex = /v=([a-zA-Z0-9_-]{11})/g;
        const videoIdParamRegex = /videoId["']:\s*["']([a-zA-Z0-9_-]{11})["']/g;
        const jsonVideoIdRegex = /"videoId":"([a-zA-Z0-9_-]{11})"/g;
        const dataVideoIdRegex = /data-video-id="([a-zA-Z0-9_-]{11})"/g;
        
        const videoIds = new Set<string>();
        let match;
        
        while ((match = videoIdRegex.exec(xmlContent)) !== null) videoIds.add(match[1]);
        while ((match = watchRegex.exec(xmlContent)) !== null) videoIds.add(match[1]);
        while ((match = embedRegex.exec(xmlContent)) !== null) videoIds.add(match[1]);
        while ((match = shortUrlRegex.exec(xmlContent)) !== null) videoIds.add(match[1]);
        while ((match = vParamRegex.exec(xmlContent)) !== null) videoIds.add(match[1]);
        while ((match = videoIdParamRegex.exec(xmlContent)) !== null) videoIds.add(match[1]);
        while ((match = jsonVideoIdRegex.exec(xmlContent)) !== null) videoIds.add(match[1]);
        while ((match = dataVideoIdRegex.exec(xmlContent)) !== null) videoIds.add(match[1]);

        if (videoIds.size > 0) {
          const uniqueIds = Array.from(videoIds);
          console.log(`Regex fallback found ${uniqueIds.length} video IDs`);
          const fetchedVideos: YouTubeVideo[] = uniqueIds.map((id) => ({
            id: id.trim(),
            title: 'Видео', // Default if title not found in regex
            link: `https://www.youtube.com/watch?v=${id.trim()}`,
            pubDate: new Date().toISOString(),
            thumbnail: `https://img.youtube.com/vi/${id.trim()}/maxresdefault.jpg`,
            author: 'Илчлэлт Сүм'
          }));

          const uniqueMap = new Map<string, YouTubeVideo>();
          // FALLBACK_VIDEOS first, so fetchedVideos can overwrite them while preserving fields like category
          [...FALLBACK_VIDEOS, ...fetchedVideos].forEach(v => {
            const id = (v.id || '').trim();
            if (id) {
              const existing = uniqueMap.get(id);
              uniqueMap.set(id, { ...existing, ...v, id });
            }
          });
          const unique = Array.from(uniqueMap.values());
          return unique.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
        }
        
        throw new Error("XML parsing failed and regex fallback found no videos");
      }

      entries = Array.from(xmlDoc.getElementsByTagName("entry"));
      
      if (entries.length > 0) {
        const fetchedVideos: YouTubeVideo[] = entries.map(entry => {
          const videoId = getTagValue(entry, "videoId");
          const title = getTagValue(entry, "title") || 'Илчлэлт Сүм';
          return {
            id: videoId,
            title: title,
            link: `https://www.youtube.com/watch?v=${videoId}`,
            pubDate: getTagValue(entry, "published"),
            thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
            author: 'Илчлэлт Сүм'
          };
        }).filter(v => v.id);

        if (fetchedVideos.length > 0) {
          console.log(`Successfully synced ${fetchedVideos.length} videos`);
          const uniqueMap = new Map<string, YouTubeVideo>();
          // FALLBACK_VIDEOS first, so fetchedVideos can overwrite them while preserving fields like category
          [...FALLBACK_VIDEOS, ...fetchedVideos].forEach(v => {
            const id = (v.id || '').trim();
            if (id) {
              const existing = uniqueMap.get(id);
              uniqueMap.set(id, { ...existing, ...v, id });
            }
          });
          const unique = Array.from(uniqueMap.values());
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
  // If all attempts fail, we still return the fallback videos instead of crashing the UI
  console.log("Returning fallback videos due to sync failure.");
  return FALLBACK_VIDEOS;
};
