# QuantTrader

**Math over emotion. Trade with the mind of a quant.**

QuantTrader is an institutional-grade Explainable AI (XAI) trading mentor and market simulator. It bridges the gap between complex quantitative analysis and retail trading by providing deterministic algorithmic signals accompanied by real-time AI mentorship.

[Live Demo](https://quant-trader-dsja3wddi-muhammad-nameer-shahs-projects.vercel.app/dashboard)

---

## **Description**

QuantTrader solves the "Black Box" problem in algorithmic trading. Most trading bots execute trades without explaining the underlying logic, which leads to a lack of user trust and emotional "revenge trading" during market volatility. 

Our platform uses hard-coded technical indicators, including Moving Averages, RSI, and Volatility models, to generate high-probability signals. These signals are processed by a high-speed Large Language Model (LLM) via Groq, which acts as a "Quant Mentor." This layer explains the specific mathematical reasoning behind every market action in plain English. By combining deterministic execution with linguistic explanation, QuantTrader enforces disciplined risk management while teaching users the mechanics of quantitative finance.

## **Hackathon Architecture: Hybrid Execution & Trust**

Built for the **lablab.ai AI Trading Agents Hackathon (2026)**, QuantTrader utilizes a dual-layer strategy that balances high-speed execution with decentralized verifiability:

* **Kraken CLI Integration:** Architected to utilize the Rust-based Kraken CLI for AI-native, high-speed execution via JSON-standard outputs and MCP-ready environment handling.
* **On-Chain Verification (ERC-8004):** Every trade intent is validated through the official **Sepolia (Chain ID: 11155111)** shared infrastructure. We utilize the **RiskRouter** to enforce our 2% risk cap on-chain before execution and post decision checkpoints to the **ValidationRegistry** to anchor our reasoning proofs.
* **Failover Protocol:** Implements a high-fidelity synthetic data feed. During Kraken maintenance windows (such as the April 1st window), the system automatically triggers an internal volatility model to ensure the **AI Mentor** remains 100% operational for user analysis.

## **Key Features**

* **Explainable AI (XAI):** Real-time streaming of technical analysis reasoning using **Llama 3.3 70B** via **Groq** for ultra-low latency.
* **Deterministic Logic:** Trading signals are generated via strict mathematical rules, ensuring zero AI hallucination in the core execution layer.
* **On-Chain Accountability:** Direct integration with **ERC-8004 Shared Contracts**:
    * **AgentRegistry:** `0x97b07dDc405B0c28B17559aFFE63BdB3632d0ca3` (Agent Identity)
    * **RiskRouter:** `0xd6A6952545FF6E6E6681c2d15C59f9EB8F40FdBC` (Intent Validation)
    * **ValidationRegistry:** `0x92bF63E5C7Ac6980f237a7164Ab413BE226187F1` (Decision Proofs)
* **Institutional Guardrails:** Built-in risk management engine that blocks trades exceeding **2% portfolio risk** or following **three consecutive losses**.
* **High-Performance UI:** A low-latency, terminal-inspired dashboard built with **Next.js 15** and **Tailwind CSS**.

## **Tech Stack**

* **Framework:** Next.js 15 (App Router)
* **AI Engine:** Groq SDK (`llama-3.3-70b-versatile`)
* **Execution Layer:** Kraken CLI (MCP-ready)
* **Blockchain Layer:** Ethereum Sepolia (ERC-8004 Infrastructure)
* **Styling:** Tailwind CSS & Lucide Icons
* **Validation:** Zod (Strict Schema Enforcement)
* **Deployment:** Vercel

## **How to Run Locally**

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/nameershah/QuantTrader.git](https://github.com/nameershah/QuantTrader.git)
    cd QuantTrader
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env.local` file and add your credentials:
    ```env
    GROQ_API_KEY=your_groq_api_key_here
    # Optional: Kraken & Sepolia credentials for live mode
    KRAKEN_API_KEY=your_key
    KRAKEN_PRIVATE_KEY=your_secret
    SEPOLIA_RPC_URL=your_rpc_url
    PRIVATE_KEY=your_wallet_private_key
    ```

4.  **Start the development server:**
    ```bash
    npm run dev
    ```

## **License**

This project is licensed under the MIT License.
