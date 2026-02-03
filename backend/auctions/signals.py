from django.db.models.signals import post_save
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .models import Bid


@receiver(post_save, sender=Bid)
def bid_notification(sender, instance, created, **kwargs):
    if created:
        channel_layer = get_channel_layer()
        group_name = f"auction_{instance.auction.id}"
        async_to_sync(channel_layer.group_send)(
            group_name,
            {
                "type": "auction_update",
                "message": {
                    "current_price": float(instance.amount),
                    "bidder": instance.bidder.username,
                },
            },
        )
