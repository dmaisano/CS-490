from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import requests
import json

app = Flask(__name__)
CORS(app)


"""
Simple Python 3 flask app to accept any JSON data received as a POST request
the app then sends the POST data to the url specified in the request body
and will return the appropriate response from the PHP script

Returns:
    JSON -- json response from the specified PHP script
"""


@app.route("/", methods=["POST"])
def proxy():
    url = request.json["url"]

    # forward the POST json data to the specified url in the request body
    # in my case it will be a php script running on the localhost server
    phpResponse = requests.post(url, json=request.json)

    res = app.response_class(
        response=json.dumps(phpResponse.json()), mimetype="application/json"
    )

    return res


if __name__ == "__main__":
    app.run(debug=True)
