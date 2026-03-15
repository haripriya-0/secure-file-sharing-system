from cryptography.fernet import Fernet
import os

SECRET_KEY = os.getenv("FILE_ENCRYPTION_KEY")

if not SECRET_KEY:
    raise ValueError("Encryption key not found")

cipher = Fernet(SECRET_KEY)

def encrypt_file(file_bytes):
    return cipher.encrypt(file_bytes)

def decrypt_file(encrypted_bytes):
    return cipher.decrypt(encrypted_bytes)