<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [workshop-setup](#workshop-setup)
  - [The problem](#the-problem)
  - [This solution](#this-solution)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Alternative usage](#alternative-usage)
    - [verifySystem](#verifysystem)
    - [installDeps](#installdeps)
  - [Inspiration](#inspiration)
  - [Other Solutions](#other-solutions)
  - [Contributors](#contributors)
  - [LICENSE](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# workshop-setup

Verify and setup a repository for workshop attendees

[![Build Status][build-badge]][build]
[![Code Coverage][coverage-badge]][coverage]
[![Dependencies][dependencyci-badge]][dependencyci]
[![version][version-badge]][package] [![downloads][downloads-badge]][npm-stat]
[![MIT License][license-badge]][license]

[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors)
[![PRs Welcome][prs-badge]][prs] [![Donate][donate-badge]][donate]
[![Code of Conduct][coc-badge]][coc] [![Roadmap][roadmap-badge]][roadmap]
[![Examples][examples-badge]][examples]

[![Watch on GitHub][github-watch-badge]][github-watch]
[![Star on GitHub][github-star-badge]][github-star]
[![Tweet][twitter-badge]][twitter]

## The problem

I make quite a few [workshops][workshops] and one of the biggest challenges I
have is making sure that people have set things up correctly so the workshop has
as few surprises as possible. So I want to have a script validate things on
attendees machines before they start on the workshop and give them helpful info
to fix problems early and on their own.

The problem is further complicated by the fact that I can't use any modules to
do this because I can pretty much only guarantee that attendees have some
version of node and npm, but not which version. So I need something that exists
when they clone the repository right from the start.

## This solution

This exposes a simple function that takes an array of validators which return
strings of helpful text (or a promise that resolves to a string of helpful text)
if the system is not valid (or `null` if it is valid). To overcome the issue of
not being able to install things, there is a bundled version of this module that
you can download from the registry and commit directly to your project.

## Installation

The way I expect people to use this module is by downloading the UMD build and
committing it directly into their project. You can download the UMD build via
npm if you like (then just copy/paste the file from `node_modules`) or download
it from `unpkg.com` here: https://unpkg.com/workshop-setup/dist/index.js

```
curl -o scripts/workshop-setup.js -L https://unpkg.com/workshop-setup/dist/index.js
```

This module is distributed via [npm][npm] which is bundled with [node][node] and
can be installed as one of your project's `devDependencies`:

```
npm install --save-dev workshop-setup
```

## Usage

Here's what I recommend:

1. Download the workshop-setup script into `scripts/workshop-setup.js`
2. Add `engines` config to your `packge.json` with `node`, `npm`, and `yarn`
   listed
3. Add a `script` to your `package.json` called `setup` with:
   `node ./scripts/setup`
4. Create the `scripts/setup.js` file
5. And put this in it:

```javascript
var path = require('path')
var pkg = require(path.join(process.cwd(), 'package.json'))

// if you install it then this should be require('workshop-setup')
// but that... doesn't really make sense.
require('./workshop-setup')
  .setup(pkg.engines)
  .then(
    () => {
      console.log(`💯  You're all set up! 👏`)
    },
    error => {
      console.error(`🚨  There was a problem:`)
      console.error(error)
      console.error(
        `\nIf you would like to just ignore this error, then feel free to do so and install dependencies as you normally would in "${process.cwd()}". Just know that things may not work properly if you do...`,
      )
    },
  )
```

### Alternative usage

Whether you install it or download it, usage is basically the same. The
difference is how you require it.

```javascript
// if you install it, you'd do
var workshopSetup = require('workshop-setup')
// if you download it, you'd do something like:
var workshopSetup = require('./workshop-setup')
```

### verifySystem

This allows you to verify the user's system is correct:

```javascript
var verifySystem = require('./workshop-setup').verifySystem

var verifyPromise = verifySystem([
  verifySystem.validators.node('^8.4.0'),
  verifySystem.validators.npm('^5.4.1'),
])

verifyPromise.then(
  function() {
    // resolves if there are no errors
    console.log('🎉  Congrats! Your system is setup properly')
    console.log('You should be good to install and run things.')
  },
  function(error) {
    // rejects if there are errors
    console.error(error)
    console.info(
      "\nIf you don't care about these warnings, go " +
        'ahead and install dependencies with `node ./scripts/install`',
    )
    process.exitCode = 1
  },
)
```

You can also specify custom validators. There are several utilities exposed by
`workshop-setup` as well which can be quite helpful.

```javascript
verifySystem([
  function promiseVerify() {
    return new Promise(resolve => {
      // note the exclusion of reject here. We expect all validator promises to
      // resolve with `null` or the error message.
      resolve(null) // there were no errors
    })
  },
  function syncVerify() {
    if ('cats' > 'dogs') {
      return 'dogs are way better than cats'
    }
    return null
  },
  // here's a practical example that uses some utilities
  function validateYeoman() {
    return verifySystem.utils.execValidator('^1.8.5', 'yo --version', function(
      actual,
      desired,
    ) {
      return verifySystem.utils.commonTags.oneLine`
        You have version ${actual} of yeoman, but
        should have a version in the range: ${desired}
      `
    })
  },
]).then(/* handle success/failure */)
```

#### validators

The built-in validators available on `workshopSetup.verifySystem.validators`
are:

- `node(desiredVersionRange)`
- `yarn(desiredVersionRange)`
- `npm(desiredNpmVersionRange)`

#### utils

Most of the utils are simply exposing other modules which are bundled with
`workshop-setup`. These are available on `workshopSetup.verifySystem.utils`:

- `execValidator(desiredVersionRange, commandToGetVersion, messageFn)` -
  `messageFn` is given `actual, desired`
- `oneLine`: a tag that allows you to have multiple lines for a message and
  it'll put it all on one line
- [`semver`][semver] (really useful `satisfies` method on this one)

### installDeps

This will install dependencies in the given directory/directories (defaults to
`process.cwd()`) using `npm`.

```javascript
var path = require('path')
var installDeps = require('./workshop-setup').installDeps

var main = path.resolve(__dirname, '..')
var api = path.resolve(__dirname, '../api')
var client = path.resolve(__dirname, '../client')
installDeps([main, api, client]).then(
  () => {
    console.log('👍  all dependencies installed')
  },
  () => {
    // ignore, workshop-setup will log for us...
  },
)

// you can also do:
installDeps()
// which is effectively
installDeps(process.cwd())

// or, to be more specific:
installDeps(path.resolve('..'))
```

## Inspiration

This project was inspired by all of the people who have ever struggled to set up
one of my workshops before. Hopefully it's easier now!

## Other Solutions

I'm unaware of any other solutions for this problem. Feel free to link them here
if you find any.

## Contributors

Thanks goes to these people ([emoji key][emojis]):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->

| [<img src="https://avatars.githubusercontent.com/u/1500684?v=3" width="100px;"/><br /><sub>Kent C. Dodds</sub>](https://kentcdodds.com)<br />[💻](https://github.com/kentcdodds/workshop-setup/commits?author=kentcdodds) [📖](https://github.com/kentcdodds/workshop-setup/commits?author=kentcdodds) 🚇 [⚠️](https://github.com/kentcdodds/workshop-setup/commits?author=kentcdodds) |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |


<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors][all-contributors] specification.
Contributions of any kind welcome!

## LICENSE

MIT

[npm]: https://www.npmjs.com/
[node]: https://nodejs.org
[build-badge]:
  https://img.shields.io/travis/kentcdodds/workshop-setup.svg?style=flat-square
[build]: https://travis-ci.org/kentcdodds/workshop-setup
[coverage-badge]:
  https://img.shields.io/codecov/c/github/kentcdodds/workshop-setup.svg?style=flat-square
[coverage]: https://codecov.io/github/kentcdodds/workshop-setup
[dependencyci-badge]:
  https://dependencyci.com/github/kentcdodds/workshop-setup/badge?style=flat-square
[dependencyci]: https://dependencyci.com/github/kentcdodds/workshop-setup
[version-badge]:
  https://img.shields.io/npm/v/workshop-setup.svg?style=flat-square
[package]: https://www.npmjs.com/package/workshop-setup
[downloads-badge]:
  https://img.shields.io/npm/dm/workshop-setup.svg?style=flat-square
[npm-stat]:
  http://npm-stat.com/charts.html?package=workshop-setup&from=2016-04-01
[license-badge]:
  https://img.shields.io/npm/l/workshop-setup.svg?style=flat-square
[license]:
  https://github.com/kentcdodds/workshop-setup/blob/master/other/LICENSE
[prs-badge]:
  https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com
[donate-badge]:
  https://img.shields.io/badge/$-support-green.svg?style=flat-square
[donate]: http://kcd.im/donate
[coc-badge]:
  https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[coc]:
  https://github.com/kentcdodds/workshop-setup/blob/master/other/CODE_OF_CONDUCT.md
[roadmap-badge]:
  https://img.shields.io/badge/%F0%9F%93%94-roadmap-CD9523.svg?style=flat-square
[roadmap]:
  https://github.com/kentcdodds/workshop-setup/blob/master/other/ROADMAP.md
[examples-badge]:
  https://img.shields.io/badge/%F0%9F%92%A1-examples-8C8E93.svg?style=flat-square
[examples]:
  https://github.com/kentcdodds/workshop-setup/blob/master/other/EXAMPLES.md
[github-watch-badge]:
  https://img.shields.io/github/watchers/kentcdodds/workshop-setup.svg?style=social
[github-watch]: https://github.com/kentcdodds/workshop-setup/watchers
[github-star-badge]:
  https://img.shields.io/github/stars/kentcdodds/workshop-setup.svg?style=social
[github-star]: https://github.com/kentcdodds/workshop-setup/stargazers
[twitter]:
  https://twitter.com/intent/tweet?text=Check%20out%20workshop-setup!%20https://github.com/kentcdodds/workshop-setup%20%F0%9F%91%8D
[twitter-badge]:
  https://img.shields.io/twitter/url/https/github.com/kentcdodds/workshop-setup.svg?style=social
[emojis]: https://github.com/kentcdodds/all-contributors#emoji-key
[all-contributors]: https://github.com/kentcdodds/all-contributors
[workshops]: https://kentcdodds.com/workshops
[semver]: https://www.npmjs.com/package/semver
