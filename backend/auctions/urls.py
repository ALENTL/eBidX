from django.urls import path
from .views import (
    AuctionList,
    AuctionDetail,
    PlaceBid,
    UserDashboard,
    RegisterUserView,
    CustomLoginView,
)

urlpatterns = [
    path("auctions/", AuctionList.as_view(), name="auction-list"),
    path("auctions/<int:pk>/", AuctionDetail.as_view(), name="auction-detail"),
    path("auctions/<int:pk>/bid/", PlaceBid.as_view(), name="place-bid"),
    path("dashboard/", UserDashboard.as_view(), name="user-dashboard"),
    path("login/", CustomLoginView.as_view(), name="login"),
    path("register/", RegisterUserView.as_view(), name="register"),
]
