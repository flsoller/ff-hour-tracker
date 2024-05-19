create-dev:
	docker compose -f compose.dev.yml up -d

remove-dev:
	docker compose -f compose.dev.yml down -v --rmi all

rebuild:
	docker compose -f compose.dev.yml build && docker compose -f compose.dev.yml up -d -V

stop-dev:
	docker compose -f compose.dev.yml stop

start-dev:
	docker compose -f compose.dev.yml start