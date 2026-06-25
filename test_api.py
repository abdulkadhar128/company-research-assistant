import urllib.request
import json

url = "http://127.0.0.1:8000/api/v1/research/"
data = json.dumps({"company": "Microsoft"}).encode('utf-8')
headers = {'Content-Type': 'application/json'}

req = urllib.request.Request(url, data=data, headers=headers)
try:
    with urllib.request.urlopen(req) as response:
        result = json.loads(response.read().decode('utf-8'))
        print("Full response:", json.dumps(result, indent=2))
        data_field = result.get('data') or {}
        print("Timeline present:", 'timeline' in data_field)
        print("Timeline value:", data_field.get('timeline'))
except Exception as e:
    print("Error:", e)
