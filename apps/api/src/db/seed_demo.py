from __future__ import annotations

from sqlalchemy.orm import Session

from src.models.exam import Exam
from src.models.option import Option
from src.models.question import Question
from src.models.user import User
from src.utils.passwords import hash_password


def seed_demo(db: Session) -> None:
    # Create admin user
    admin_email = "admin@example.com"
    if not db.query(User).filter(User.email == admin_email).first():
        db.add(User(email=admin_email, password_hash=hash_password("AdminPass!123"), is_admin=True))
        db.commit()

    # Check if exams already exist
    existing_count = db.query(Exam).count()
    if existing_count > 0:
        return

    # Create multiple practice exams with realistic Azure AI-103 content
    exams_data = [
        {
            "title": "Azure AI Fundamentals - Practice Assessment",
            "description": "Core concepts of Azure AI services, cognitive capabilities, and responsible AI principles.",
            "duration": 3600,  # 60 minutes
            "questions": _get_fundamentals_questions(),
        },
        {
            "title": "Azure OpenAI & Generative AI - Practice Test",
            "description": "Focus on Azure OpenAI Service, prompt engineering, and building generative AI solutions.",
            "duration": 4500,  # 75 minutes
            "questions": _get_openai_questions(),
        },
        {
            "title": "Computer Vision & Document Intelligence",
            "description": "Azure AI Vision, Custom Vision, Form Recognizer, and document processing solutions.",
            "duration": 3600,  # 60 minutes
            "questions": _get_vision_questions(),
        },
        {
            "title": "Full AI-103 Practice Exam",
            "description": "Comprehensive practice assessment covering all AI-103 exam objectives.",
            "duration": 6000,  # 100 minutes
            "questions": _get_comprehensive_questions(),
        },
    ]

    for exam_data in exams_data:
        exam = Exam(
            title=exam_data["title"],
            description=exam_data["description"],
            duration_seconds=exam_data["duration"],
            is_published=True,
        )
        db.add(exam)
        db.flush()

        for idx, (prompt, topics, options) in enumerate(exam_data["questions"], start=1):
            question = Question(
                exam_id=exam.id,
                prompt=prompt,
                position=idx,
                topics=topics,
            )
            db.add(question)
            db.flush()

            for option_idx, (text, is_correct) in enumerate(options, start=1):
                db.add(
                    Option(
                        question_id=question.id,
                        text=text,
                        is_correct=is_correct,
                        position=option_idx,
                    )
                )

    db.commit()


def _get_fundamentals_questions():
    return [
        (
            "What is the primary purpose of Azure AI Search?",
            ["search", "fundamentals"],
            [
                ("Enable full-text search and vector search capabilities over indexed content", True),
                ("Manage virtual machine deployments", False),
                ("Configure network security groups", False),
            ],
        ),
        (
            "Which Azure AI service provides optical character recognition (OCR) capabilities?",
            ["vision", "ocr"],
            [
                ("Azure AI Vision", True),
                ("Azure AI Language", False),
                ("Azure AI Speech", False),
            ],
        ),
        (
            "What is a key principle of Responsible AI?",
            ["responsible-ai", "ethics"],
            [
                ("Fairness, reliability, privacy, inclusiveness, transparency, and accountability", True),
                ("Maximizing model accuracy at any cost", False),
                ("Collecting as much user data as possible", False),
            ],
        ),
        (
            "Which service would you use to translate text between languages?",
            ["language", "translation"],
            [
                ("Azure AI Translator", True),
                ("Azure AI Vision", False),
                ("Azure AI Speech", False),
            ],
        ),
        (
            "What is the purpose of Azure AI Content Safety?",
            ["content-safety", "moderation"],
            [
                ("Detect harmful content including hate speech, violence, and self-harm", True),
                ("Optimize database queries", False),
                ("Manage storage accounts", False),
            ],
        ),
        (
            "Which Azure service enables you to build custom machine learning models?",
            ["machine-learning", "custom-models"],
            [
                ("Azure Machine Learning", True),
                ("Azure Functions", False),
                ("Azure Logic Apps", False),
            ],
        ),
        (
            "What is the primary use case for Azure AI Speech?",
            ["speech", "audio"],
            [
                ("Convert speech to text and text to speech", True),
                ("Analyze images for objects", False),
                ("Translate documents", False),
            ],
        ),
        (
            "Which authentication method is recommended for Azure AI services in production?",
            ["security", "authentication"],
            [
                ("Managed Identity with Azure Key Vault", True),
                ("Hardcoded API keys in source code", False),
                ("Shared access signatures in URLs", False),
            ],
        ),
        (
            "What is Azure AI Document Intelligence primarily used for?",
            ["document-intelligence", "forms"],
            [
                ("Extract structured data from documents and forms", True),
                ("Create virtual networks", False),
                ("Monitor application performance", False),
            ],
        ),
        (
            "Which pricing tier allows you to test Azure AI services for free?",
            ["pricing", "fundamentals"],
            [
                ("Free (F0) tier with usage limits", True),
                ("Enterprise tier only", False),
                ("All tiers require payment upfront", False),
            ],
        ),
    ]


