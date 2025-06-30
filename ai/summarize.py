import sys
import json
import logging
import nltk
from nltk.tokenize import sent_tokenize
import re
from transformers import pipeline

# Ensure immediate output flushing
sys.stdout.reconfigure(line_buffering=True)
sys.stderr.reconfigure(line_buffering=True)

# Initialize logging immediately
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        # Change this line: direct logs to stderr
        logging.StreamHandler(sys.stderr),
        logging.FileHandler('summarize.log', mode='a', encoding='utf-8')
    ]
)
logger = logging.getLogger(__name__)
logger.debug("Script initialized")
# Removed: print("Script started", flush=True)

try:
    logger.debug("NLTK punkt download attempt")
    nltk.download('punkt', quiet=True)
    logger.debug("NLTK punkt downloaded successfully")
    # Removed: print("NLTK punkt loaded", flush=True)
except Exception as e:
    logger.error(f"Failed to download NLTK punkt: {str(e)}")
    # Always output JSON even on early exit due to NLTK download
    print(json.dumps({"error": f"NLTK punkt download failed: {str(e)}"}), flush=True)
    sys.exit(1)

def sanitize_text(text):
    """Sanitize input text to remove problematic characters."""
    if not text:
        return text
    # Replace newlines and multiple spaces with single space
    text = re.sub(r'\s+', ' ', text.strip())
    # Remove non-printable characters
    text = ''.join(c for c in text if c.isprintable())
    return text

# Global summarizer instance to avoid re-loading for every call
# This can significantly speed up subsequent summarizations
_summarizer = None

def get_summarizer():
    global _summarizer
    if _summarizer is None:
        logger.debug("Loading t5-small model for the first time")
        _summarizer = pipeline("summarization", model="t5-small")
    return _summarizer

def summarize_text(text, max_length=150, min_length=50):
    """Summarize the input text using t5-small."""
    logger.debug("Starting summarization")
    try:
        if not text or len(text.strip()) < 10:
            logger.error("Transcript too short or empty")
            return None # Indicate failure by returning None

        summarizer = get_summarizer() # Get the global summarizer instance
        summary = summarizer(text, max_length=max_length, min_length=min_length, do_sample=False)
        logger.debug("Summarization successful")
        return summary[0]['summary_text']
    except Exception as e:
        logger.error(f"Summarization error: {str(e)}")
        return None # Indicate failure by returning None

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
                # A more robust way to find potential assignees (capitalize check)
                assignees = [word for word in words if word and word[0].isupper() and word.lower() not in ['the', 'a', 'an', 'to', 'for', 'and', 'but', 'or']]
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
        sanitized_transcript = sanitize_text(transcript)
        if not sanitized_transcript or len(sanitized_transcript) < 10:
            logger.error("Invalid transcript provided")
            # Return a structured error object here
            return {"error": "Invalid transcript provided"}

        summary = summarize_text(sanitized_transcript)
        if not summary:
            logger.error("Summarization failed")
            # Return a structured error object here
            return {"error": "Summarization failed"}

        key_points = extract_key_points(sanitized_transcript)
        decisions = extract_decisions(sanitized_transcript)
        action_items = extract_action_items(sanitized_transcript)
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
        # Catch all errors and return a structured error object
        return {"error": f"Processing failed: {str(e)}"}

if __name__ == "__main__":
    logger.debug("Script started from main block")
    try:
        if len(sys.argv) < 2:
            logger.error("No transcript provided via command line arguments")
            # Ensure JSON output even on missing argument
            print(json.dumps({"error": "No transcript provided"}), flush=True)
            sys.exit(1)

        transcript = sys.argv[1]
        logger.debug(f"Received transcript from CLI: {transcript[:50]}...")
        result = process_transcript(transcript)
        # Always print the result (either success or error JSON)
        print(json.dumps(result), flush=True)
        logger.debug("Script completed successfully (or with handled error)")
    except Exception as e:
        logger.error(f"Unhandled main execution error: {str(e)}")
        # For any unhandled exceptions, still output a JSON error
        print(json.dumps({"error": f"Unhandled main execution failed: {str(e)}"}), flush=True)
        sys.exit(1)