from django.contrib import admin
from .models import AuctionItem


@admin.register(AuctionItem)
class AuctionItemAdmin(admin.ModelAdmin):
    list_display = ("title", "base_price", "condition", "seller", "is_active")