def _get_openai_questions():
    return [
        (
            "What is the maximum token limit for GPT-4 in Azure OpenAI Service?",
            ["openai", "tokens"],
            [
                ("Varies by model version, up to 128K tokens", True),
                ("Always 4,096 tokens", False),
                ("Unlimited tokens", False),
            ],
        ),
        (
            "Which parameter controls the randomness of Azure OpenAI model outputs?",
            ["openai", "parameters"],
            [
                ("Temperature", True),
                ("Frequency", False),
                ("Latency", False),
            ],
        ),
        (
            "What is the purpose of system messages in Azure OpenAI chat completions?",
            ["openai", "prompts"],
            [
                ("Define the assistant's behavior and personality", True),
                ("Store user conversation history", False),
                ("Configure billing settings", False),
            ],
        ),
        (
            "Which Azure OpenAI model is best suited for code generation?",
            ["openai", "models"],
            [
                ("GPT-4 or Codex models", True),
                ("DALL-E 3", False),
                ("Whisper", False),
            ],
        ),
        (
            "What is Retrieval Augmented Generation (RAG)?",
            ["openai", "rag"],
            [
                ("Combining LLMs with external data sources to improve accuracy", True),
                ("A method to reduce model size", False),
                ("A type of image generation", False),
            ],
        ),
        (
            "How do you implement content filtering in Azure OpenAI?",
            ["openai", "content-safety"],
            [
                ("Configure content filters in the Azure OpenAI Studio or via API", True),
                ("Content filtering is not available", False),
                ("Only through third-party services", False),
            ],
        ),
        (
            "What is the purpose of embeddings in Azure OpenAI?",
            ["openai", "embeddings"],
            [
                ("Convert text into numerical vectors for semantic search and similarity", True),
                ("Compress images", False),
                ("Encrypt data", False),
            ],
        ),
        (
            "Which deployment type provides dedicated capacity in Azure OpenAI?",
            ["openai", "deployment"],
            [
                ("Provisioned Throughput Units (PTU)", True),
                ("Shared tier only", False),
                ("Free tier", False),
            ],
        ),
        (
            "What is prompt engineering?",
            ["openai", "prompts"],
            [
                ("Crafting effective instructions to guide AI model behavior", True),
                ("Writing code for Azure Functions", False),
                ("Designing database schemas", False),
            ],
        ),
        (
            "How can you reduce hallucinations in Azure OpenAI responses?",
            ["openai", "best-practices"],
            [
                ("Use RAG, provide clear context, and set appropriate temperature", True),
                ("Increase token limits", False),
                ("Use only free tier models", False),
            ],
        ),
    ]


