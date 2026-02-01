from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import AuctionItem, Bid
from .serializers import AuctionItemSerializer, BidSerializer, BidWithItemSerializer


class AuctionList(generics.ListCreateAPIView):
    queryset = AuctionItem.objects.all()
    serializer_class = AuctionItemSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(seller=self.request.user)


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

        if auction.seller == request.user:
            return Response(
                {"error": "You cannot bid on your own auction."},
                status=status.HTTP_400_BAD_REQUEST,
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


class UserDashboard(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        my_bids = Bid.objects.filter(bidder=request.user).order_by("-created_at")

        my_listings = AuctionItem.objects.filter(seller=request.user).order_by(
            "-created_at"
        )

        return Response(
            {
                "bids": BidWithItemSerializer(my_bids, many=True).data,
                "listings": AuctionItemSerializer(my_listings, many=True).data,
            }
        )
