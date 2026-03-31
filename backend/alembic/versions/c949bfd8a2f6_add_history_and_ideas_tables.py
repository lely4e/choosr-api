"""add history and ideas tables

Revision ID: c949bfd8a2f6
Revises: 35296798ecbe
Create Date: 2026-03-23 15:47:03.646600

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = "c949bfd8a2f6"
down_revision: Union[str, Sequence[str], None] = "35296798ecbe"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        "history",
        sa.Column("id", sa.Integer(), primary_key=True, nullable=False),
        sa.Column(
            "created_at", sa.DateTime(timezone=True), server_default=sa.func.now()
        ),
        sa.Column("titles", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("poll_id", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.ForeignKeyConstraint(["poll_id"], ["polls.id"], ondelete="CASCADE"),
    )

    op.create_table(
        "ideas",
        sa.Column("id", sa.Integer(), primary_key=True, nullable=False),
        sa.Column(
            "created_at", sa.DateTime(timezone=True), server_default=sa.func.now()
        ),
        sa.Column("title", sa.String(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("history_id", sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.ForeignKeyConstraint(["history_id"], ["history.id"], ondelete="SET NULL"),
    )

    op.create_index("ix_history_user_id", "history", ["user_id"])
    op.create_index("ix_history_poll_id", "history", ["poll_id"])
    op.create_index("ix_ideas_user_id", "ideas", ["user_id"])
    op.create_index("ix_ideas_history_id", "ideas", ["history_id"])


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table("history")
    op.drop_table("ideas")
