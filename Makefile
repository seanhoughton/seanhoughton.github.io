.PHONY: serve
serve:
	hugo serve -D


.PHONY: site
site:
	hugo -D

.PHONY: publish
publish: site
	hugo deploy gcp