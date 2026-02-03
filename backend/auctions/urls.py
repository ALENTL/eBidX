from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token
from .views import AuctionList, AuctionDetail, PlaceBid, UserDashboard, RegisterUserView

urlpatterns = [
    path("auctions/", AuctionList.as_view(), name="auction-list"),
    path("auctions/<int:pk>/", AuctionDetail.as_view(), name="auction-detail"),
    path("auctions/<int:pk>/bid/", PlaceBid.as_view(), name="place-bid"),
    path("dashboard/", UserDashboard.as_view(), name="user-dashboard"),
    path("login/", obtain_auth_token, name="login"),
    path("register/", RegisterUserView.as_view(), name="register"),
]
