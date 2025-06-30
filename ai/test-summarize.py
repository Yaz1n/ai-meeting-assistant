import json
from summarize import process_transcript

sample_transcript = """
The team discussed the project timeline and resource allocation. John mentioned that the backend development is on track. The team decided to launch the app in two weeks. It was agreed to assign the UI testing task to Sarah. The meeting concluded with a plan to review progress next week.
"""

result = process_transcript(sample_transcript)
print(json.dumps(result, indent=2))