import { salvarProgressoNoFirebase, carregarProgressoDoFirebase } from "./js/salvar.js";

// Estado inicial do Necromante
let jogador = {
    nome: "iniciante",
    nivel: 1,
    hp: 108,
    hpMaximo: 108,
    mana: 50,
    almas: 10,
    ossos: 5,
    ataque: 15,
    exercito: []
};

// ID temporário para testes
const TEMP_PLAYER_ID = "necromante_teste_01";

// Referências da Interface (UI)
const btnAjuda = document.getElementById("btn-ajuda-sistema");
const painelDialogo = document.getElementById("sistema-dialogo");
const txtHp = document.getElementById("txt-hp");
const txtAlmas = document.getElementById("txt-almas");
const txtOssos = document.getElementById("txt-ossos");

const btnExplorar = document.getElementById("btn-explorar");
const btnAltar = document.getElementById("btn-altar");
const janelaCombate = document.getElementById("combate-window");
const janelaExercito = document.getElementById("exercito-window");

const inimigoHpTexto = document.getElementById("inimigo-hp");
const logCombate = document.getElementById("log-combate");
const listaExercito = document.getElementById("lista-exercito");

// Estado do Inimigo Atual
let inimigoAtual = {
    nome: "Lobo Corrompido",
    hpMaximo: 50,
    hpAtual: 50,
    dano: 5,
    recompensaAlmas: 8,
    recompensaOssos: 2
};

// O "Sistema" respondendo ao clique
btnAjuda.addEventListener("click", () => {
    const dicasDoSistema = [
        "Seu exército está inexistente. Você está gastando energia vital como um iniciante enterrando ouro em cemitério público. Invoque esqueletos.",
        "O Cemitério Antigo contém resíduos de almas fracas. Excelente para começar a colheita.",
        "Análise tática: Seus pontos de vida estão fortificados. Não desperdice essa vantagem recuando contra alvos inferiores."
    ];
    
    const respostaAleatoria = dicasDoSistema[Math.floor(Math.random() * dicasDoSistema.length)];
    painelDialogo.innerHTML = `<p><strong>[Sistema]:</strong> "${respostaAleatoria}"</p>`;
});

// Navegação - Explorar
btnExplorar.addEventListener("click", () => {
    janelaCombate.style.display = "block";
    janelaExercito.style.display = "none";
    logCombate.innerText = "Um Lobo Corrompido espreita nas sombras.";
    painelDialogo.innerHTML = `<p><strong>[Sistema]:</strong> "Inimigo localizado. Ceife a vida dele e traga os restos."</p>`;
});

// Navegação - Altar
btnAltar.addEventListener("click", () => {
    janelaExercito.style.display = "block";
    janelaCombate.style.display = "none";
    painelDialogo.innerHTML = `<p><strong>[Sistema]:</strong> "O Altar aguarda os seus sacrifícios."</p>`;
});

// Mecânica de Ataque
document.getElementById("btn-atacar").addEventListener("click", async () => {
    if (inimigoAtual.hpAtual <= 0) return;

    // Jogador ataca
    inimigoAtual.hpAtual -= jogador.ataque;
    inimigoHpTexto.innerText = Math.max(0, inimigoAtual.hpAtual);

    if (inimigoAtual.hpAtual <= 0) {
        // Inimigo Morreu
        jogador.almas += inimigoAtual.recompensaAlmas;
        jogador.ossos += inimigoAtual.recompensaOssos;
        
        // Atualiza HUD
        txtAlmas.innerText = jogador.almas;
        txtOssos.innerText = jogador.ossos;
        
        logCombate.innerText = `Vitória! +${inimigoAtual.recompensaAlmas} Almas, +${inimigoAtual.recompensaOssos} Ossos.`;
        painelDialogo.innerHTML = `<p><strong>[Sistema]:</strong> "Um abate limpo. Material recolhido para o Altar."</p>`;
        
        // Salva na nuvem
        await salvarProgressoNoFirebase(TEMP_PLAYER_ID, jogador);

        // Reseta o inimigo para o próximo combate após 2 segundos
        setTimeout(() => {
            inimigoAtual.hpAtual = inimigoAtual.hpMaximo;
            inimigoHpTexto.innerText = inimigoAtual.hpAtual;
            janelaCombate.style.display = "none";
            logCombate.innerText = "";
        }, 2000);
    } else {
        // Inimigo contra-ataca
        jogador.hp -= inimigoAtual.dano;
        txtHp.innerText = `${jogador.hp}/${jogador.hpMaximo}`;
        logCombate.innerText = `Você causou ${jogador.ataque} de dano. O lobo revidou com ${inimigoAtual.dano}.`;
    }
});

// Mecânica de Fuga
document.getElementById("btn-fugir").addEventListener("click", () => {
    janelaCombate.style.display = "none";
    logCombate.innerText = "";
    painelDialogo.innerHTML = `<p><strong>[Sistema]:</strong> "Recuando? Sobreviver é lógico, mas covardia não levanta exércitos."</p>`;
});

// Mecânica de Invocação
document.getElementById("btn-invocar-esqueleto").addEventListener("click", async () => {
    if (jogador.almas >= 10 && jogador.ossos >= 5) {
        jogador.almas -= 10;
        jogador.ossos -= 5;
        
        jogador.exercito.push("Esqueleto Guerreiro");
        
        // Atualiza HUD
        txtAlmas.innerText = jogador.almas;
        txtOssos.innerText = jogador.ossos;
        
        painelDialogo.innerHTML = `<p><strong>[Sistema]:</strong> "Os ossos se unem. A alma se vincula. Mais um soldado para as nossas fileiras."</p>`;
        
        atualizarExercicioNaTela();
        
        // Salva na nuvem
        await salvarProgressoNoFirebase(TEMP_PLAYER_ID, jogador);
    } else {
        painelDialogo.innerHTML = `<p><strong>[Sistema]:</strong> "Recursos insuficientes. Faltam cadáveres, mestre."</p>`;
    }
});

// Função para atualizar visualmente o exército
function atualizarExercicioNaTela() {
    if (jogador.exercito.length === 0) return;
    
    // Conta quantos esqueletos existem no array
    let quantidadeEsqueletos = jogador.exercito.filter(t => t === "Esqueleto Guerreiro").length;
    listaExercito.innerHTML = `<p>Esqueletos Guerreiros: <strong>${quantidadeEsqueletos}</strong></p>`;
}