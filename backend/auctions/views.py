from rest_framework import generics
from .models import AuctionItem
from .serializers import AuctionItemSerializer


class AuctionList(generics.ListCreateAPIView):
    queryset = AuctionItem.objects.all()
    serializer_class = AuctionItemSerializer
