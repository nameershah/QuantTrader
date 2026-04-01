# QuantTrader

**Math over emotion. Trade with the mind of a quant.**

QuantTrader is an institutional-grade Explainable AI (XAI) market simulator and trading agent. It bridges the gap between complex quantitative analysis and retail trading by providing deterministic algorithmic signals accompanied by real-time AI mentorship.

[Live Demo](https://quant-trader-dsja3wddi-muhammad-nameer-shahs-projects.vercel.app/dashboard)

## **Description**

QuantTrader is designed to solve the "Black Box" problem in algorithmic trading. Most trading bots execute trades without explaining the underlying logic, leading to a lack of user trust and educational stagnation. 

Our platform uses hard-coded technical indicators (Moving Averages, RSI, and Volatility) to generate signals. These signals are then processed by a high-speed Large Language Model (LLM) via Groq, which acts as a "Quant Mentor" to explain the specific mathematical reasoning behind every market action. By combining deterministic execution with linguistic explanation, QuantTrader enforces disciplined risk management while teaching users the mechanics of quantitative finance.

## **Hackathon Architecture: Resilience & Execution**

Built for the **lablab.ai AI Trading Agents Hackathon (2026)**, QuantTrader features a dual-layer execution strategy:

* **Kraken CLI Integration:** Architected to utilize the Rust-based Kraken CLI for AI-native, high-speed execution via JSON-standard outputs.
* **Failover Protocol:** Implements a high-fidelity synthetic data feed. As of April 1, 2026, during the global Kraken maintenance window, the system automatically triggers an internal volatility model to ensure the **AI Mentor** remains 100% operational for user analysis.
* **Verifiable Intent:** Aligning with ERC-8004 concepts, every trade is validated against server-side risk routers before execution to ensure compliance with portfolio safety limits.

## **Key Features**

* **Explainable AI (XAI):** Real-time streaming of technical analysis reasoning using Llama 3.3 70B via Groq.
* **Deterministic Logic:** Trading signals are generated via strict mathematical rules, ensuring zero AI hallucination in trade execution.
* **Institutional Guardrails:** Built-in risk management engine that blocks trades exceeding 2% portfolio risk or following three consecutive losses.
* **High-Performance UI:** A low-latency, terminal-inspired dashboard built with Next.js 15 and Tailwind CSS.
* **2026-Standard Security:** Implements strict Zod schema validation, semantic LLM isolation (system/user separation), and RSC protocol protection.

## **Tech Stack**

* **Framework:** Next.js (App Router)
* **AI Engine:** Groq SDK (`llama-3.3-70b-versatile`)
* **Execution Layer:** Kraken CLI (MCP-ready)
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
    # Optional: Kraken credentials for live mode
    KRAKEN_API_KEY=your_key
    KRAKEN_PRIVATE_KEY=your_secret
    ```

4.  **Start the development server:**
    ```bash
    npm run dev
    ```

## **License**

This project is licensed under the MIT License.
