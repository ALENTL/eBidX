from django.db import models
from django.contrib.auth.models import User


class AuctionItem(models.Model):
    CATEGORY_CHOICES = [
        ("electronics", "Electronics"),
        ("fashion", "Fashion"),
        ("home", "Home & Garden"),
        ("vehicles", "Vehicles"),
        ("toys", "Toys & Collectibles"),
        ("other", "Other"),
    ]

    CONDITION_CHOICES = [
        ("new", "New"),
        ("used", "Used"),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    base_price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to="auction_images/", blank=True, null=True)

    category = models.CharField(
        max_length=20, choices=CATEGORY_CHOICES, default="other"
    )

    condition = models.CharField(
        max_length=10, choices=CONDITION_CHOICES, default="used"
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    end_date = models.DateTimeField()
    seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name="items")

    def __str__(self):
        return self.title


class Bid(models.Model):
    auction = models.ForeignKey(
        AuctionItem, related_name="bids", on_delete=models.CASCADE
    )
    bidder = models.ForeignKey(User, related_name="bids", on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.bidder.username} - {self.amount}"


class AuctionImage(models.Model):
    auction = models.ForeignKey(
        AuctionItem, related_name="images", on_delete=models.CASCADE
    )
    image = models.ImageField(upload_to="auction_images/")

    def __str__(self):
        return f"Image for {self.auction.title}"
