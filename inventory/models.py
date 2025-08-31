from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator

class InventoryItem(models.Model):
    name = models.CharField(max_length=200, blank=False)
    description = models.TextField(blank=True, null=True)
    quantity = models.PositiveIntegerField(validators=[MinValueValidator(0)])
    price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    category = models.CharField(max_length=100, blank=True, null=True)
    date_added = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='inventory_items')

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['-date_added']  # Newest first
        verbose_name = "Inventory Item"
        verbose_name_plural = "Inventory Items"

class InventoryChange(models.Model):
    CHANGE_TYPES = [
        ('added', 'Item Added'),
        ('updated', 'Quantity Updated'),
        ('restocked', 'Restocked'),
        ('sold', 'Item Sold'),
    ]

    item = models.ForeignKey(InventoryItem, on_delete=models.CASCADE, related_name='changes')
    change_type = models.CharField(max_length=20, choices=CHANGE_TYPES)
    old_quantity = models.PositiveIntegerField()
    new_quantity = models.PositiveIntegerField()
    change_reason = models.CharField(max_length=100, blank=True, null=True)
    changed_by = models.ForeignKey(User, on_delete=models.CASCADE)
    changed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.get_change_type_display()} - {self.item.name} ({self.old_quantity} → {self.new_quantity})"

    class Meta:
        ordering = ['-changed_at']
        verbose_name = "Inventory Change"
        verbose_name_plural = "Inventory Changes"