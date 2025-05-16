// src/data/comments.ts

export interface CommentItemProps {
  id: number
  author: string
  time: string
  postTitle: string
  postUrl: string
  text: string
  authorUrl?: string
}

const comments: CommentItemProps[] = [
  {
    id: 1,
    author: 'anomancer',
    time: '2 hours ago',
    postTitle: 'A Tiny Boltzmann Machine',
    postUrl: '#/story/1',
    text: 'This is fascinating—would love to see benchmarks on convergence rate.',
    authorUrl: '#/user/anomancer'
  },
  {
    id: 2,
    author: 'marv1nnnnn',
    time: '90 minutes ago',
    postTitle: 'Show HN: Min.js-style compression using tree transforms',
    postUrl: '#/story/2',
    text: 'Tried it on a 100 KB doc and saw a 40% reduction—impressive! Curious if this is Brotli-beating in any edge cases.',
    authorUrl: '#/user/marv1nnnnn'
  },
  {
    id: 3,
    author: 'jakevoytko',
    time: '30 minutes ago',
    postTitle: 'Malicious compliance by booking.com’s cancellation logic',
    postUrl: '#/story/4',
    text: 'Ha, reminds me of the time we accidentally locked the conference room for a full week by setting a recurring event from 1970.',
    authorUrl: '#/user/jakevoytko'
  },
  {
    id: 4,
    author: 'elliebyte',
    time: 'just now',
    postTitle: 'Ask HN: How do you handle cognitive fatigue as a solo founder?',
    postUrl: '#/story/5',
    text: 'Honestly, I just walk. I go outside, sometimes without my phone. There’s no productivity hack that beats stepping away for 20 minutes.',
    authorUrl: '#/user/elliebyte'
  },
  {
    id: 5,
    author: 'devnullx',
    time: '4 hours ago',
    postTitle: 'Inside an FPGA-powered oscilloscope debugger',
    postUrl: '#/story/6',
    text: 'Was not expecting the latency to be that low. Definitely going to try using this for a hardware class I’m teaching.',
    authorUrl: '#/user/devnullx'
  },
  {
    id: 6,
    author: 'rcodes',
    time: '7 hours ago',
    postTitle: 'What happens if you delete your DNS root zone?',
    postUrl: '#/story/7',
    text: 'Reading this gave me flashbacks to when I accidentally nuked a production CNAME during a demo call. Lessons were learned.',
    authorUrl: '#/user/rcodes'
  },
  {
    id: 7,
    author: 'mintchip',
    time: '9 hours ago',
    postTitle: 'We’re All Just Crontabs Now',
    postUrl: '#/story/8',
    text: 'Great metaphor, but I wish the author had dug deeper into how “default calendars” shape behavior in teams.',
    authorUrl: '#/user/mintchip'
  },
  {
    id: 8,
    author: 'emdot',
    time: '1 day ago',
    postTitle: 'HN redesign concept: less orange, more contrast',
    postUrl: '#/story/9',
    text: 'I’m torn—while the update is refreshing, the nostalgia of the original HN color scheme is hard to let go of.',
    authorUrl: '#/user/emdot'
  },
  {
    id: 9,
    author: 'pluto8',
    time: '2 days ago',
    postTitle: 'Ray tracing with ASCII characters',
    postUrl: '#/story/10',
    text: 'This is wild. Took me back to messing with `ncurses` in college. It’s like watching light bend through pixels on a typewriter.',
    authorUrl: '#/user/pluto8'
  }
]

export default comments
