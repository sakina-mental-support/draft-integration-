import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
print(f"Testing key: {api_key[:10]}...")

genai.configure(api_key=api_key)

try:
    print("Fetching list of models...")
    models = genai.list_models()
    for m in models:
        print(f"- {m.name} (Methods: {m.supported_generation_methods})")
    
    # Try a fallback model if 1.5-flash fails
    print("\nAttempting generation with gemini-pro...")
    model = genai.GenerativeModel('gemini-pro')
    response = model.generate_content("Say hello!")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"\nFinal Error: {e}")
