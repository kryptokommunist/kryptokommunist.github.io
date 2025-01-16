# Repo for [kryptokommunist.github.io](https://kryptokommunist.github.io) [![Build Status](https://app.travis-ci.com/kryptokommunist/kryptokommunist.github.io.svg?branch=jekyll)](https://app.travis-ci.com/kryptokommunist/kryptokommunist.github.io)

This is the repo for my personal blog powered by static site generator [jekyll](https://jekyllrb.com) and [github pages](https://pages.github.com).

## Using the docker environment

Generate container: `docker build -t blog`. 

Run with terminal: `docker run -it --rm -v $(pwd):/site -p 4000:4000 blog /bin/bash`

Serve: `bundle exec jekyll serve`.

Generate site: `bundle exec jekyll build`.