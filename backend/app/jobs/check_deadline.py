import logging
from typing import List
from sqlalchemy.orm import Session
from app.api.repository.poll_manager import PollManager
from app.db.database import sync_session_maker
from app.db.models import Poll


logger = logging.getLogger(__name__)


def _get_db_session() -> Session:
    """Create a new synchronous DB session for the job."""
    return sync_session_maker()


def check_deadline() -> None:
    """Cron job: close polls whose deadline has passed and are not manually closed."""
    db: Session = _get_db_session()
    try:
        poll_manager = PollManager(db)

        expired_polls: List[Poll] = poll_manager.get_expired_deadlines_polls()

        if not expired_polls:
            logger.info("No polls with expired deadlines")
            return

        for poll in expired_polls:
            try:
                poll_manager.mark_poll_closed(poll.id)
                logger.info("Poll %s marked as closed by deadline job", poll.id)
            except Exception as e:  
                logger.error("Failed to mark poll %s as closed: %s", poll.id, e)
    finally:
        db.close()
