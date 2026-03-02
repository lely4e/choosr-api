"""add deadline and description

Revision ID: 9d130ee786c1
Revises: 46ba2b14eba9
Create Date: 2026-03-02 11:32:18.643134

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = "9d130ee786c1"
down_revision: Union[str, Sequence[str], None] = "46ba2b14eba9"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.add_column(
        "polls",
        sa.Column("description", sa.String(length=140), nullable=True),
    )
    op.add_column(
        "polls",
        sa.Column("deadline", sa.Date(), nullable=True),
    )


def downgrade():
    op.drop_column("polls", "deadline")
    op.drop_column("polls", "description")
