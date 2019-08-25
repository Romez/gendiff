install:
	npm install

publish:
	npm publish --dry-run

build:
	npm run build

lint:
	npx eslint .

test:
	npm run test

help:
	npx babel-node src/bin/gendiff.js -h
