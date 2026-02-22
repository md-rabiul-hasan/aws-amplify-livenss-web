import boto3
import json
import base64

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
        
        # Get session ID from body
        session_id = body.get('session') or body.get('sessionId')
        
        # Get liveness session results
        response = client.get_face_liveness_session_results(
            SessionId=session_id
        )
        
        # Prepare response with image
        result = {
            'SessionId': response['SessionId'],
            'Confidence': response['Confidence'],
            'Status': response['Status']
        }
        
        # Convert image bytes to base64
        if 'ReferenceImage' in response and 'Bytes' in response['ReferenceImage']:
            result['ReferenceImage'] = {
                'Bytes': base64.b64encode(response['ReferenceImage']['Bytes']).decode('utf-8'),
                'Width': response['ReferenceImage'].get('Width'),
                'Height': response['ReferenceImage'].get('Height')
            }
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps(result)
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)})
        }