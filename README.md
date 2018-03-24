#Webpack and Babel Build System

## Intoduction

JavaScript, like most web related technology, is evolving all the time. What was once seen as the goto solution, either hasn't kept pace with the changes, or its support has perhaps dropped off. As this happens though, the build systems we used to use are no longer effective.

In this article we're going to look at a build setup for handling modern JavaScript as used in the browser using [Babel](https://babeljs.io/) and [webpack](https://webpack.js.org/). In it we'll cover the following steps.

- Prerequisites
- Setup
- Transpiling [ES6/ECMAScript 2015](http://www.ecma-international.org/ecma-262/6.0/index.html) code with Babel
- Organising JavaScript with ES6 modules
- Introducing Webpack and integrating it with Babel
- Bringing it to the browser
- How to take it further
- Conclusion


## Prerequisites
In order to run this build setup, you will need to have both [NodeJS and npm](https://nodejs.org/) installed (they come packaged together), and I would seriously recommend using a version manager such as [nvm](https://github.com/creationix/nvm) to manage your Node installation. You can find the information you need for installation below.

## Set Up

Create a root folder somewhere on your computer and navigate into it from your terminal/command line; this will be your `<ROOT>` folder.

Create a `package.json` file with

```sh
$ npm init -y
```

**Note:** The `-y` flag creates the file with default settings, and means you don't need to complete any of the usual details from the command line - they can be changed later if you wish in your code editor.


Within your root folder, make directories for `<ROOT>/src`, `<ROOT/src/js`, and `<ROOT>/public`. The `./src` folder will be where you'll put your unprocessed source code, and the `./public` folder will be where the transpiled code will end up.

## Transpiling with Babel
To get ourselves going, we're going to install [babel-cli](https://www.npmjs.com/package/babel-cli) which provides the ability to transpile ES6 into ES5, and [babel-preset-env](https://www.npmjs.com/package/babel-preset-env), which allows you to target specific browser versions with the transpiled code.

```sh
$ npm install babel-cli babel-preset-env --save-dev
```

you should now see the following in your `package.json`

```js
"devDependencies": {
    "babel-cli": "^6.26.0",
    "babel-preset-env": "^1.6.1"
  }
```

...and whilst we're in the package.json file, let's change the `scripts` section to read...

```js
"scripts": {
    "build": "babel src -d public"
  },
```

This gives us the ability to call babel via a script, rather than directly from the terminal every time.

The last thing we need to do before we can test out whether babel is doing its thing, is create a `.babelrc` configuration file. This is what our `babel-preset-env` package will refer to for its transpile parameters.

Create a new file in your `<ROOT>` directory called `.babelrc` and paste the following into it.

```js
{
  "presets": [
    [
      "env",
      {
        "targets": {
          "browsers": ["last 2 versions", "safari >= 7"]
        }
      }
    ]
  ]
}

```
This will set up Babel to transpile for the last two versions of each browser, plus Safari at v7 or higher. [Other options](https://babeljs.io/docs/plugins/preset-env/#options) are available depending on which browsers you need to support.

With that saved, we can now test things out with a sample JavaScript file that uses ES6 to see what happens. For the purposes of this article, I've modified a copy of [leftpad](https://github.com/stevemao/left-pad/blob/master/index.js) to use ES6 syntax in a number of places; template literals, arrow functions, const and let.

```js
"use strict";
function leftPad(str, len, ch) {
  const cache = [
    "",
    " ",
    "  ",
    "   ",
    "    ",
    "     ",
    "      ",
    "       ",
    "        ",
    "         "
  ];
  str = str + "";
  len = len - str.length;
  if (len <= 0) return str;
  if (!ch && ch !== 0) ch = " ";
  ch = ch + "";
  if (ch === " " && len < 10)
    return () => {
      cache[len] + str;
    };
  let pad = "";
  while (true) {
    if (len & 1) pad += ch;
    len >>= 1;
    if (len) ch += ch;
    else break;
  }
  return `${pad}${str}`;
}

module.exports = leftPad;
```

Save this as `src/leftpad_es6.js` and from your terminal run

```sh
$ npm run build
```
If all is as intended, in your `public` folder, you should now find a new file, also called `leftpad_es6.js`. If you open that up, you'll find it no longer contains and ES6 syntax and looks like this.

```js
"use strict";

function leftPad(str, len, ch) {
  var cache = ["", " ", "  ", "   ", "    ", "     ", "      ", "       ", "        ", "         "];
  str = str + "";
  len = len - str.length;
  if (len <= 0) return str;
  if (!ch && ch !== 0) ch = " ";
  ch = ch + "";
  if (ch === " " && len < 10) return function () {
    cache[len] + str;
  };
  var pad = "";
  while (true) {
    if (len & 1) pad += ch;
    len >>= 1;
    if (len) ch += ch;else break;
  }
  return "" + pad + str;
}

module.exports = leftPad;
```

## Organizing your code with ES6 modules
- Explain what ES6 modules are
- [JavaScript Modules: A Beginner’s Guide](https://medium.freecodecamp.org/javascript-modules-a-beginner-s-guide-783f7d7a5fcc)
- Explain why they are good (and used in projects everywhere)
- Explain the import/export syntax a little (just the bare mechanics)
- Write a simple module to import into your previous script (the one you were transpiling with Babel)

An ES6 module is a JavaScript file containing functions, objects or primative values you wish to make available to another JavaScript file; you `export` from one, and `import` in the other. Using modules allows you to break your code into self-contained units and so make things easier to maintain, they help us avoid namespace pollution, and lastly help make our code more portable and reusable.

Whilst the majority of ES6 syntax is widely available in modern browsers, this isn't yet the case with modules. At the time of writing, they're available in Chrome, Safari (inc. the latest iOS version) and Edge, hidden under a flag in Firefox and Opera, not available (and likely never will be) in IE11, nor most mobile devices. To make use of modules then, we'll need to use Babel to transpile things.

### Export
The `export` keyword is what allows us to make our ES6 modules available to other files, and it gives two options for doing so; named and default. With the named export, you can have multiple exorts per module, and with a default export you only have one per module. Named exports are particularly useful where you need to export several values, for example you may have a module containing a number of utility functions that need to be made available in various places within your apps.

There are several ways of using the `export` syntax which are well covered on the [MDN 'export' page](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export) and I don't propose going through them here.

To convert the `leftPad` file into one using ES6 modules, we need only adjust the final line in the file from...

```js
module.exports = leftPad;
```

to

```js
export { leftPad };
```

This gives us a named export.

As there is only a single function to be exported in `leftPad`, it would be a good candidate for using `export default` as below

```js
"use strict";

export default function leftPad(str, len, ch) {
  ...
}

// module.exports = leftPad;
```

Note that the final line has been commented out, as it's no longer required.

### Import

To make use of exported modules, we now need to export them into the file (module) we wish to use them in.

For the `export default` option, the exported module can be imported under any name you wish to choose, for example, `the `leftPad` module can be imported as

```js
import leftPad from './src/leftpad_es6';
```

or could be imported as another name like so

```js
import pineapple_fritter from './src/leftpad_es6';
```

Functionally, both will work exactly the same, but it obviously makes sense to use either the same as it was exported under, or something that makes the import understandable - perhaps where the exported name would clash with another variable name that already exists in the receiving module.

As we've exported `leftPad` as a named export though, we must import it using the same name as it was exported under. For our example module then, we'd import it in a similar manner to that we used with the `export default` syntax, but in this case, we must wrap the imported name with curly braces.

```js
import { leftPad } from './src/leftpad_es6';
```

The braces are mandatory with a named export, and it will fail if they are not used.

It is possible to change the name of a named export on import if needed and to do so, we need to modify our syntax a little using an `import [module] as [path]` syntax. As with `export`, there are a variety of ways to do this, all of which are detailed on the [MDN import page](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import).

```js
import { leftPad as pineapple_fritter } from './src/leftpad_es6';
```

Again, the name change is a little nonsensical, but it illustrates the point that they can be changed to anything. You should keep to good naming practices at all times, unless of course you're writing routines for preparing fruit-based recipes.

To make use of the exported `leftPad`, I created the following `index.js` file to loop through an array of serial numbers, and prefix them with a zero to make them into an 8 character string. Later on, we'll make use of this and post them out to an ordered list element on an HTML page.

```js
"use strict"

import { leftPad } from "./leftpad_es6";

const serNos = [ 6934, 23111, 23114, 1001, 211161];

const strSNos = serNos.map(sn => leftPad( sn, 8, '0' ) );

console.log( strSNos );
```

As we did earlier, run the build script from the root directory

```sh
$ npm run build
```

As with our `leftPad.js` file in the `<ROOT>/public`, you should see that Babel has replaced all of the ES6 syntax and left behind only ES5 syntax. Now we can check to see if the `index.js` recognises the import and runs `leftPad`.

```sh
$ cd <ROOT>/public

$ node script

// [ '00006934', '00023111', '00023114', '00001001', '00211161' ]
```

Your terminal should now log out an array of strings prefixed with zeros to make them all 8 characters long. With that done, it's time to take a look at Webpack.


## Introducing Webpack and integrating it with Babel

As mentioned, ES6 modules allow the JavaScript developer to break their code up into manageable chunks, but the consequence of this is that those chunks have to be served up to the requesting browser, potentially adding dozens of additional HTTP requests back to the server; something we really ought to be looking to avoid. The is where [webpack](https://webpack.js.org/).

Webpack is a module bundler. Its primary purpose is to process your application by tracking down all its dependencies, then package them all up into one or more bundles that can be run in the browser. It can though be far more than that depending upon how its configured.

Webpack configuration is based around 4 key components:

- An entry point
- An output location
- Loaders
- And plugins

**entry:** This holds the start point of your application from where Webpack can identify its dependencies.

**output:** Specifies where you would like the processed bundle to be saved

**loaders:** Are a way of converting one thing as a input and generating something else as an output. They can be used to extend Webpack's capabilities to handle more than just JavaScript files and so convert those into valid modules as well. 

**plugins:** Are used to extend Webpack's capabilities into other tasks beyond bundling e.g. minification, linting and optimisation.

To install Webpack, run the following from your `<ROOT>` directory

```js
$ npm install webpack webpack-cli --save-dev
```

This installs Webpack locally to the project and also gives the ability to run Webpack from the command line. You should now see Webpack listed in your `package.json` file. Whilst you are in that file, modify the scripts section as follows, so that it now knows to use Webpack instead of Babel directly.

```js
 "scripts": {
    "build": "webpack --config webpack.config.js"
  },
```

As you can see, this is calling on a `webpack.config.js` file, so let's create that in our root directory.

```js
var path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "bundle.js"
  }
};
```

This is the simplest config file you need with Webpack and you can see that it only needs to use the **entry** and **output** sections described earlier. Both entry and output points are specified, so if you rerun...

```js
$ npm run build
```

...you'll see that there is now a single `./public/bundle.js` file. Open up the new file though, and two files we started with are now unrecogniseable...

```js
!function(e){var r={};function t(n){if(r[n])return r[n].exports;var o=r[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,t),o.l=!0,o.exports}t.m=e,t.c=r,t.d=function(e,r,n){t.o(e,r)||Object.defineProperty(e,r,{configurable:!1,enumerable:!0,get:n})},t.r=function(e){Object.defineProperty(e,"__esModule",{value:!0})},t.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(r,"a",r),r},t.o=function(e,r){return Object.prototype.hasOwnProperty.call(e,r)},t.p="",t(t.s=0)}([function(e,r,t){"use strict";t.r(r);const n=[6934,23111,23114,1001,211161].map(e=>(function(e,r,t){if((r-=(e+="").length)<=0)return e;if(t||0===t||(t=" ")," "==(t+="")&&r<10)return()=>{};let n="";for(;1&r&&(n+=t),r>>=1;)t+=t;return`${n}${e}`})(e,8,"0"));console.log(n)}]);
```

...but if you run `$ node index.js` from the `public` folder, you'll see you get the same results as we had previously.

As you look through `bundle.js`, you will be able to see that, whilst there's been a considerable amount of obfuscation going on, there are still quite a few signs of ES6 syntax being present (`const`, `let`, `template literals`, `arrow functions`), so let's address that next.

As mentioned earlier, **loaders** allow us to convert one thing into something else; in this case, we want ES6 turning into ES5, and to do that we need a couple more packages.

```sh
$ npm install babel-loader babel-core --save-dev
```

To utilise them, the `webpack.config.js` needs a module section adding to it after the **output** section like so.

```js
module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["babel-preset-env"]
          }
        }
      }
    ]
  }
};
```

This uses a regex statement to identify the JavaScript files to be transpiled with the `babel-loader`, whilst excluding anything in the `node_modules` folder from that. Lastly, the  `babel-loader` is told to use the `babel-preset-env` package installed earlier, to establish the transpile parameters set in the `.babelrc` file.

With that done, you can rerun...

```sh
$ npm run build
```
...then check the new `./public/bundle.js` and you'll see that all signs of ES6 syntax have gone, but it still produces the same output as previously.

## Bringing it to the browser
Having built a functioning Webpack and Babel setup, it's time to bring what we've done to the browser. A small HTML file is needed and this can be created in the `<ROOT>/src` folder as below.

```html
<!DOCTYPE html>
<html>
  <head lang="en">
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Sample Project Folder Demo</title>
  </head>
  <body>
    <main>
      <h1>Parts List</h1>
      <ol id="part-list"></ol>
    </main>
    <script src="./js/bundle.js" charset="utf-8"></script>
  </body>
