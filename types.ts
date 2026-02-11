
export interface Sermon {
  id: string;
  title: string;
  speaker: string;
  date: string;
  thumbnail: string;
  videoUrl: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
}

export interface Ministry {
  id: string;
  name: string;
  icon: string;
  description: string;
}
