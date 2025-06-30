import sys
import json
import logging
import nltk
from nltk.tokenize import sent_tokenize
import re
from transformers import pipeline

# Initialize logging immediately
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler('summarize.log', mode='a')
    ]
)
logger = logging.getLogger(__name__)
logger.debug("Script initialized")

try:
    print("Testing Python script execution", file=sys.stdout)
    logger.debug("NLTK punkt download attempt")
    nltk.download('punkt', quiet=True)
    logger.debug("NLTK punkt downloaded successfully")
except Exception as e:
    logger.error(f"Failed to download NLTK punkt: {str(e)}")
    print(json.dumps({"error": f"NLTK punkt download failed: {str(e)}"}))
    sys.exit(1)

def summarize_text(text, max_length=150, min_length=50):
    """Summarize the input text using t5-small."""
    logger.debug("Starting summarization")
    try:
        if not text or len(text.strip()) < 10:
            logger.error("Transcript too short or empty")
            return None

        logger.debug("Loading t5-small model")
        summarizer = pipeline("summarization", model="t5-small")
        summary = summarizer(text, max_length=max_length, min_length=min_length, do_sample=False)
        logger.debug("Summarization successful")
        return summary[0]['summary_text']
    except Exception as e:
        logger.error(f"Summarization error: {str(e)}")
        return None

def extract_key_points(text):
    """Extract key discussion points as bullet points."""
    logger.debug("Extracting key points")
    try:
        sentences = sent_tokenize(text)
        key_points = [s for s in sentences if any(keyword in s.lower() for keyword in ['discussed', 'mentioned', 'talked about'])]
        return key_points if key_points else sentences[:3]
    except Exception as e:
        logger.error(f"Key points extraction error: {str(e)}")
        return []

def extract_decisions(text):
    """Extract decisions using regex."""
    logger.debug("Extracting decisions")
    try:
        sentences = sent_tokenize(text)
        decisions = [s for s in sentences if any(keyword in s.lower() for keyword in ['decided to', 'agreed to', 'resolved to'])]
        return decisions if decisions else []
    except Exception as e:
        logger.error(f"Decisions extraction error: {str(e)}")
        return []

def extract_action_items(text):
    """Extract action items and assignees using keyword-based approach."""
    logger.debug("Extracting action items")
    try:
        sentences = sent_tokenize(text)
        action_items = []
        for sentence in sentences:
            if 'to' in sentence.lower() and any(keyword in sentence.lower() for keyword in ['assign', 'task', 'action']):
                words = sentence.split()
                assignees = [word for word in words if word[0].isupper() and word not in ['The', 'A', 'An']]
                if assignees:
                    action_items.append({"task": sentence, "assignee": assignees})
        return action_items if action_items else []
    except Exception as e:
        logger.error(f"Action items extraction error: {str(e)}")
        return []

def generate_conclusion(summary, decisions):
    """Generate a conclusion based on summary and decisions."""
    logger.debug("Generating conclusion")
    try:
        if not summary:
            logger.error("No summary provided for conclusion")
            return "No conclusion generated due to summarization failure."
        if decisions:
            return f"The meeting concluded with key decisions: {', '.join(decisions[:2])}. {summary}"
        return f"The meeting concluded with the following summary: {summary}"
    except Exception as e:
        logger.error(f"Conclusion generation error: {str(e)}")
        return summary or "No conclusion generated."

def process_transcript(transcript):
    """Process the transcript to generate structured meeting notes."""
    logger.debug(f"Processing transcript: {transcript[:50]}...")
    try:
        if not transcript or len(transcript.strip()) < 10:
            logger.error("Invalid transcript provided")
            return {"error": "Invalid transcript provided"}

        summary = summarize_text(transcript)
        if not summary:
            logger.error("Summarization failed")
            return {"error": "Summarization failed"}

        key_points = extract_key_points(transcript)
        decisions = extract_decisions(transcript)
        action_items = extract_action_items(transcript)
        conclusion = generate_conclusion(summary, decisions)

        return {
            "summary": summary,
            "key_points": key_points,
            "decisions": decisions,
            "action_items": action_items,
            "conclusion": conclusion
        }
    except Exception as e:
        logger.error(f"Process transcript error: {str(e)}")
        return {"error": f"Processing failed: {str(e)}"}

if __name__ == "__main__":
    logger.debug("Script started")
    try:
        if len(sys.argv) < 2:
            logger.error("No transcript provided")
            print(json.dumps({"error": "No transcript provided"}))
            sys.exit(1)

        transcript = sys.argv[1]
        result = process_transcript(transcript)
        print(json.dumps(result))
        logger.debug("Script completed successfully")
    except Exception as e:
        logger.error(f"Main execution error: {str(e)}")
        print(json.dumps({"error": f"Main execution failed: {str(e)}"}))
        sys.exit(1)