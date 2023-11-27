all: up

up:
	docker compose up

down:
	docker compose down

clean:
	docker compose down --volumes --rmi all