# QuantTrader

**Math over emotion. Trade with the mind of a quant.**

QuantTrader is an institutional-grade Explainable AI (XAI) market simulator. It bridges the gap between complex quantitative analysis and retail trading by providing deterministic algorithmic signals accompanied by real-time AI mentorship.

[Live Demo](https://quant-trader-dsja3wddi-muhammad-nameer-shahs-projects.vercel.app/dashboard)

## **Description**

QuantTrader is designed to solve the "Black Box" problem in algorithmic trading. Most trading bots execute trades without explaining the underlying logic, leading to a lack of user trust and educational stagnation. 

Our platform uses hard-coded technical indicators (Moving Averages, RSI, and Volatility) to generate signals. These signals are then processed by a high-speed Large Language Model (LLM) via Groq, which acts as a "Quant Mentor" to explain the specific mathematical reasoning behind every market action. By combining deterministic execution with linguistic explanation, QuantTrader enforces disciplined risk management while teaching users the mechanics of quantitative finance.

## **Key Features**

* **Explainable AI (XAI):** Real-time streaming of technical analysis reasoning using Llama 3.3 70B.
* **Deterministic Logic:** Trading signals are generated via strict mathematical rules, ensuring zero AI hallucination in trade execution.
* **Institutional Guardrails:** Built-in risk management engine that blocks trades exceeding 2% portfolio risk or following three consecutive losses.
* **High-Performance UI:** A low-latency, terminal-inspired dashboard built with Next.js 14 and Tailwind CSS.
* **2026-Standard Security:** Implements strict Zod schema validation, semantic LLM isolation (system/user separation), and RSC protocol protection.

## **Tech Stack**

* **Framework:** Next.js (App Router)
* **AI Engine:** Groq SDK (`llama-3.3-70b-versatile`)
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
    Create a `.env.local` file and add your Groq API key:
    ```env
    GROQ_API_KEY=your_groq_api_key_here
    ```

4.  **Start the development server:**
    ```bash
    npm run dev
    ```

## **License**

This project is licensed under the MIT License.
