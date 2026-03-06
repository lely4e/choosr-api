"""add cascade delete to activities

Revision ID: 7e84fdb30c24
Revises: ab132ca64b04
Create Date: 2026-03-05 12:43:42.107283

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = "7e84fdb30c24"
down_revision: Union[str, Sequence[str], None] = "ab132ca64b04"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.drop_constraint("activities_user_id_fkey", "activities", type_="foreignkey")
    op.drop_constraint("activities_poll_id_fkey", "activities", type_="foreignkey")

    op.create_foreign_key(
        "activities_user_id_fkey",
        "activities",
        "users",
        ["user_id"],
        ["id"],
        ondelete="CASCADE",
    )

    op.create_foreign_key(
        "activities_poll_id_fkey",
        "activities",
        "polls",
        ["poll_id"],
        ["id"],
        ondelete="CASCADE",
    )


def downgrade():
    op.drop_constraint("activities_user_id_fkey", "activities", type_="foreignkey")
    op.drop_constraint("activities_poll_id_fkey", "activities", type_="foreignkey")

    op.create_foreign_key(
        "activities_user_id_fkey",
        "activities",
        "users",
        ["user_id"],
        ["id"],
    )

    op.create_foreign_key(
        "activities_poll_id_fkey",
        "activities",
        "polls",
        ["poll_id"],
        ["id"],
    )
