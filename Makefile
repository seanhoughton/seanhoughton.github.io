.PHONY: serve
serve:
	hugo serve -D


.PHONY: site
site:
	HUGO_ENV=production hugo -D

.PHONY: publish
publish: site
	GOOGLE_APPLICATION_CREDENTIALS=gcp-creds.json hugo deploy gcp