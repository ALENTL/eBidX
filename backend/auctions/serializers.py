from rest_framework import serializers
from .models import AuctionItem, Bid


class AuctionItemSerializer(serializers.ModelSerializer):
    seller = serializers.StringRelatedField()
    current_price = serializers.SerializerMethodField()
    is_owner = serializers.SerializerMethodField()

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
            "is_owner",
        ]

    def get_current_price(self, obj):
        highest_bid = obj.bids.order_by("-amount").first()
        if highest_bid:
            return highest_bid.amount
        return obj.base_price

    def get_is_owner(self, obj):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            return obj.seller == request.user
        return False


class BidSerializer(serializers.ModelSerializer):
    bidder = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Bid
        fields = ["id", "bidder", "amount", "created_at"]


class BidWithItemSerializer(serializers.ModelSerializer):
    auction = AuctionItemSerializer(read_only=True)

    class Meta:
        model = Bid
        fields = ["id", "amount", "created_at", "auction"]
