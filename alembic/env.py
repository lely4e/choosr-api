from logging.config import fileConfig

from sqlalchemy import engine_from_config, pool
from alembic import context

# Import your Base and models so Alembic can detect all tables
from app.db.database import Base
from app.core.config import settings

# Alembic Config object
config = context.config

# Set SQLAlchemy URL from settings
config.set_main_option("sqlalchemy.url", settings.SYNC_DATABASE_URL)

# Configure logging from alembic.ini
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Metadata for autogenerate
target_metadata = Base.metadata


# Offline migrations
def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode (without DB connection)."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        include_schemas=True,  # include all schemas
        version_table_schema="public",  # alembic_version table in public
    )

    with context.begin_transaction():
        context.run_migrations()


# Online migrations
def run_migrations_online() -> None:
    """Run migrations in 'online' mode (with DB connection)."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            include_schemas=True,
            version_table_schema="public",
        )

        with context.begin_transaction():
            context.run_migrations()


# Run migrations based on mode
if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
