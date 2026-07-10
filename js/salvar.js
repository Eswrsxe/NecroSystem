// Importando as funções necessárias dos SDKs do Firebase via CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Configuração do seu projeto Firebase (Cole as suas credenciais aqui após criar o projeto no console do Firebase)
const firebaseConfig = {
    apiKey: "SUA_API_KEY",
    authDomain: "SEU_AUTH_DOMAIN",
    projectId: "SEU_PROJECT_ID",
    storageBucket: "SEU_STORAGE_BUCKET",
    messagingSenderId: "SEU_MESSAGING_SENDER_ID",
    appId: "SEU_APP_ID"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Função para salvar os dados do Necromante na nuvem
export async function salvarProgressoNoFirebase(playerId, dadosJogador) {
    try {
        await setDoc(doc(db, "jogadores", playerId), dadosJogador, { merge: true });
        console.log("Progresso guardado na sepultura (nuvem) com sucesso!");
    } catch (error) {
        console.error("Erro ao salvar no altar da nuvem: ", error);
    }
}

// Função para carregar os dados do Necromante
export async function carregarProgressoDoFirebase(playerId) {
    const docRef = doc(db, "jogadores", playerId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        console.log("Nenhum Necromante encontrado com este ID. Criando nova jornada...");
        return null; // Retorna nulo para iniciar os dados padrões da V1
    }
}