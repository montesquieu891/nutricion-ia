"""add_user_id_indexes_to_dietas_and_recetas

Revision ID: 3c807fcb7149
Revises: 114755e384ae
Create Date: 2026-02-10 19:24:19.839331

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '3c807fcb7149'
down_revision: Union[str, Sequence[str], None] = '114755e384ae'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema - Add indexes on user_id columns for better query performance."""
    # Add index on user_id in dietas table for faster foreign key lookups
    op.create_index(op.f('ix_dietas_user_id'), 'dietas', ['user_id'], unique=False)
    
    # Add index on user_id in recetas table for faster foreign key lookups
    op.create_index(op.f('ix_recetas_user_id'), 'recetas', ['user_id'], unique=False)


def downgrade() -> None:
    """Downgrade schema - Remove indexes on user_id columns."""
    # Remove index on user_id in recetas table
    op.drop_index(op.f('ix_recetas_user_id'), table_name='recetas')
    
    # Remove index on user_id in dietas table
    op.drop_index(op.f('ix_dietas_user_id'), table_name='dietas')
