from django.urls import path
from .views import AuctionList, AuctionDetail, PlaceBid

urlpatterns = [
    path("auctions/", AuctionList.as_view(), name="auction-list"),
    path("auctions/<int:pk>/", AuctionDetail.as_view(), name="auction-detail"),
    path("auctions/<int:pk>/bid/", PlaceBid.as_view(), name="place-bid"),
]
