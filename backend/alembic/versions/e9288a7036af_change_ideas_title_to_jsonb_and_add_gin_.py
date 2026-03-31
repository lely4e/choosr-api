"""Change Ideas.title to JSONB and add GIN index

Revision ID: e9288a7036af
Revises: c949bfd8a2f6
Create Date: 2026-03-27 11:30:48.440667

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = "e9288a7036af"
down_revision: Union[str, Sequence[str], None] = "c949bfd8a2f6"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Convert title → JSONB
    op.alter_column(
        "ideas",
        "title",
        type_=postgresql.JSONB,
        postgresql_using="title::jsonb",
        existing_nullable=False,
    )

    # GIN index on the JSONB column (optional: functional index on category)
    op.create_index(
        "idx_ideas_title_category", "ideas", ["title"], postgresql_using="gin"
    )


def downgrade() -> None:
    op.drop_index("idx_ideas_title_category", table_name="ideas")

    op.alter_column(
        "ideas",
        "title",
        type_=sa.String,
        postgresql_using="title::text",
        existing_nullable=False,
    )
