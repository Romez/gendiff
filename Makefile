install:
	npm install

publish:
	npm publish --dry-run

build:
	rm -rf dist
	npm run build

lint:
	npx eslint .

test:
	npm run test

test-watch:
	npm run test-watch

help:
	npx babel-node src/bin/gendiff.js -h
