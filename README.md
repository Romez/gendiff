# gendiff

[![Maintainability](https://api.codeclimate.com/v1/badges/ac54df85707b30fa1219/maintainability)](https://codeclimate.com/github/Romez/backend-project-lvl2/maintainability)
[![Build Status](https://travis-ci.com/Romez/gendiff.svg?branch=master)](https://travis-ci.com/Romez/gendiff)

### Description
Compare two configuration files and shows a difference.

### Output example
```
{
    host: hexlet.io
  - timeout: 50
  + timeout: 20
  - proxy: 123.234.53.22
  - follow: false
    common: {
        setting1: Value 1
      - setting2: 200
      - setting3: true
      + setting3: {
            key: value
        }
        setting6: {
            key: value
          + ops: vops
        }
      + follow: false
      + setting4: blah blah
      + setting5: {
            key5: value5
        }
    }
    group1: {
      - baz: bas
      + baz: bars
        foo: bar
      - nest: {
            key: value
        }
      + nest: str
    }
  - group2: {
        abc: 12345
    }
  + verbose: true
  + group3: {
        fee: 100500
    }
}
```

### Options
  -V, --version        output the version number

  -f, --format [type]  Output format [pretty, json, plain] (default: "pretty")

  -k, --key-only       Generate only keys diff (default: false)

  -h, --help           output usage information

### Installation
`npm i -g @romezzz/gendiff`

### Usage json
[![asciicast](https://asciinema.org/a/264560.svg)](https://asciinema.org/a/264560)

### Usage yaml
[![asciicast](https://asciinema.org/a/265040.svg)](https://asciinema.org/a/265040)

### Usage ini
[![asciicast](https://asciinema.org/a/265054.svg)](https://asciinema.org/a/265054)

### Nested data
[![asciicast](https://asciinema.org/a/266000.svg)](https://asciinema.org/a/266000)

### Output formats: pretty(defalut), plain, json
[![asciicast](https://asciinema.org/a/266347.svg)](https://asciinema.org/a/266347)

### Key only output:
[![asciicast](https://asciinema.org/a/296058.svg)](https://asciinema.org/a/296058)
