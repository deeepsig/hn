<h2 align="center">SPC Maker News</h2>

This is a responsive hacker news UI alterative that allows for read-only hacker news interaction. While it was supposed to be a clone, within the timeframe the most useful thing this could be was a app that would at least allow you to see what's happening in the hackernews universe. Sort of like a news feed (newspapers??).

![alt text](/public/image.png)

![alt text](/public/image-1.png)

## UI Design

The design inspiration was largely based on the https://www.modernhn.com/, which is a web extenstion that gives hackernews a more elegant appearance.

But if you use the extention you'll know that is not responsive and the thread design is a bit lacking, though it might be intentional. We filled those minor loopholes to give a more complete experience. Look at the reddit like lines that we've added in the following image.

![alt text](/public/image-2.png)

## AI Tools used

The free version of chatgpt/open ai and claude models. I usually prefer this approach over the integeated ide approach as this one allows me to question mor about why a specific change was done, and if we could've done it some other way. Though that is also to say I've not used the ai code editors much. I largely make the logic decisions, when to organize vs when to keep it in the same place, large part of getting the ui is done by the model and I cross verify with my designs if we are doing it right. When i say ui i mean the ui minus the functionality.

If you hae to get a picture of the workflow, think of it as a canvas with building blocks placed and me and the ai model are figuring out together what to do next.

## Thought and Build Process

We break and break until we can work on the smallest MVP while keeping in mind how we can modify it for the future. For example, at the very start I simply focussed on getting the ui without any functionality done. The simple look needed to be there, and from then on we added functionality slowly.

check the initial PRs.

## Tech stack

This is a react vite app which uses typescript. It was the more obvious choice for me given the prior experience.

## Setup instructions

### Install dependencies

`npm install`

### Run development server

`npm run dev`
