PubStorm Homepage
=================

### Setup

1. Install NodeJS

```
nvm install v4.2.1
nvm alias default v4.2.1
```

2. Install dependencies

```
npm install
```

3. Add the following to your `.{z,ba}shrc`:

```
# prefer locally installed node module binaries
export PATH="node_modules/.bin:$PATH"
```

4. Install `Jade/Pug` highlighters:
  * Atom: <https://atom.io/packages/language-jade>
  * Sublime: <https://packagecontrol.io/packages/Jade>
  * Vim: <https://github.com/digitaltoad/vim-pug>

5. To develop, run `gulp` to start watching the `src` folder and run `python -m SimpleHTTPServer` in `build/dev` to serve the assets. Forward port 8000 using SSH or Nitrogen.

6. To deploy, run `gulp dist` and then `storm deploy`.

- - -
Copyright (c) 2016 Nitrous, Inc. All Rights Reserved.
