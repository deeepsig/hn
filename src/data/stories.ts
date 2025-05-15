// src/data/stories.ts

import { StoryItemProps } from '../components/story/StoryItem'

/**
 * Dummy list of stories to display in StoryList component
 */
const stories: StoryItemProps[] = [
  {
    index: 1,
    title: 'A Tiny Boltzmann Machine',
    url: 'https://eoinmurray.info/boltzmann',
    source: 'eoinmurray.info',
    points: 132,
    author: 'anomancer',
    time: '3 hours ago',
    comments: 24
  },
  {
    index: 2,
    title: 'Show HN: Min.js style compression of tech docs for LLM context',
    url: 'https://github.com/marv1nnnnn/min.js',
    source: 'github.com',
    points: 88,
    author: 'marv1nnnnn',
    time: '3 hours ago',
    comments: 27
  },
  {
    index: 3,
    title: 'Launch HN: Tinfoil (YC X25): Verifiable Privacy for Cloud AI',
    url: 'https://tinfoil.example.com',
    source: 'tinfoil.ai',
    points: 15,
    author: 'FrasierTheLion',
    time: '43 minutes ago',
    comments: 7
  },
  {
    index: 4,
    title: 'Malicious compliance by booking an available meeting room',
    url: 'https://clientserver.dev/posts/malicious-compliance',
    source: 'clientserver.dev',
    points: 157,
    author: 'jakevoytko',
    time: '3 hours ago',
    comments: 160
  },
  {
    index: 5,
    title: "I've never been so conflicted about a technology",
    url: 'https://marcjenkins.co.uk/conflicted-tech',
    source: 'marcjenkins.co.uk',
    points: 25,
    author: 'speckx',
    time: '1 hour ago',
    comments: 18
  },
  {
    index: 6,
    title: 'Fetii (YC S22) Is Hiring',
    url: 'https://www.ycombinator.com/companies/fetii',
    source: 'ycombinator.com',
    points: 0,
    author: '–',
    time: '2 minutes ago',
    comments: 0
  },
  {
    index: 7,
    title: 'Wavelet Trees: An Introduction (2011)',
    url: 'https://alexbowe.com/wavelet-trees',
    source: 'alexbowe.com',
    points: 22,
    author: 'Tomte',
    time: '1 hour ago',
    comments: 2
  },
  {
    index: 8,
    title: "Onfim's world: Child artists in history",
    url: 'https://resobscura.substack.com/p/onfims-world',
    source: 'resobscura.substack.com',
    points: 7,
    author: 'benbreen',
    time: '19 minutes ago',
    comments: 0
  }
]

export default stories
