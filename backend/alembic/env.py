from logging.config import fileConfig

from sqlalchemy import engine_from_config
from sqlalchemy import pool

from alembic import context

# --- ADD THESE ---
import sys
import os
sys.path.append(os.getcwd())  # so "app" package is importable

from app.config import settings
from app.database import Base
from app import models  # noqa: F401 -- ensures all models are registered on Base

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# --- ADD THIS: inject the real DB URL from .env, overriding alembic.ini ---
config.set_main_option("sqlalchemy.url", settings.database_url)

# Interpret the config file for Python logging.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# --- CHANGE THIS LINE ---
target_metadata = Base.metadata