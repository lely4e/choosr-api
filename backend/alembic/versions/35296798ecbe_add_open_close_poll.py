"""add open close poll

Revision ID: 35296798ecbe
Revises: 7e84fdb30c24
Create Date: 2026-03-13 13:06:07.707204

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '35296798ecbe'
down_revision: Union[str, Sequence[str], None] = '7e84fdb30c24'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column(
        "polls", 
        sa.Column(
            "manually_closed", sa.Boolean(), nullable=False, server_default=sa.text("false")),
    )

    op.alter_column("polls", "manually_closed", server_default=None)



def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column("polls", "manually_closed")
