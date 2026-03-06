"""Add activities table

Revision ID: ab132ca64b04
Revises: 9d130ee786c1
Create Date: 2026-03-04 15:32:15.080048

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = "ab132ca64b04"
down_revision: Union[str, Sequence[str], None] = "9d130ee786c1"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Create activities table."""
    op.create_table(
        "activities",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.Column(
            "user_id",
            sa.Integer(),
            sa.ForeignKey("users.id"),
            nullable=False,
            index=True,
        ),
        sa.Column(
            "poll_id",
            sa.Integer(),
            sa.ForeignKey("polls.id"),
            nullable=False,
            index=True,
        ),
    )

    op.create_unique_constraint("uq_user_poll", "activities", ["user_id", "poll_id"])


def downgrade() -> None:
    """Drop activities table."""
    op.drop_table("activities")
