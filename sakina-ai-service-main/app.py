from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline
import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-1.5-flash-latest')
else:
    print("WARNING: GEMINI_API_KEY not found in environment variables.")
    model = None

# Load Emotion Classification Pipeline (Text)
# Using a robust pre-trained model for emotion
try:
    print("Loading emotion classification model...")
    emotion_classifier = pipeline(
        "text-classification", 
        model="bhadresh-savani/distilbert-base-uncased-emotion", 
        return_all_scores=False
    )
    print("Model loaded successfully.")
except Exception as e:
    print(f"Error loading emotion model: {e}")
    emotion_classifier = None

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message', '')

    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    # 1. Detect Emotion
    emotion = "neutral"
    if emotion_classifier:
        try:
            result = emotion_classifier(user_message)[0]
            emotion = result['label']
            print(f"Detected emotion: {emotion}")
        except Exception as e:
            print(f"Emotion detection error: {e}")

    # 2. Generate Therapeutic Response using Gemini
    response_text = ""
    if model:
        prompt = f"""
        Act as an empathetic, professional mental health therapist.
        The user says: "{user_message}"
        Detected underlying emotion: {emotion}
        
        Please provide a short, validating, and calming response (1-3 sentences).
        Acknowledge their feelings organically and offer a gentle word of support.
        """
        try:
            response = model.generate_content(prompt)
            response_text = response.text
        except Exception as e:
            print(f"Gemini API error: {e}")
            response_text = get_fallback_response(emotion)
    else:
        response_text = get_fallback_response(emotion)

    return jsonify({
        "emotion": emotion,
        "response": response_text
    })

def get_fallback_response(emotion):
    templates = {
        "sadness": "I'm sorry you're feeling this way. It's okay to feel sad. I'm here for you.",
        "joy": "That's wonderful! I'm so glad to hear that. What's making you feel this way?",
        "anger": "It sounds like you're really frustrated. Take a deep breath. I'm listening.",
        "fear": "I understand that things feel scary right now. You're not alone.",
        "love": "That's a beautiful feeling. Love and connection are so important.",
        "surprise": "Wow, that sounds like quite a surprise! How are you feeling about it?",
        "neutral": "I'm here to listen. Tell me more about what's on your mind."
    }
    return templates.get(emotion, "I hear you. Tell me more.")

if __name__ == '__main__':
    app.run(port=5000, debug=True)
