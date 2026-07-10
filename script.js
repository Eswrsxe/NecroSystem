import { salvarProgressoNoFirebase, carregarProgressoDoFirebase } from "./js/salvar.js";

// Estado inicial do Necromante
let jogador = {
    nome: "Rennan",
    nivel: 1,
    hp: 108, // Baseado na passiva Sangue de Ferro
    mana: 50,
    almas: 10,
    ossos: 5,
    exercito: []
};

// ID temporário para testes antes de implementar o sistema de Login completo
const TEMP_PLAYER_ID = "necromante_teste_01";

// Referências da Interface (UI)
const btnAjuda = document.getElementById("btn-ajuda-sistema");
const painelDialogo = document.getElementById("sistema-dialogo");
const txtAlmas = document.getElementById("txt-almas");

// O "Sistema" respondendo ao clique com sua personalidade fria e analítica
btnAjuda.addEventListener("click", () => {
    const dicasDoSistema = [
        "Seu exército está inexistente. Você está gastando energia vital como um iniciante enterrando ouro em cemitério público. Invoque esqueletos.",
        "O Cemitério Antigo contém resíduos de almas fracas. Excelente para começar a colheita.",
        "Análise tática: Seus pontos de vida estão estáveis em 108 devido à sua estrutura física fortificada. Não desperdice essa vantagem recuando contra alvos inferiores."
    ];
    
    // Escolhe uma resposta aleatória do Sistema
    const respostaAleatoria = dicasDoSistema[Math.floor(Math.random() * dicasDoSistema.length)];
    painelDialogo.innerHTML = `<p><strong>[Sistema]:</strong> "${respostaAleatoria}"</p>`;
});

// Simulação de ganho de recursos ao explorar
document.getElementById("btn-explorar").addEventListener("click", async () => {
    jogador.almas += 5;
    txtAlmas.innerText = jogador.almas;
    
    painelDialogo.innerHTML = `<p><strong>[Sistema]:</strong> "+5 Almas ceifadas com sucesso. Salvando progresso no banco de dados..."</p>`;
    
    // Salva automaticamente no Firebase a cada ação relevante
    await salvarProgressoNoFirebase(TEMP_PLAYER_ID, jogador);
});