def _get_vision_questions():
    return [
        (
            "Which Azure AI Vision feature can detect and read text in images?",
            ["vision", "ocr"],
            [
                ("Read API (OCR)", True),
                ("Face API", False),
                ("Spatial Analysis", False),
            ],
        ),
        (
            "What is the purpose of Custom Vision in Azure?",
            ["vision", "custom-models"],
            [
                ("Train custom image classification and object detection models", True),
                ("Manage virtual machines", False),
                ("Configure load balancers", False),
            ],
        ),
        (
            "Which service would you use to extract data from invoices and receipts?",
            ["document-intelligence", "prebuilt"],
            [
                ("Azure AI Document Intelligence with prebuilt models", True),
                ("Azure Blob Storage", False),
                ("Azure SQL Database", False),
            ],
        ),
        (
            "What is spatial analysis in Azure AI Vision?",
            ["vision", "spatial"],
            [
                ("Analyze people's movement and presence in physical spaces using video", True),
                ("Analyze text sentiment", False),
                ("Translate languages", False),
            ],
        ),
        (
            "Which format does Azure AI Vision support for image input?",
            ["vision", "formats"],
            [
                ("JPEG, PNG, BMP, and GIF", True),
                ("Only PDF files", False),
                ("Only RAW camera files", False),
            ],
        ),
        (
            "What is the Image Analysis 4.0 API used for?",
            ["vision", "analysis"],
            [
                ("Generate captions, tags, objects, and dense captions for images", True),
                ("Create new images from text", False),
                ("Compress video files", False),
            ],
        ),
        (
            "How do you train a Custom Vision model?",
            ["vision", "training"],
            [
                ("Upload labeled images and use the training API or portal", True),
                ("Custom Vision doesn't support training", False),
                ("Only through Azure CLI", False),
            ],
        ),
        (
            "What is the purpose of the Face API in Azure AI?",
            ["vision", "face"],
            [
                ("Detect, recognize, and analyze human faces in images", True),
                ("Generate synthetic faces", False),
                ("Edit facial features", False),
            ],
        ),
        (
            "Which Azure service can extract layout and structure from documents?",
            ["document-intelligence", "layout"],
            [
                ("Azure AI Document Intelligence Layout model", True),
                ("Azure Cosmos DB", False),
                ("Azure Event Grid", False),
            ],
        ),
        (
            "What is the confidence score in Azure AI Vision responses?",
            ["vision", "confidence"],
            [
                ("A value between 0 and 1 indicating the model's certainty", True),
                ("The number of objects detected", False),
                ("The image resolution", False),
            ],
        ),
    ]


