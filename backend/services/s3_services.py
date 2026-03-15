import boto3
import os
from dotenv import load_dotenv
from pathlib import Path

# Load .env from backend root
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

AWS_ACCESS_KEY = os.getenv("AWS_ACCESS_KEY")
AWS_SECRET_KEY = os.getenv("AWS_SECRET_KEY")
AWS_BUCKET = os.getenv("AWS_BUCKET_NAME")
AWS_REGION = os.getenv("AWS_DEFAULT_REGION")

print("DEBUG BUCKET:", AWS_BUCKET)

if not AWS_BUCKET:
    raise ValueError("AWS_BUCKET_NAME is not set in environment variables")

s3 = boto3.client(
    "s3",
    aws_access_key_id=AWS_ACCESS_KEY,
    aws_secret_access_key=AWS_SECRET_KEY,
    region_name=AWS_REGION
)

""""
def upload_file_to_s3(file_obj, filename):
    s3.upload_fileobj(file_obj, AWS_BUCKET, filename)
    file_url = f"https://{AWS_BUCKET}.s3.{AWS_REGION}.amazonaws.com/{filename}"
    return file_url
"""
def upload_file_to_s3(file_obj, filename):
    s3.put_object(
        Bucket=AWS_BUCKET,
        Key=filename,
        Body=file_obj
    )

    file_url = f"https://{AWS_BUCKET}.s3.{AWS_REGION}.amazonaws.com/{filename}"
    return file_url

def download_file_from_s3(filename):
    try:
        response = s3.get_object(
            Bucket=AWS_BUCKET,
            Key=filename
        )

        file_data = response["Body"].read()
        return file_data

    except Exception as e:
        print("S3 Download Error:", str(e))
        raise
def delete_file_from_s3(s3_key):
    s3.delete_object(
        Bucket=AWS_BUCKET,
        Key=s3_key
    )