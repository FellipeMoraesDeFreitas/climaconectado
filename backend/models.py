# models.py — Camada Model (MVC)
# Concentra os dados e as regras de negócio da aplicação.

QUIZ_PERGUNTAS = [
    {
        "pergunta": "Qual é o principal gás de efeito estufa emitido por atividades humanas?",
        "opcoes": ["Oxigênio", "Dióxido de carbono (CO2)", "Nitrogênio", "Hidrogênio"],
        "correta": 1,
    },
    {
        "pergunta": "O Acordo de Paris estabeleceu como meta limitar o aquecimento global a quanto, preferencialmente?",
        "opcoes": ["1,5°C", "5°C", "10°C", "0,1°C"],
        "correta": 0,
    },
    {
        "pergunta": "Qual setor é uma das maiores fontes de emissão de CO2 no mundo?",
        "opcoes": ["Educação", "Geração de energia", "Artes", "Esportes"],
        "correta": 1,
    },
    {
        "pergunta": "O desmatamento contribui para o aquecimento global porque:",
        "opcoes": [
            "Reduz a capacidade de absorção de CO2",
            "Aumenta a umidade do ar",
            "Resfria o solo",
            "Não tem relação com o clima",
        ],
        "correta": 0,
    },
    {
        "pergunta": 'O que é a "pegada de carbono"?',
        "opcoes": [
            "Um tipo de pegada de animal",
            "A quantidade de gases de efeito estufa emitidos por uma pessoa ou atividade",
            "Uma marca de calçado sustentável",
            "Um índice de poluição do ar apenas",
        ],
        "correta": 1,
    },
    {
        "pergunta": "Qual dessas ações reduz emissões de CO2?",
        "opcoes": [
            "Usar mais transporte individual motorizado",
            "Priorizar transporte público e bicicleta",
            "Aumentar o consumo de carne vermelha",
            "Desperdiçar energia elétrica",
        ],
        "correta": 1,
    },
    {
        "pergunta": "O aumento do nível do mar é causado principalmente por:",
        "opcoes": [
            "Derretimento de gelo e expansão térmica da água",
            "Aumento da chuva",
            "Erosão costeira apenas",
            "Marés mais fortes",
        ],
        "correta": 0,
    },
    {
        "pergunta": "Energias renováveis incluem:",
        "opcoes": ["Carvão e petróleo", "Solar e eólica", "Gás natural", "Diesel"],
        "correta": 1,
    },
    {
        "pergunta": "O ODS 13 da ONU trata de:",
        "opcoes": [
            "Erradicação da pobreza",
            "Ação contra a mudança global do clima",
            "Igualdade de gênero",
            "Educação de qualidade",
        ],
        "correta": 1,
    },
    {
        "pergunta": "Reduzir o desperdício de alimentos ajuda o clima porque:",
        "opcoes": [
            "Não tem nenhum efeito",
            "Diminui emissões ligadas à produção e ao descarte de comida",
            "Aumenta o consumo de energia",
            "Aumenta o desmatamento",
        ],
        "correta": 1,
    },
]

DICAS_MITIGACAO = [
    {
        "titulo": "Priorize o transporte ativo",
        "texto": "Ir a pé, de bicicleta ou de transporte público reduz bastante suas emissões de CO2 em relação ao carro.",
    },
    {
        "titulo": "Economize energia elétrica",
        "texto": "Desligue aparelhos em stand-by e prefira lâmpadas de LED — pequenos hábitos reduzem seu consumo mensal.",
    },
    {
        "titulo": "Reduza o desperdício de alimentos",
        "texto": "Planeje as compras e reaproveite as sobras. Alimento desperdiçado também representa emissões desperdiçadas.",
    },
    {
        "titulo": "Diminua o consumo de carne vermelha",
        "texto": "A pecuária é uma das maiores fontes de metano. Reduzir o consumo, mesmo que gradualmente, já ajuda.",
    },
    {
        "titulo": "Separe o lixo para reciclagem",
        "texto": "Reciclar economiza energia e matéria-prima em relação à produção de itens novos.",
    },
]

# Fatores de emissão aproximados usados na calculadora de pegada de carbono.
# Fontes de referência: médias de estudos de inventário de emissões (a citar
# na documentação final com a fonte exata escolhida pelo grupo).
FATOR_CO2_KM_CARRO = 0.192      # kg CO2 por km rodado de carro
FATOR_CO2_KWH = 0.0817          # kg CO2 por kWh (fator médio do SIN - Brasil)
FATOR_CO2_REFEICAO_CARNE = 3.3  # kg CO2 por refeição com carne vermelha
SEMANAS_POR_MES = 4.345


def calcular_pegada(km_carro_semana: float, kwh_mes: float, refeicoes_carne_semana: float) -> dict:
    """Regra de negócio: estima a pegada de carbono mensal (kg CO2)."""
    co2_transporte = km_carro_semana * FATOR_CO2_KM_CARRO * SEMANAS_POR_MES
    co2_energia = kwh_mes * FATOR_CO2_KWH
    co2_alimentacao = refeicoes_carne_semana * FATOR_CO2_REFEICAO_CARNE * SEMANAS_POR_MES

    total = co2_transporte + co2_energia + co2_alimentacao

    if total > 400:
        nivel = "alto"
    elif total > 200:
        nivel = "medio"
    else:
        nivel = "baixo"

    return {
        "total_kg_mes": round(total, 1),
        "detalhamento": {
            "transporte_kg": round(co2_transporte, 1),
            "energia_kg": round(co2_energia, 1),
            "alimentacao_kg": round(co2_alimentacao, 1),
        },
        "nivel": nivel,
    }
