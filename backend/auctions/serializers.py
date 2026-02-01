from rest_framework import serializers
from .models import AuctionItem, Bid, AuctionImage


class AuctionImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuctionImage
        fields = ["id", "image"]


class AuctionItemSerializer(serializers.ModelSerializer):
    seller = serializers.StringRelatedField()
    current_price = serializers.SerializerMethodField()
    is_owner = serializers.SerializerMethodField()

    images = AuctionImageSerializer(many=True, read_only=True)

    uploaded_images = serializers.ListField(
        child=serializers.ImageField(
            max_length=1000000, allow_empty_file=False, use_url=False
        ),
        write_only=True,
        required=False,
    )

    class Meta:
        model = AuctionItem
        fields = [
            "id",
            "title",
            "description",
            "base_price",
            "current_price",
            "image",
            "category",
            "seller",
            "condition",
            "is_active",
            "created_at",
            "end_date",
            "is_owner",
            "images",
            "uploaded_images",
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

    def create(self, validated_data):
        uploaded_images = validated_data.pop("uploaded_images", [])
        auction = AuctionItem.objects.create(**validated_data)

        for index, img in enumerate(uploaded_images):
            AuctionImage.objects.create(auction=auction, image=img)
            if index == 0:
                auction.image = img
                auction.save()

        return auction


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
