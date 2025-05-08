import os

env = os.environ.get("ENVIRONMENT", "development")
SECRETS_PATH = '/etc/secrets'


def get_secret(secret_name: str) -> str:
    if env in ['uat', 'production']:
        with open(f"{SECRETS_PATH}/{secret_name}", "r") as f:
            return f.read()
    else:
        return os.environ.get(secret_name)
