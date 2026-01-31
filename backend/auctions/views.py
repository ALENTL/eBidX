from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import AuctionItem, Bid
from .serializers import AuctionItemSerializer, BidSerializer


class AuctionList(generics.ListCreateAPIView):
    queryset = AuctionItem.objects.all()
    serializer_class = AuctionItemSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class AuctionDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = AuctionItem.objects.all()
    serializer_class = AuctionItemSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class PlaceBid(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            auction = AuctionItem.objects.get(pk=pk)
        except AuctionItem.DoesNotExist:
            return Response(
                {"error": "Auction not found"}, status=status.HTTP_404_NOT_FOUND
            )

        amount = request.data.get("amount")
        if not amount:
            return Response(
                {"error": "Amount is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        amount = float(amount)

        highest_bid = auction.bids.order_by("-amount").first()
        current_price = highest_bid.amount if highest_bid else auction.base_price

        if amount <= current_price:
            return Response(
                {
                    "error": f"Bid must be higher than the current price (₹{current_price})"
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        bid = Bid.objects.create(auction=auction, bidder=request.user, amount=amount)

        return Response(BidSerializer(bid).data, status=status.HTTP_201_CREATED)
