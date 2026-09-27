# app.py — Ponto de entrada do back-end (View/roteamento HTTP via Flask)
# Estrutura MVC:
#   models.py      -> Model      (dados e regras de negócio)
#   controllers.py -> Controller (rotas / lógica de requisição-resposta)
#   app.py         -> inicializa a aplicação e liga tudo

from flask import Flask
from controllers import api


def create_app():
    app = Flask(__name__)
    app.register_blueprint(api)

    # CORS simples (sem dependência externa), para permitir que o front-end,
    # servido separadamente, consuma esta API.
    @app.after_request
    def add_cors_headers(response):
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
        return response

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True, port=5000)
