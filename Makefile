run-dev:
	docker-compose -f docker-compose.dev.yml up -d

stop-dev:
	docker-compose -f docker-compose.dev.yml down

rebuild:
	docker-compose -f docker-compose.dev.yml build