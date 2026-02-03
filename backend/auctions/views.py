from django.template import context
from rest_framework import generics, permissions, status, filters
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from .models import AuctionItem, Bid
from .serializers import (
    AuctionItemSerializer,
    BidSerializer,
    BidWithItemSerializer,
    RegisterUserSerializer,
)
from django.contrib.auth.models import User


class AuctionList(generics.ListCreateAPIView):
    queryset = AuctionItem.objects.all()
    serializer_class = AuctionItemSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    filter_backends = [filters.SearchFilter]
    search_fields = ["title", "description"]

    def get_queryset(self):
        queryset = AuctionItem.objects.all()
        category = self.request.query_params.get("category")
        if category and category != "all":
            queryset = queryset.filter(category=category)
        return queryset

    def perform_create(self, serializer):
        serializer.save(seller=self.request.user)


class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        return obj.seller == request.user


class AuctionDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = AuctionItem.objects.all()
    serializer_class = AuctionItemSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]


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

        highest_bid = auction.bids.order_by("-amount").first()

        if highest_bid and highest_bid.bidder == request.user:
            return Response(
                {"error": "You are already the highest bidder"},
                status=status.HTTP_400_BAD_REQUEST,
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
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        all_bids = Bid.objects.filter(bidder=request.user).order_by("-created_at")

        highest_bids = {}
        for bid in all_bids:
            if bid.auction.id not in highest_bids:
                highest_bids[bid.auction.id] = bid

        final_bids = list(highest_bids.values())

        my_listings = AuctionItem.objects.filter(seller=request.user).order_by(
            "-created_at"
        )

        return Response(
            {
                "bids": BidWithItemSerializer(
                    final_bids, many=True, context={"request": request}
                ).data,
                "listings": AuctionItemSerializer(
                    my_listings, many=True, context={"request": request}
                ).data,
            }
        )


class RegisterUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterUserSerializer


class CustomLoginView(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data["user"]
        token, created = Token.objects.get_or_create(user=user)

        return Response(
            {"token": token.key, "user_id": user.pk, "username": user.username}
        )
