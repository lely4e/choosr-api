from apscheduler.schedulers.background import BackgroundScheduler
import logging
from app.jobs.cleanup import cleanup_expired_data
from app.jobs.analytics import generate_daily_stats
from app.jobs.check_deadline import check_deadline

logger = logging.getLogger(__name__)

scheduler = BackgroundScheduler()


def start_scheduler():
    logger.info("Starting scheduler")

    scheduler.add_job(
        cleanup_expired_data,
        trigger="cron",
        hour=3,
        # minute="*/1",
        id="cleanup_job",
        replace_existing=True,
    )

    scheduler.add_job(
        generate_daily_stats,
        trigger="cron",
        hour=0,
        id="analytics_job",
        replace_existing=True,
    )

    logger.info("Checking Deadlines")

    scheduler.add_job(
        check_deadline,
        trigger="cron",
        hour=0,  # midnight
        minute=0,
        id="deadline_job",
        replace_existing=True,
    )

    scheduler.start()


def shutdown_scheduler():
    logger.info("Stopping scheduler")
    scheduler.shutdown()
