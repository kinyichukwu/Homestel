from flask import Flask, request, jsonify
import requests
import os

app = Flask(__name__)




@app.route('/payment/initiate', methods = ["POST"])
def payment():
    try:
        # Get the JSON payload from the request
        # request_payload = request.get["payload"]

        # Access the values from the payload
        value_in_usd = request.form.get('valueInUSD')
        payer_email = request.form.get('payerEmail')
        currency = request.form.get('currency')
        amount = request.form.get('amount')
        redirect_url = request.form.get('redirect_url')
        print(value_in_usd)

        url = "https://api-v2-sandbox.chimoney.io/v0.2/payment/initiate"

        payload = {
            "valueInUSD": value_in_usd,
            "payerEmail": payer_email,
            "currency": currency,
            "amount": amount,
            "redirect_url": redirect_url
        }
        headers = {
            "accept": "application/json",
            "content-type": "application/json",
            "X-API-KEY": os.environ.get("API_KEY")
        }

        response = requests.post(url, json=payload, headers=headers)

        print(response) 
        

#      response = requests.post(url, headers=headers, json=data)
        response_data = response.json()


        return jsonify(response_data)
    except Exception as e:
    # Handle exceptions, e.g., connection errors, request errors, etc.

        return (e)
    


@app.route('/', methods = ["GET"])
def home():
    return "Hello World"


@app.route('/payment/verify', methods = ["POST"])
def verify_payment():
    try:
        url = "https://api-v2-sandbox.chimoney.io/v0.2/payment/verify"
        headers = {
            "accept": "application/json",
            "content-type": "application/json",
            "X-API-KEY": os.environ.get("API_KEY")
        }
        issueId  = request.form.get("id")
        print(issueId)
        payload = {
            "id": issueId
        }
        # issueId = payload
        
        response = requests.post(url, json=payload, headers=headers)

        print(response)
        

        response_data = response.json()
        return jsonify(response_data)
    except Exception as e:

        return (e)


if __name__ == '__main__':
    app.run(debug=True)
