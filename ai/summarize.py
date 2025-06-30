from transformers import pipeline
import nltk
from nltk.tokenize import sent_tokenize
import re
import sys
import json

nltk.download('punkt')

def summarize_text(text, max_length=150, min_length=50):
    try:
        summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
        summary = summarizer(text, max_length=max_length, min_length=min_length, do_sample=False)
        return summary[0]['summary_text']
    except Exception as e:
        print(f"Summarization error: {e}")
        return None

def extract_key_points(text):
    try:
        sentences = sent_tokenize(text)
        key_points = [s for s in sentences if any(keyword in s.lower() for keyword in ['discussed', 'mentioned', 'talked about'])]
        return key_points if key_points else sentences[:3]
    except Exception as e:
        print(f"Key points extraction error: {e}")
        return []

def extract_decisions(text):
    try:
        sentences = sent_tokenize(text)
        decisions = [s for s in sentences if any(keyword in s.lower() for keyword in ['decided to', 'agreed to', 'resolved to'])]
        return decisions if decisions else []
    except Exception as e:
        print(f"Decisions extraction error: {e}")
        return []

def extract_action_items(text):
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
    try:
        if decisions:
            return f"The meeting concluded with key decisions: {', '.join(decisions[:2])}. {summary}"
        return f"The meeting concluded with the following summary: {summary}"
    except Exception as e:
        print(f"Conclusion generation error: {e}")
        return summary

def process_transcript(transcript):
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
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No transcript provided"}))
        sys.exit(1)
    
    transcript = sys.argv[1]
    result = process_transcript(transcript)
    print(json.dumps(result))