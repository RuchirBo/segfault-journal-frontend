github:
	-git commit -a
	git push origin main

tests:
	npx jest

deploy: tests github
	git push heroku main