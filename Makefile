init:
	bundler install

build:
	jekyll build

dev:
	jekyll serve

s3: build
	s3_website push