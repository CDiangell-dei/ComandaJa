# 🥟 ComandaJá - Cardápio Digital & Comanda Inteligente em Tempo Real

Sistema web completo de autoatendimento e gestão de pedidos para pastelarias e lanchonetes, desenvolvido para a **Pastelaria & Salgados da Lucilene** (Manaus - AM).

O cliente acessa pelo celular via QR Code ou link, escolhe os pastéis, salgados e bebidas, realiza o pagamento (Pix ou Balcão) e recebe sua comanda digital com senha e acompanhamento do preparo em tempo real. A cozinha recebe os pedidos instantaneamente com alerta sonoro no painel KDS e a Smart TV chama as senhas prontas.

---

## 🚀 Funcionalidades

- **📱 Cardápio Digital Interativo**:
  - Totalmente responsivo e otimizado para celulares.
  - Categorias: Pastéis Tradicionais (R$ 7,00), Diversos & Salgados (Pizza Brotinho, Pastel Folhado, Enroladinho) e Bebidas (Refrigerantes, Regionais Baré/Teté/Magistral e Sucos Naturais 1L de Maracujá, Goiaba e Cupuaçu).
  - Modal de personalização com observações do cliente.
- **💳 Pagamento Flexível**:
  - **Pix Instantâneo**: Geração de QR Code e código Pix "Copia e Cola" padrão Banco Central com chave celular `92994822309` (Maria Lucilene de Jesus Chaves).
  - **Pagar no Balcão**: Dinheiro ou cartão na retirada.
- **📋 Comanda Digital do Cliente**:
  - Senha de atendimento do dia (ex: `P-04`) e número da comanda.
  - Linha do tempo animada com status em tempo real: *Recebido ➔ Fritando ➔ Pronto para Retirada ➔ Entregue*.
  - QR Code para leitura rápida na entrega e comemoração festiva com confetes quando o pedido fica pronto.
- **🍳 Painel da Cozinha (KDS - Kitchen Display System)**:
  - Quadro Kanban com colunas de fluxo de produção (*Novos ➔ Em Fritura ➔ Prontos*).
  - Alerta sonoro imediato a cada novo pedido recebido via WebSocket.
  - Botão de **impressão de comanda térmica não-fiscal** (58mm / 80mm).
- **📺 Telão de Chamada de Senhas (Smart TV)**:
  - Exibição em tela cheia com senhas em preparo e prontas, relógio e sinal sonoro de chamada de senha.
- **⚡ Backend 100% no Supabase**:
  - Banco de dados relacional PostgreSQL na região de São Paulo (`sa-east-1`).
  - Atualização em tempo real via **Supabase Realtime WebSockets** (zero polling).
  - Todos os produtos do cardápio e configurações da loja são gerenciados diretamente pelo Supabase.

---

## 🛠️ Tecnologias Utilizadas

- **React 18** + **Vite**
- **Tailwind CSS**
- **Supabase** (PostgreSQL + Realtime WebSockets)
- **Lucide Icons**
- **Canvas Confetti**
- **Web Audio API** (Sons sintéticos de alta fidelidade sem arquivos pesados)
- **GitHub Actions & GitHub Pages** (CI/CD contínuo)

---

## 💻 Como Rodar Localmente

1. Clone o repositório:
```bash
git clone https://github.com/CDiangell-dei/ComandaJa.git
cd ComandaJa
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

4. Acesse no navegador:
`http://localhost:3000`

---

## 🌐 Deploy Automático no GitHub Pages

O projeto conta com GitHub Actions configurado em `.github/workflows/deploy.yml`. A cada commit na branch `main`, a aplicação é compilada e publicada automaticamente no GitHub Pages.
