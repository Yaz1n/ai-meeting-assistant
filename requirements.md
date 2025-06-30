# AI Meeting Assistant Requirements

## Project Goal
Build an AI-powered web application that summarizes online meetings and generates structured notes, including key discussion points, decisions, action items, and conclusions.

## Functional Requirements
- Accept audio (MP3, WAV), video (MP4), or text (.txt) inputs from online meetings (e.g., Zoom, Teams).
- Convert audio/video to text using AssemblyAI API.
- Summarize transcripts and extract key points, decisions, and action items using Hugging Face `transformers`.
- Store meeting metadata (e.g., date, participants, agenda), transcripts, and summaries in Firebase.
- Display results in a structured, user-friendly format with sections for summary, discussion points, decisions, action items, and conclusion.

## Non-Functional Requirements
- Ensure compatibility with Zoom and Microsoft Teams file formats (MP3, WAV, MP4).
- Maintain a professional, neutral tone in summaries.
- Handle meetings of varying lengths (5 minutes to 2 hours).
- Ensure the web app is responsive for desktop and mobile users.
- Securely store API keys in environment variables (e.g., `.env` files).

## Constraints
- Complete the project within 2 weeks (by July 13, 2025).
- Avoid processing sensitive or irrelevant information unless explicitly relevant.
- Use AssemblyAI’s free tier (100 minutes/month) and plan for error handling if limits are exceeded.
- Designed for a single user type (e.g., meeting organizer) for simplicity.

## APIs and Tools
- **Transcription**: AssemblyAI (supports MP3, WAV, MP4; free tier with 100 minutes/month).
- **NLP**: Hugging Face `transformers` (BART for summarization, BERT-based NER for entity extraction).
- **Database**: Firebase (for storing meeting metadata and summaries).

## Deliverables
- A web application with upload and display functionality.
- Backend APIs for transcription, summarization, and data storage.
- User documentation for using the application.