
images= `sudo docker images -qa`
volumes= `sudo docker volume ls -q`

all: up 


up:
	docker compose up

down:
	docker compose down

rm_images:
	docker rmi -f $(images)

rm_volumes:
	docker volume rm $(volumes)

clean:
	docker compose down --volumes --rmi all

prune:
	docker system prune -af