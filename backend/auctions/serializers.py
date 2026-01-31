from rest_framework import serializers
from .models import AuctionItem


class AuctionItemSerializer(serializers.ModelSerializer):
    seller = serializers.StringRelatedField()

    class Meta:
        model = AuctionItem
        fields = [
            "id",
            "title",
            "description",
            "base_price",
            "condition",
            "image",
            "is_active",
            "created_at",
            "seller",
        ]
