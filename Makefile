all: up

up:
	docker-compose up --build &

down:
	docker-compose down
	docker-volume rm ft_transcendence_pgdata_vol

clean:
	docker-compose down --volumes --rmi all