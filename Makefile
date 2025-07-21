TMDB_TOKEN ?= seu-token-aqui

setup:
	@echo "Criando .env.local..."
	@echo "VITE_TMDB_API_URL=https://api.themoviedb.org/3" > .env.local
	@echo "Adicionando chave do TMDB no .env.local..."
	@echo "VITE_TMDB_TOKEN=${TMDB_TOKEN}" >> .env.local
	@echo "Fazendo build do projeto..."
	docker compose build

run:
	docker compose up