def _get_comprehensive_questions():
    return [
        (
            "You need to build a chatbot that answers questions using your company's internal documentation. Which architecture should you use?",
            ["openai", "rag", "architecture"],
            [
                ("Azure OpenAI with RAG pattern using Azure AI Search for document indexing", True),
                ("Azure Functions with hardcoded responses", False),
                ("Azure SQL Database with stored procedures", False),
            ],
        ),
        (
            "Which Azure service combination enables real-time speech translation?",
            ["speech", "translation"],
            [
                ("Azure AI Speech with Azure AI Translator", True),
                ("Azure AI Vision with Azure OpenAI", False),
                ("Azure Logic Apps with Azure Functions", False),
            ],
        ),
        (
            "You need to detect personally identifiable information (PII) in customer emails. Which service should you use?",
            ["language", "pii"],
            [
                ("Azure AI Language with PII detection feature", True),
                ("Azure AI Vision", False),
                ("Azure AI Speech", False),
            ],
        ),
        (
            "What is the recommended approach for managing Azure AI service keys?",
            ["security", "key-management"],
            [
                ("Store keys in Azure Key Vault and use Managed Identity", True),
                ("Hardcode keys in application configuration files", False),
                ("Share keys via email", False),
            ],
        ),
        (
            "You need to analyze customer sentiment from support tickets. Which Azure AI capability should you use?",
            ["language", "sentiment"],
            [
                ("Azure AI Language sentiment analysis", True),
                ("Azure AI Vision image analysis", False),
                ("Azure AI Speech recognition", False),
            ],
        ),
        (
            "Which vector database option integrates natively with Azure AI Search?",
            ["search", "vectors"],
            [
                ("Azure AI Search has built-in vector search capabilities", True),
                ("Only external vector databases are supported", False),
                ("Vector search is not available in Azure", False),
            ],
        ),
        (
            "You need to extract key phrases from social media posts. Which service should you use?",
            ["language", "key-phrases"],
            [
                ("Azure AI Language key phrase extraction", True),
                ("Azure AI Document Intelligence", False),
                ("Azure AI Vision", False),
            ],
        ),
        (
            "What is the purpose of chunking in RAG implementations?",
            ["openai", "rag", "chunking"],
            [
                ("Split large documents into smaller segments for better retrieval and context", True),
                ("Compress images", False),
                ("Encrypt data", False),
            ],
        ),
        (
            "Which Azure service provides pre-built models for common document types like invoices and receipts?",
            ["document-intelligence", "prebuilt"],
            [
                ("Azure AI Document Intelligence prebuilt models", True),
                ("Azure Blob Storage", False),
                ("Azure Data Factory", False),
            ],
        ),
        (
            "You need to implement a content moderation system for user-generated images. Which service should you use?",
            ["content-safety", "vision"],
            [
                ("Azure AI Content Safety for images", True),
                ("Azure AI Translator", False),
                ("Azure AI Speech", False),
            ],
        ),
        (
            "What is the recommended way to handle rate limiting in Azure OpenAI?",
            ["openai", "rate-limiting"],
            [
                ("Implement exponential backoff and retry logic", True),
                ("Send requests faster to compensate", False),
                ("Ignore rate limit errors", False),
            ],
        ),
        (
            "Which Azure AI service can identify the language of a text document?",
            ["language", "detection"],
            [
                ("Azure AI Language language detection", True),
                ("Azure AI Vision", False),
                ("Azure AI Speech", False),
            ],
        ),
        (
            "You need to build a custom entity recognition model for medical terms. Which service should you use?",
            ["language", "custom-ner"],
            [
                ("Azure AI Language custom named entity recognition", True),
                ("Azure AI Vision Custom Vision", False),
                ("Azure OpenAI GPT-4", False),
            ],
        ),
        (
            "What is the purpose of the top_p parameter in Azure OpenAI?",
            ["openai", "parameters"],
            [
                ("Control diversity via nucleus sampling", True),
                ("Set the maximum response length", False),
                ("Configure billing limits", False),
            ],
        ),
        (
            "Which monitoring tool should you use to track Azure AI service usage and costs?",
            ["monitoring", "costs"],
            [
                ("Azure Monitor and Cost Management", True),
                ("Azure DevOps", False),
                ("Azure Logic Apps", False),
            ],
        ),
        (
            "You need to convert handwritten notes to digital text. Which service should you use?",
            ["vision", "ocr", "handwriting"],
            [
                ("Azure AI Vision Read API with handwriting support", True),
                ("Azure AI Speech", False),
                ("Azure AI Translator", False),
            ],
        ),
        (
            "What is the purpose of function calling in Azure OpenAI?",
            ["openai", "functions"],
            [
                ("Enable the model to call external APIs and tools", True),
                ("Reduce token usage", False),
                ("Improve image generation", False),
            ],
        ),
        (
            "Which Azure service can detect anomalies in time-series data?",
            ["anomaly-detection", "monitoring"],
            [
                ("Azure AI Anomaly Detector", True),
                ("Azure AI Vision", False),
                ("Azure AI Translator", False),
            ],
        ),
        (
            "You need to implement a question-answering system over structured data. Which approach should you use?",
            ["language", "qa"],
            [
                ("Azure AI Language question answering with custom knowledge base", True),
                ("Azure Blob Storage", False),
                ("Azure Event Hubs", False),
            ],
        ),
        (
            "What is the recommended approach for versioning Azure OpenAI deployments?",
            ["openai", "deployment", "versioning"],
            [
                ("Create separate deployments for different versions and use deployment names", True),
                ("Overwrite existing deployments", False),
                ("Versioning is not supported", False),
            ],
        ),
    ]

