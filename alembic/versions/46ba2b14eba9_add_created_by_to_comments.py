"""add created_by to comments

Revision ID: 46ba2b14eba9
Revises: 2097aa2b79f1
Create Date: 2026-01-28 21:39:15.769185

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = "46ba2b14eba9"
down_revision: Union[str, Sequence[str], None] = "2097aa2b79f1"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.add_column(
        "comments",
        sa.Column("created_by", sa.String(), nullable=False, server_default="system"),
    )
    op.alter_column("comments", "created_by", server_default=None)


def downgrade() -> None:
    op.drop_column("comments", "created_by")
