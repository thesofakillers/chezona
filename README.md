# API Zone COVID Italia

> PROJECT ABANDONED: Having discovered the existence of
> [covidzone.info](https://covidzone.info), I have decided to abandon this
> project, since they've achieved everything I intended to do and more. Please
> use their website instead. I've left the code here for the curious, although I
> was just getting started and it is far from complete.

## Setup

- Make sure you have node >= 15 install along with the relevant npm.
- Clone this repo
- run `npm install`
- run `npm run develop`

## How it was meant to work

The hosting service (netlify) is told to run `npm run preprocess` before
building. This downloads a zip file that contains JSON data managed by the
Italian government describing changes in the regional COVID color zones of the
country. The website parses this data and presents it nicely to users.

This build process is triggered twice per day via a zapier integration with
netlify. It can of course also be triggered manually.
