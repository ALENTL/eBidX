from rest_framework import serializers
from .models import AuctionItem, Bid


class AuctionItemSerializer(serializers.ModelSerializer):
    seller = serializers.StringRelatedField()
    current_price = serializers.SerializerMethodField()

    class Meta:
        model = AuctionItem
        fields = [
            "id",
            "title",
            "description",
            "base_price",
            "current_price",
            "image",
            "seller",
            "condition",
            "is_active",
            "created_at",
            "end_date",
        ]

    def get_current_price(self, obj):
        highest_bid = obj.bids.order_by("-amount").first()
        if highest_bid:
            return highest_bid.amount
        return obj.base_price


class BidSerializer(serializers.ModelSerializer):
    bidder = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Bid
        fields = ["id", "bidder", "amount", "created_at"]
