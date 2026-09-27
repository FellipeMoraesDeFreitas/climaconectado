# controllers.py — Camada Controller (MVC)
# Recebe as requisições HTTP, aciona o Model e devolve a resposta (JSON = "View" da API).

from flask import Blueprint, jsonify, request
from models import QUIZ_PERGUNTAS, DICAS_MITIGACAO, calcular_pegada

api = Blueprint("api", __name__, url_prefix="/api")


@api.get("/quiz")
def get_quiz():
    """Retorna as 10 perguntas do quiz interativo."""
    return jsonify(QUIZ_PERGUNTAS)


@api.get("/dicas")
def get_dicas():
    """Retorna a lista de dicas de mitigação."""
    return jsonify(DICAS_MITIGACAO)


@api.post("/calcular")
def post_calcular():
    """Recebe os hábitos do usuário e devolve a pegada de carbono estimada."""
    dados = request.get_json(silent=True) or {}

    try:
        km_carro_semana = float(dados.get("km_carro_semana", 0))
        kwh_mes = float(dados.get("kwh_mes", 0))
        refeicoes_carne_semana = float(dados.get("refeicoes_carne_semana", 0))
    except (TypeError, ValueError):
        return jsonify({"erro": "Parâmetros inválidos. Envie números em km_carro_semana, kwh_mes e refeicoes_carne_semana."}), 400

    if km_carro_semana < 0 or kwh_mes < 0 or refeicoes_carne_semana < 0:
        return jsonify({"erro": "Os valores não podem ser negativos."}), 400

    resultado = calcular_pegada(km_carro_semana, kwh_mes, refeicoes_carne_semana)
    return jsonify(resultado)


@api.get("/health")
def health():
    """Endpoint simples para checar se a API está no ar."""
    return jsonify({"status": "ok"})
