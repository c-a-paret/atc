start:
	npm run start

build:
	npm run build && git add . && git commit

test:
	jest --collect-coverage

push: test build
	git push