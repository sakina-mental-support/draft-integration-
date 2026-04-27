import sys
import json
import os

# Suppress warnings
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3' 

try:
    from transformers import pipeline
except ImportError:
    print(json.dumps({"error": "Transformers library not installed. Please run 'pip install transformers torch'"}))
    sys.exit(1)

# Load pre-trained emotion classification model
# Uses: bhadresh-savani/distilbert-base-uncased-emotion
try:
    classifier = pipeline(
        "text-classification", 
        model="bhadresh-savani/distilbert-base-uncased-emotion", 
        return_all_scores=True
    )
except Exception as e:
    print(json.dumps({"error": f"Failed to load model: {str(e)}"}))
    sys.exit(1)

def predict(text):
    try:
        results = classifier(text)[0]
        # Sort by score descending
        sorted_results = sorted(results, key=lambda x: x['score'], reverse=True)
        return sorted_results[0]
    except Exception as e:
        return {"label": "error", "score": 0, "message": str(e)}

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No text provided"}))
    else:
        text = sys.argv[1]
        prediction = predict(text)
        print(json.dumps(prediction))
