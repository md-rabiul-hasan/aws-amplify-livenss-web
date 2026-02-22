import boto3
import json

def lambda_handler(event, context):
    client = boto3.client('rekognition', region_name='us-east-1')
    
    try:
        # Parse the incoming request
        if 'body' in event:
            if isinstance(event['body'], str):
                body = json.loads(event['body'])
            else:
                body = event['body']
        else:
            body = event
        
        # Get request token from body
        request_token = body['request_token']
        
        # Create liveness session
        response = client.create_face_liveness_session(    
            ClientRequestToken=request_token
        )
        
        session_id = response.get("SessionId")
        
        # Return formatted API response
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'sessionId': session_id
            })
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': str(e)
            })
        }