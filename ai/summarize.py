from transformers import pipeline
import nltk
from nltk.tokenize import sent_tokenize
import re

nltk.download('punkt')

def summarize_text(text, max_length=150, min_length=50):
    """
    Summarize the input text using BART model.
    Returns a 2-3 sentence summary.
    """
    try:
        summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
        summary = summarizer(text, max_length=max_length, min_length=min_length, do_sample=False)
        return summary[0]['summary_text']
    except Exception as e:
        print(f"Summarization error: {e}")
        return None

def extract_key_points(text):
    """
    Extract key discussion points as bullet points using sentence tokenization.
    Simplistic approach: select sentences with keywords like 'discussed', 'mentioned'.
    """
    try:
        sentences = sent_tokenize(text)
        key_points = [s for s in sentences if any(keyword in s.lower() for keyword in ['discussed', 'mentioned', 'talked about'])]
        return key_points if key_points else sentences[:3]  # Fallback to first 3 sentences
    except Exception as e:
        print(f"Key points extraction error: {e}")
        return []

def extract_decisions(text):
    """
    Extract decisions using regex for phrases like 'decided to', 'agreed to'.
    """
    try:
        sentences = sent_tokenize(text)
        decisions = [s for s in sentences if any(keyword in s.lower() for keyword in ['decided to', 'agreed to', 'resolved to'])]
        return decisions if decisions else []
    except Exception as e:
        print(f"Decisions extraction error: {e}")
        return []

def extract_action_items(text):
    """
    Extract action items and assignees using BERT-based NER.
    """
    try:
        ner = pipeline("ner", model="dslim/bert-base-NER", grouped_entities=True)
        sentences = sent_tokenize(text)
        action_items = []
        for sentence in sentences:
            if 'to' in sentence.lower() and any(keyword in sentence.lower() for keyword in ['assign', 'task', 'action']):
                entities = ner(sentence)
                assignees = [entity['word'] for entity in entities if entity['entity_group'] == 'PER']
                if assignees:
                    action_items.append({"task": sentence, "assignee": assignees})
        return action_items if action_items else []
    except Exception as e:
        print(f"Action items extraction error: {e}")
        return []

def generate_conclusion(summary, decisions):
    """
    Generate a conclusion based on the summary and decisions.
    """
    try:
        if decisions:
            return f"The meeting concluded with key decisions: {', '.join(decisions[:2])}. {summary}"
        return f"The meeting concluded with the following summary: {summary}"
    except Exception as e:
        print(f"Conclusion generation error: {e}")
        return summary

def process_transcript(transcript):
    """
    Process the transcript to generate structured meeting notes.
    """
    summary = summarize_text(transcript)
    if not summary:
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

if __name__ == "__main__":
    # Sample transcript for testing
    sample_transcript = """
    The team discussed the project timeline and resource allocation. John mentioned that the backend development is on track. The team decided to launch the app in two weeks. It was agreed to assign the UI testing task to Sarah. The meeting concluded with a plan to review progress next week.
    """
    result = process_transcript(sample_transcript)
    print("Summary:", result["summary"])
    print("Key Points:", result["key_points"])
    print("Decisions:", result["decisions"])
    print("Action Items:", result["action_items"])
    print("Conclusion:", result["conclusion"])