</html>
```

There's nothing complicated in it. The main points to note are the `<ol></ol>` element, where the array of numbers will be going, and the `<script></script>` element just before the clogin `</body>` tag, linking back to the `./js/bundle.js` file. So far, so good.

A little more JavaScript is needed to display the list though, so let's add that to the bottom of `./src/index.js`, and whilst we're at it, comment out the last two lines in the `index.js` file, as we no longer need those.

```js
// const strSNos = serNos.map(sn => leftPad( sn, 8, '0' ) );

// console.log( strSNos );

const partEl = document.getElementById('part-list');

console.log(partEl);

let strList = "";

serNos.forEach(element => {
  strList += `<li>${ leftPad(element, 8, '0') }</li>`;
});

partEl.innerHTML = strList;
```

- Create an index.html file
- Include the file you are bundling with Webpack
- Ascertain that it runs in the browser

## Taking it further
- Show how to have Webpack watch your files and re-run when it detects changes
- Show how to have Webpack minify your javascript
- Maybe show how to include a library like jQuery and have it available to your bundled code

## Conclusion
- Summarise what readers have learned
- Give them some tips for taking it forward (e.g. other loaders and HMR)
 
The thing to remember with this article is that we have guides to Modules, Webpack and Babel (explaining their mechanics). What we are looking for here is a practical guide to tie everything together.

I would also not worry about SASS; GZIP, ESLIN, Prettier etc as that will quickly increase the length of the article. Maybe you could mention these in the "Taking it further" section.

