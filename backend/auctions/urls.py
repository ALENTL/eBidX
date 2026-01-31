from django.urls import path
from .views import AuctionList

urlpatterns = [path("auctions/", AuctionList.as_view(), name="auction-list")]
