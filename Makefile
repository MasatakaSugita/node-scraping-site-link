up:
	docker-compose up --build

down:
	docker-compose down

run:
	docker-compose exec app node ${SRC}