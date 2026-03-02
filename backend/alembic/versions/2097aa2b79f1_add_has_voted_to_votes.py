"""add has_voted to votes

Revision ID: 2097aa2b79f1
Revises: 7a8074e5141d
Create Date: 2026-01-24 15:49:07.757987

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "2097aa2b79f1"
down_revision: Union[str, Sequence[str], None] = "7a8074e5141d"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column(
        "votes",
        sa.Column(
            "has_voted", sa.Boolean(), nullable=False, server_default=sa.text("false")
        ),
    )

    op.alter_column("votes", "has_voted", server_default=None)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column("votes", "has_voted")
