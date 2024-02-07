all: up

up:
	docker compose up --build

down:
<<<<<<< HEAD
	docker compose down -v
=======
	docker compose down
>>>>>>> ee6ff6fbb9b5e3f517d5d47b14548805fae43b4d

clean:
	docker compose down --volumes --rmi all