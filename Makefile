.PHONY: build dev s3
include .env

site:
	docker run --rm \
		-it \
  		-v "$(CURDIR):/srv/jekyll" \
  		-v "$(CURDIR)/.cache:/usr/local/bundle" \
		jekyll/jekyll:latest \
  		jekyll build

serve:
	docker run --rm \
		-it \
  		-v "$(CURDIR):/srv/jekyll" \
  		-v "$(CURDIR)/.cache:/usr/local/bundle" \
		-p 4000:4000 \
		-p 35729:35729 \
		-p 3000:3000 \
		jekyll/jekyll:latest \
  		jekyll serve

s3: site
	docker run --rm \
	-ti \
	-v $(CURDIR):/website \
	-e AWS_ACCESS_KEY=${AWS_ACCESS_KEY} \
	-e AWS_SECRET_KEY=${AWS_SECRET_KEY} \
 	attensee/s3_website push