start:
	npm run start

build:
	npm run build

test:
	jest --collect-coverage

push: test
	git push