from app.instances.db import db
from app.notifications import apns, webpush
from app.models.Notification import Notification
from app.models.APNDevice import APNProvider

from base64 import urlsafe_b64decode

def send_notification(notification):
    """
    Sends a notification to database and also through
    all other mediums (e.g. websocket or notification)

    :param Notification notification: the notification
    """

    db.session.add(notification)
    db.session.commit()

    # Send to all Push Notification devices
    recipient = notification.recipient

    # Send to all APNS devices
    apn_devices = recipient.apn_devices
    for device in apn_devices:
        result = {
            APNProvider.WEB_APN:
                lambda: apns.send_notification(device=device, notification=notification)
        }[device.provider]()

    # Send to all Push devices
    push_devices = recipient.push_devices
    for device in push_devices:
        webpush.send_notification(
            notification,
            endpoint=device.endpoint,
            client_encoded_public_key=device.client_pub,
            auth=urlsafe_b64decode(device.auth)
        )