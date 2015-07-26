# [Haiku Experience](http://github.com/prescottprue/haikuEx)

## Description
Create a software prototype that presents a stream of haiku and conveys their experience.

**Haiku Experience** conveys experience through imagery matched the the language and sentiment of the Haiku. Language processing is to determine what the Haiku about and provide matching images as well as a color showing its sentiment.

## Getting Started

### Using The Application

Scroll through Haikus to or add your own by clicking the plus button (coming soon)

### Local Development

1. Make sure you have NodeJS and GulpJS installed.
2. Clone this repository `git clone git@github.com:prescottprue/haikuEx.git`
3. Run `npm install` to install development dependencies
4. Run `bower install` to install front end libraries
5. Run `grunt` to start a local server on `localhost:4000` for development.

This will also be added to a dropbox location

## Architecture
HaikuEx consists of a frontend that makes requests to a backend to get the "experience" data.

### Files
**App Folder** - Front end application development version

**Dist Folder** - Production version of front end (minified/ugilified)

**Backend** - NodeJS application that handles API communications

## Frameworks
* [Angular](angularjs.org) - Frontend
* [Nodejs]() - Backend
* [Gulp](http://gulpjs.com) - Dev Task Automation
* [Bower]() - Frontend Dependencies
* [TextRazor](http://textrazor.com) - Language Processing
* [GettyImages]() - Images

## Notes
* API Reqests should be made from server for key security and processing speed

## TODO
* Front end css
* Search Haikus
* Tagging system (integrate with search)
* Color for setiment (Green and Red?)
* Front end for Adding a Haiku of your own
* Route for Adding a Haiku of your own
