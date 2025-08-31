from rest_framework import serializers
from .models import InventoryItem

class InventoryItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryItem
        fields = [
            'id',
            'name',
            'description',
            'quantity',
            'price',
            'category',
            'date_added',
            'last_updated',
            'user'
        ]
        read_only_fields = ['user', 'date_added', 'last_updated']