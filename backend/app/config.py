from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str
    openai_api_key: str
    openai_model: str = "gpt-5.4"
    allowed_origins: str = ""
    calendar_url: str
    admin_username: str
    admin_password: str

    @property
    def allowed_origins_list(self):
        return [o.strip() for o in self.allowed_origins.split(",") if o.strip()]

    class Config:
        env_file = ".env"
        

settings = Settings()