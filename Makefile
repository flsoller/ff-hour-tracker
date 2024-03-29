create-dev:
	docker-compose -f docker-compose.dev.yml up -d

remove-dev:
	docker-compose -f docker-compose.dev.yml down -v --rmi all

rebuild:
	docker-compose -f docker-compose.dev.yml build && docker-compose -f docker-compose.dev.yml up -d -V

stop-dev:
	docker-compose -f docker-compose.dev.yml stop

start-dev:
	docker-compose -f docker-compose.dev.yml start