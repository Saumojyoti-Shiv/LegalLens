# \# LegalLens

# 

# It provides an AI-powered suite of tools to help users analyze, understand, and compare legal documents.

# 

# \## Brief about the Prototype

# 

# LegalLens is an AI-powered prototype designed to help users understand complex legal documents. It provides a suite of tools to analyze, compare, and ask questions about legal texts, empowering users to identify risks and make more informed decisions without needing a deep legal background. The application leverages Google's Gemini AI model to provide intelligent analysis and insights.

# 

# \## Features Offered

# 

# \*   \*\*Document Simplification \& Summarization:\*\* Breaks down complex legal documents into concise, easy-to-understand summaries, highlighting the key terms and obligations.

# \*   \*\*Risk \& Red Flag Detection:\*\* Automatically scans the document to identify potentially risky or disadvantageous clauses, such as hidden fees, unfair terms, or ambiguous language. It then categorizes these risks by severity (High, Medium, Low).

# \*   \*\*Law/Compliance Checker (Specialized for Indian Law):\*\* Analyzes the document to check for clauses that may violate Indian laws, consumer protection standards, or data privacy acts, providing specific recommendations for each issue.

# \*   \*\*Interactive Question-Answering:\*\* Allows users to have a conversation with their document through a dedicated Q\&A panel, where they can ask specific questions and receive context-aware answers from the AI.

# \*   \*\*Document Comparison Tool:\*\* Enables users to upload two documents (e.g., different loan offers) and receive a side-by-side AI-powered comparison that breaks down the key differences in critical areas like interest rates, penalties, and termination clauses.

# \*   \*\*On-Demand Clause Explanation:\*\* Users can select any piece of text within the document to get an instant, plain-language explanation of what that specific clause means and its implications.

# \*   \*\*Analysis History:\*\* Automatically saves each analysis session, allowing users to easily access and review their past document summaries, risk assessments, and Q\&A history.

# 

# \## Process Flow Diagram

# 

# This diagram illustrates the user's journey and the system's architecture for both the "Analyze" and "Compare" features.

# 

# \### 1. Analyze Document Flow

# 

# ```

# User               | Frontend (Next.js/React)      | Backend (Genkit AI Flows)

# -------------------|-------------------------------|-----------------------------

# 1\. Uploads Doc     -> Uploader Component           |

# &nbsp;                  |   (extracts text)             |

# &nbsp;                  |                               |

# 2\. Clicks "Analyze"-> Calls onAnalyze()             |

# &nbsp;                  |   (shows loading spinners)    |

# &nbsp;                  |                               |

# 3\. App sends text  -> handleSummarize()            -> summarizeLegalDocument()

# &nbsp;  in parallel     |   handleDetectRisks()         -> detectRisks()

# &nbsp;                  |   handleCheckCompliance()     -> checkCompliance()

# &nbsp;                  |                               |   (Calls Gemini AI Model)

# &nbsp;                  |                               |

# 4\. AI returns      <- Receives JSON objects        <- Returns structured JSON

# &nbsp;  structured data |                               |   (Summary, Risks, etc.)

# &nbsp;                  |                               |

# 5\. App displays    -> Renders AnalysisPanel        |

# &nbsp;  results         |   (populates Summary, Risks,  |

# &nbsp;                  |    and Compliance tabs)       |

# &nbsp;                  |                               |

# 6\. User asks Q     -> QAPanel sends question       |

# &nbsp;                  |                               |

# 7\. App sends Q     -> handleQuestion()             -> answerQuestionsAboutDocument()

# &nbsp;  + Doc text      |                               |   (Calls Gemini AI Model)

# &nbsp;                  |                               |

# 8\. AI returns      <- Receives JSON with answer    <- Returns answer

# &nbsp;  answer          |                               |

# &nbsp;                  |                               |

# 9\. App displays    -> Renders new Q\&A in panel     |

# &nbsp;  answer          |                               |

# ```

# 

# \### 2. Compare Documents Flow

# 

# ```

# User               | Frontend (Next.js/React)        | Backend (Genkit AI Flows)

# -------------------|---------------------------------|-----------------------------

# 1\. Uploads 2 Docs  -> ComparisonDocumentPanel (x2)  |

# &nbsp;                  |   (extracts text for A \& B)     |

# &nbsp;                  |                                 |

# 2\. Clicks "Compare"-> Calls handleCompareClick()      |

# &nbsp;                  |   (shows loading spinner)       |

# &nbsp;                  |                                 |

# 3\. App sends both  -> handleCompare()               -> compareDocuments()

# &nbsp;  doc texts       |                                 |   (Calls Gemini AI Model)

# &nbsp;                  |                                 |

# 4\. AI returns      <- Receives JSON with comparison  <- Returns structured JSON

# &nbsp;  comparison      |                                 |   (Topics, Summaries, Verdict)

# &nbsp;                  |                                 |

# 5\. App displays    -> Renders ComparisonResultPanel  |

# &nbsp;  results         |   (shows side-by-side accordion)|

# ```

# 

# \## Running Locally using NPM

# 

# To run this application on your local machine, please follow these steps.

# 

# \### Prerequisites

# 

# \*   Node.js and `npm` installed on your machine.

# \*   A Google AI Gemini API key.

# 

# \### 1. Setup Environment Variables

# 

# Create a new file named `.env` in the root directory of the project and add your Gemini API key to it:

# 

# ```

# GEMINI\_API\_KEY=YOUR\_API\_KEY\_HERE

# ```

# 

# Replace `YOUR\_API\_KEY\_HERE` with your actual API key.

# 

# \### 2. Install Dependencies

# 

# Open your terminal in the project's root directory and run the following command to install the necessary packages:

# 

# ```bash

# npm install

# ```

# 

# \### 3. Run the Application

# 

# You need to run two processes in separate terminal windows for the application to work correctly: the Genkit AI service and the Next.js frontend server.

# 

# \*\*Terminal 1: Start the Genkit AI Service\*\*

# 

# This command starts the Genkit service, which runs your AI flows and makes them available to the frontend.

# 

# ```bash

# npm run genkit:dev

# ```

# 

# \*\*Terminal 2: Start the Next.js Development Server\*\*

# 

# This command starts the Next.js frontend application.

# 

# ```bash

# npm run dev

# ```

# 

# Once both processes are running, you can access the application in your web browser, typically at \*\*http://localhost:9002\*\*.

# 

