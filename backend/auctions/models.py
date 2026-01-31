from django.db import models
from django.contrib.auth.models import User


class AuctionItem(models.Model):
    CONDITION_CHOICES = [
        ("new", "New"),
        ("used", "Used"),
    ]
    title = models.CharField(max_length=200)
    description = models.TextField()
    base_price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to="auction_images/", blank=True, null=True)
    condition = models.CharField(
        max_length=10, choices=CONDITION_CHOICES, default="used"
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name="items")

    def __str__(self):
        return self.title
