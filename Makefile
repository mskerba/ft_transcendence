all: up

up:
	docker compose up --build

down:
	docker compose down -v

clean:
	docker compose down --volumes --rmi all