import hashlib
import json
import os
import time
import requests

class BitunixAPI:
    def __init__(self, api_key, api_secret):
        self.api_key = api_key
        self.api_secret = api_secret
        self.base_url = "https://fapi.bitunix.com"
        
    def _generate_signature(self, query_params='', body=''):
        nonce = os.urandom(16).hex()
        timestamp = str(int(time.time() * 1000))
        
        digest_input = nonce + timestamp + self.api_key + query_params + body
        first_hash = hashlib.sha256(digest_input.encode()).hexdigest()
        signature = hashlib.sha256((first_hash + self.api_secret).encode()).hexdigest()
        
        return signature, nonce, timestamp
    
    def _get_headers(self, signature, nonce, timestamp):
        return {
            "api-key": self.api_key,
            "sign": signature,
            "nonce": nonce,
            "timestamp": timestamp,
            "language": "en-US",
            "Content-Type": "application/json"
        }
    
    def _request(self, method, endpoint, params=None, body=None):
        query_params = ''
        if params:
            sorted_params = sorted(params.items())
            query_params = ''.join([f"{k}{v}" for k, v in sorted_params])
        
        body_str = ''
        if body:
            body_str = json.dumps(body, separators=(',', ':'))
        
        signature, nonce, timestamp = self._generate_signature(query_params, body_str)
        headers = self._get_headers(signature, nonce, timestamp)
        
        url = f"{self.base_url}{endpoint}"
        if params:
            url += '?' + '&'.join([f"{k}={v}" for k, v in params.items()])
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=30)
            elif method == 'POST':
                response = requests.post(url, headers=headers, data=body_str, timeout=30)
            else:
                raise ValueError(f"Unsupported method: {method}")
            
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            return {
                'code': -1,
                'msg': str(e),
                'data': None
            }
    
    def get(self, endpoint, params=None):
        return self._request('GET', endpoint, params=params)
    
    def post(self, endpoint, body=None):
        return self._request('POST', endpoint, body=body)
