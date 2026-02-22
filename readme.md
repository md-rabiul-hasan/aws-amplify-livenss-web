markdown

# AWS Amplify Liveliness Web Application

A web application that implements face liveliness detection using AWS Rekognition service. This guide will walk you through setting up the application from scratch.

## Prerequisites

- AWS Account
- Python 3.7+
- Node.js 14.x or higher
- npm 6.x or higher
- AWS Amplify CLI
- Git
- PowerShell (Windows) or Terminal (Mac/Linux)

## Video Tutorial

For a visual walkthrough, check out this comprehensive tutorial:
[https://www.youtube.com/watch?v=yja5HvR_9AQ](https://www.youtube.com/watch?v=yja5HvR_9AQ)

## Project Structure

aws-amplify-liveliness-web/
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── App.js
│ │ └── index.js
│ ├── public/
│ ├── amplify/
│ ├── api/
│ ├── build/
│ ├── .env
│ ├── package.json
│ └── package-lock.json
├── lambda/
│ ├── create-session/
│ │ ├── lambda_function.py
│ │ └── requirements.txt
│ └── get-session/
│ ├── lambda_function.py
│ └── requirements.txt
└── README.md

text

## Setup Instructions

### 1. Clone Repository

````bash
git clone [your-repository-url]
cd aws-amplify-liveliness-web
2. Deploy Create Session Lambda Function
Navigate to the create-session Lambda directory and

aws-amplify-liveliness-web/
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── App.js
│ │ └── index.js
│ ├── public/
│ ├── amplify/
│ ├── api/
│ ├── build/
│ ├── .env
│ ├── package.json
│ └── package-lock.json
├── lambda/
│ ├── create-session/
│ │ ├── lambda_function.py
│ │ └── requirements.txt
│ └── get-session/
│ ├── lambda_function.py
│ └── requirements.txt
└── README.md its also inside markdown code full code for readme.md
markdown
# AWS Amplify Liveliness Web Application

A web application that implements face liveliness detection using AWS Rekognition service. This guide will walk you through setting up the application from scratch.

## Prerequisites

- AWS Account
- Python 3.7+
- Node.js 14.x or higher
- npm 6.x or higher
- AWS Amplify CLI
- Git
- PowerShell (Windows) or Terminal (Mac/Linux)

## Video Tutorial

For a visual walkthrough, check out this comprehensive tutorial:
[https://www.youtube.com/watch?v=yja5HvR_9AQ](https://www.youtube.com/watch?v=yja5HvR_9AQ)

## Project Structure
aws-amplify-liveliness-web/
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── App.js
│ │ └── index.js
│ ├── public/
│ ├── amplify/
│ ├── api/
│ ├── build/
│ ├── .env
│ ├── package.json
│ └── package-lock.json
├── lambda/
│ ├── create-session/
│ │ ├── lambda_function.py
│ │ └── requirements.txt
│ └── get-session/
│ ├── lambda_function.py
│ └── requirements.txt
└── README.md

text

## Setup Instructions

### 1. Clone Repository

```bash
git clone [your-repository-url]
cd aws-amplify-liveliness-web
2. Deploy Create Session Lambda Function
Navigate to the create-session Lambda directory and create deployment package:

bash
cd lambda/create-session
pip install -r requirements.txt --target .
For Windows (PowerShell):

powershell
Compress-Archive -Path * -DestinationPath ..\create_session.zip -Force
tar -tf ..\create_session.zip | Select-String "lambda_function"
For Mac/Linux:

bash
zip -r ../create_session.zip *
unzip -l ../create_session.zip | grep lambda_function
3. Deploy Get Session Lambda Function
Navigate to the get-session Lambda directory and create deployment package:

bash
cd lambda/get-session
pip install -r requirements.txt --target .
For Windows (PowerShell):

powershell
Compress-Archive -Path * -DestinationPath ..\get_session.zip -Force
tar -tf ..\get_session.zip | Select-String "lambda_function"
For Mac/Linux:

bash
zip -r ../get_session.zip *
unzip -l ../get_session.zip | grep lambda_function
4. AWS Console Setup
Create Create Session Lambda Function
Go to AWS Console → Lambda

Click Create function

Select Author from scratch

Configure:

Function name: create-session

Runtime: Python 3.x

Architecture: x86_64

Click Create function

Create Get Session Lambda Function
Go to AWS Console → Lambda

Click Create function

Select Author from scratch

Configure:

Function name: get-session

Runtime: Python 3.x

Architecture: x86_64

Click Create function

Upload Code for Create Session
In Code source section of create-session function

Click Upload from → .zip file

Select create_session.zip

Click Save

Upload Code for Get Session
In Code source section of get-session function

Click Upload from → .zip file

Select get_session.zip

Click Save

Configure IAM Role for Create Session
Go to Configuration → Permissions for create-session function

Click the IAM role name (e.g., createsession-role-5yo91hpl)

Click Add permissions → Create inline policy

Select JSON tab and paste:

json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": [
                "rekognition:StartFaceLivenessSession",
                "rekognition:CreateFaceLivenessSession",
                "rekognition:GetFaceLivenessSessionResults"
            ],
            "Resource": "*"
        }
    ]
}
Click Next → Review

Name: rekognition-liveliness-policy

Click Create policy

Configure IAM Role for Get Session
Go to Configuration → Permissions for get-session function

Click the IAM role name (e.g., getsession-role-la9lmzi1)

Click Add permissions → Create inline policy

Select JSON tab and paste:

json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": [
                "rekognition:StartFaceLivenessSession",
                "rekognition:CreateFaceLivenessSession",
                "rekognition:GetFaceLivenessSessionResults"
            ],
            "Resource": "*"
        }
    ]
}
Click Next → Review

Name: rekognition-liveliness-policy

Click Create policy

5. Frontend Setup
Navigate to the frontend directory and install dependencies:

bash
# Navigate to frontend directory
cd frontend

# Check directory contents (should see .env file)
dir  # Windows
ls   # Mac/Linux

# Install npm dependencies
npm install

# Initialize Amplify
amplify init

# Follow the prompts to configure your Amplify project:
# - Enter a name for the project: liveness
# - Initialize the project with the above configuration? Yes
# - Select the authentication method: AWS profile
# - Choose your AWS profile: (select your configured profile)

# Start the development server
npm start
6. Configure Unauthenticated IAM Role
Locate Unauthenticated Role
Go to AWS Console → IAM → Roles

Search for amplify-liveness-dev-c8ab9-unauthRole

Click on the role name

Attach Rekognition Policy
Click Add permissions → Create inline policy

Select JSON tab

Paste the following policy:

json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "rekognition:StartFaceLivenessSession",
                "rekognition:CreateFaceLivenessSession",
                "rekognition:GetFaceLivenessSessionResults"
            ],
            "Resource": "*"
        }
    ]
}
Click Next → Review

Name: rekognition-unauth-policy

Click Create policy

7. Configure Cognito Identity Pool
Enable Guest Access
Go to AWS Console → Cognito → Identity pools

Select liveness793250a9_identitypool_793250a9__dev

Click Edit identity pool

Navigate to Authentication providers

Under Unauthenticated identities, ensure Enable access to unauthenticated identities is checked

Click Save changes

8. Verify Configuration
Check Frontend .env file
Ensure your .env file contains the necessary configuration:

env
REACT_APP_REGION=your-aws-region
REACT_APP_IDENTITY_POOL_ID=your-identity-pool-id
REACT_APP_USER_POOL_ID=your-user-pool-id
REACT_APP_USER_POOL_WEB_CLIENT_ID=your-user-pool-client-id
Test the Application
Run npm start in the frontend directory

Open http://localhost:3000

Verify unauthenticated access works for Rekognition face liveness

Authentication Flow
Unauthenticated users can access Rekognition face liveness features

Cognito Identity Pool provides temporary AWS credentials

IAM Role (amplify-liveness-dev-c8ab9-unauthRole) grants necessary permissions

Troubleshooting
Issue	Solution
Identity Pool Issues	Verify guest access is enabled
Permission Errors	Check unauthenticated IAM role policy
Amplify Status	Run amplify status to check configuration
Local Development	Ensure .env file has correct values
Lambda Deployment	Verify zip file contains lambda_function.py
Important Notes
Guest access must be enabled for unauthenticated users

IAM role policy grants specific Rekognition permissions

Identity pool provides temporary credentials to frontend

Both Lambda functions require proper IAM roles

The .env file should never be committed to version control

Clean Up
Delete resources to avoid charges:

Both Lambda functions (create-session and get-session)

All IAM roles (including unauthenticated role)

Cognito Identity Pool

Amplify project

Associated CloudWatch logs

Support
For issues and questions:

Check AWS Lambda documentation

Review CloudWatch logs for errors

Verify IAM permissions are correctly configured

Ensure all prerequisites are met

Watch the video tutorial for visual guidance

Note: Replace [your-repository-url] with your actual repository URL and update AWS resource names according to your setup.
````
