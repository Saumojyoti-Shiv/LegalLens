# LegalLens

LegalLens is an AI-powered prototype designed to help users understand complex legal documents. It provides a suite of tools to analyze, compare, and ask questions about legal texts, empowering users to identify risks and make more informed decisions without needing a deep legal background. The application leverages Google's Gemini AI model to provide intelligent analysis and insights.

## Features

- **Document Simplification & Summarization:** Breaks down complex legal documents into concise, easy-to-understand summaries, highlighting the key terms and obligations.

- **Risk & Red Flag Detection:** Automatically scans the document to identify potentially risky or disadvantageous clauses, such as hidden fees, unfair terms, or ambiguous language. It then categorizes these risks by severity (High, Medium, Low).

- **Law/Compliance Checker (Specialized for Indian Law):** Analyzes the document to check for clauses that may violate Indian laws, consumer protection standards, or data privacy acts, providing specific recommendations for each issue.

- **Interactive Question-Answering:** Allows users to have a conversation with their document through a dedicated Q&A panel, where they can ask specific questions and receive context-aware answers from the AI.

- **Document Comparison Tool:** Enables users to upload two documents (e.g., different loan offers) and receive a side-by-side AI-powered comparison that breaks down the key differences in critical areas like interest rates, penalties, and termination clauses.

- **On-Demand Clause Explanation:** Users can select any piece of text within the document to get an instant, plain-language explanation of what that specific clause means and its implications.

- **Analysis History:** Automatically saves each analysis session, allowing users to easily access and review their past document summaries, risk assessments, and Q&A history.

## Architecture

This diagram illustrates the user's journey and the system's architecture for both the "Analyze" and "Compare" features.

### 1. Analyze Document Flow

```
User               | Frontend (Next.js/React)      | Backend (Genkit AI Flows)
-------------------|-------------------------------|-----------------------------
1. Uploads Doc     -> Uploader Component           |
                    |   (extracts text)             |
                    |                               |
2. Clicks "Analyze"-> Calls onAnalyze()             |
                    |   (shows loading spinners)    |
                    |                               |
3. App sends text  -> handleSummarize()            -> summarizeLegalDocument()
   in parallel     |   handleDetectRisks()         -> detectRisks()
                   |   handleCheckCompliance()     -> checkCompliance()
                   |                               |   (Calls Gemini AI Model)
                   |                               |
4. AI returns      <- Receives JSON objects        <- Returns structured JSON
   structured data |                               |   (Summary, Risks, etc.)
                   |                               |
5. App displays    -> Renders AnalysisPanel        |
   results         |   (populates Summary, Risks,  |
                   |    and Compliance tabs)       |
                   |                               |
6. User asks Q     -> QAPanel sends question       |
                   |                               |
7. App sends Q     -> handleQuestion()             -> answerQuestionsAboutDocument()
   + Doc text      |                               |   (Calls Gemini AI Model)
                   |                               |
8. AI returns      <- Receives JSON with answer    <- Returns answer
   answer          |                               |
                   |                               |
9. App displays    -> Renders new Q&A in panel     |
   answer          |                               |
```

### 2. Compare Documents Flow

```
User               | Frontend (Next.js/React)        | Backend (Genkit AI Flows)
-------------------|---------------------------------|-----------------------------
1. Uploads 2 Docs  -> ComparisonDocumentPanel (x2)  |
                    |   (extracts text for A & B)     |
                    |                                 |
2. Clicks "Compare"-> Calls handleCompareClick()      |
                    |   (shows loading spinner)       |
                    |                                 |
3. App sends both  -> handleCompare()               -> compareDocuments()
   doc texts       |                                 |   (Calls Gemini AI Model)
                   |                                 |
4. AI returns      <- Receives JSON with comparison  <- Returns structured JSON
   comparison      |                                 |   (Topics, Summaries, Verdict)
                   |                                 |
5. App displays    -> Renders ComparisonResultPanel  |
   results         |   (shows side-by-side accordion)|
```

## Getting Started

### Prerequisites

- Node.js and `npm` installed on your machine
- A Google AI Gemini API key

### 1. Setup Environment Variables

1. Copy the environment template file:
   ```bash
   cp env.template .env
   ```

2. Edit the `.env` file and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

   Get your API key from: https://aistudio.google.com/app/apikey

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the Application

You need to run two processes in separate terminal windows for the application to work correctly:

**Terminal 1: Start the Genkit AI Service**
```bash
npm run genkit:dev
```

**Terminal 2: Start the Next.js Development Server**
```bash
npm run dev
```

Once both processes are running, you can access the application in your web browser at **http://localhost:9002**.

## Tech Stack

- **Frontend:** Next.js 15, React 18, TypeScript
- **UI Components:** Radix UI, Tailwind CSS
- **AI Integration:** Google Genkit, Gemini AI
- **Document Processing:** Mammoth (for .docx files), React-PDF
- **State Management:** React Hooks
- **Form Handling:** React Hook Form with Zod validation

## Project Structure

```
src/
├── ai/                    # AI flows and Genkit configuration
│   ├── flows/            # Individual AI flow implementations
│   └── genkit.ts         # Genkit configuration
├── app/                  # Next.js app directory
│   ├── actions.ts        # Server actions
│   └── layout.tsx        # Root layout
├── components/           # React components
│   ├── legallens/        # LegalLens-specific components
│   └── ui/               # Reusable UI components
├── hooks/                # Custom React hooks
└── lib/                  # Utility functions
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

