# AWS Amplify Liveliness Web Application

A web application that implements **Face Liveness Detection** using **AWS Rekognition**.  
This guide walks you through setting up the application from scratch.

---

## Prerequisites

- AWS Account
- Python 3.7+
- Node.js 14.x or higher
- npm 6.x or higher
- AWS Amplify CLI
- Git
- PowerShell (Windows) or Terminal (Mac/Linux)

---

## Video Tutorial

For a visual walkthrough, check out this tutorial:  
https://www.youtube.com/watch?v=yja5HvR_9AQ

---

## Project Structure

```text
aws-amplify-liveliness-web/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   ├── amplify/
│   ├── api/
│   ├── build/
│   ├── .env
│   ├── package.json
│   └── package-lock.json
├── lambda/
│   ├── create-session/
│   │   ├── lambda_function.py
│   │   └── requirements.txt
│   └── get-session/
│       ├── lambda_function.py
│       └── requirements.txt
└── README.md
```

---

## Setup Instructions

### 1. Clone Repository

```bash
git clone [your-repository-url]
cd aws-amplify-liveliness-web
```

---

### 2. Deploy **Create Session** Lambda Function

```bash
cd lambda/create-session
pip install -r requirements.txt --target .
```

#### Windows (PowerShell)

```powershell
Compress-Archive -Path * -DestinationPath ..\create_session.zip -Force
tar -tf ..\create_session.zip | Select-String "lambda_function"
```

#### Mac / Linux

```bash
zip -r ../create_session.zip *
unzip -l ../create_session.zip | grep lambda_function
```

---

### 3. Deploy **Get Session** Lambda Function

```bash
cd ../get-session
pip install -r requirements.txt --target .
```

#### Windows (PowerShell)

```powershell
Compress-Archive -Path * -DestinationPath ..\get_session.zip -Force
tar -tf ..\get_session.zip | Select-String "lambda_function"
```

#### Mac / Linux

```bash
zip -r ../get_session.zip *
unzip -l ../get_session.zip | grep lambda_function
```

---

### 4. AWS Console Setup

#### Create Lambda Functions

**Create Session**

- Function name: `create-session`
- Runtime: Python 3.x
- Architecture: x86_64

**Get Session**

- Function name: `get-session`
- Runtime: Python 3.x
- Architecture: x86_64

---

### 5. Upload Lambda Code

Upload:

- `create_session.zip` → `create-session`
- `get_session.zip` → `get-session`

Click **Save** after upload.

---

### 6. Configure IAM Roles (Both Lambdas)

Attach the following inline policy:

```json
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
```

Policy name:

```
rekognition-liveliness-policy
```

---

### 7. Frontend Setup

```bash
cd frontend
npm install
amplify init
npm start
```

---

### 8. Configure Unauthenticated IAM Role

Attach this policy to the **Amplify unauthenticated role**:

```json
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
```

---

### 9. Configure Cognito Identity Pool

- Enable **Unauthenticated (Guest) Access**
- Save changes

---

### 10. Environment Variables (`.env`)

```env
REACT_APP_REGION=your-aws-region
REACT_APP_IDENTITY_POOL_ID=your-identity-pool-id
REACT_APP_USER_POOL_ID=your-user-pool-id
REACT_APP_USER_POOL_WEB_CLIENT_ID=your-user-pool-client-id
```

> ⚠️ **Do not commit `.env` to version control**

---

## Authentication Flow

- Unauthenticated users access face liveness
- Cognito Identity Pool provides temporary credentials
- IAM unauth role grants Rekognition permissions

---

## Troubleshooting

| Issue                | Solution                                 |
| -------------------- | ---------------------------------------- |
| Identity Pool Issues | Enable guest access                      |
| Permission Errors    | Check unauth IAM role                    |
| Amplify Issues       | Run `amplify status`                     |
| Lambda Errors        | Verify zip contains `lambda_function.py` |

---

## Clean Up (Avoid Charges)

Delete:

- Lambda functions
- IAM roles
- Cognito Identity Pool
- Amplify project
- CloudWatch logs

---

## Support

- Check AWS Lambda & Rekognition docs
- Review CloudWatch logs
- Rewatch the video tutorial

---

**Note:** Replace `[your-repository-url]` and AWS resource names according to your setup.
