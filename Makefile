install:
	npm ci

publish:
	npm publish --dry-run

build:
	rm -rf dist
	npm run build

lint:
	npx eslint .

test:
	npm test

test-watch:
	npm run test-watch

help:
	@npx babel-node src/bin/gendiff.js -h

run:
	npx babel-node src/bin/gendiff.js __tests__/__fixtures__/before.json __tests__/__fixtures__/after.json

run-key-only:
	npx babel-node src/bin/gendiff.js -k __tests__/__fixtures__/before.json __tests__/__fixtures__/after.json

link:
	make build
	npm link
