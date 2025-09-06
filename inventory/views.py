from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.decorators import login_required

from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from .models import InventoryItem
from .serializers import InventoryItemSerializer
from .forms import InventoryItemForm
from django.shortcuts import get_object_or_404

from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from .models import InventoryItem

@login_required
def dashboard(request):
    items = InventoryItem.objects.filter(user=request.user)
    return render(request, "dashboard.html", {"items": items})


# Custom permission: only the owner can edit/delete their own items
class IsOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user


# API ViewSet
class InventoryViewSet(viewsets.ModelViewSet):
    serializer_class = InventoryItemSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    # Filtering, search, ordering
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'quantity', 'price']
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'quantity', 'price', 'date_added']
    ordering = ['-date_added']

    def get_queryset(self):
        # Only show items owned by the logged-in user
        return InventoryItem.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Assign the logged-in user as owner
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def low_stock(self, request):
        # Dynamic threshold from query params, default < 5
        threshold = request.query_params.get('threshold', 5)
        try:
            threshold = int(threshold)
        except ValueError:
            threshold = 5

        low_stock = self.get_queryset().filter(quantity__lt=threshold)
        page = self.paginate_queryset(low_stock)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(low_stock, many=True)
        return Response(serializer.data)


# HTML views
def signup(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('login')
    else:
        form = UserCreationForm()
    return render(request, 'registration/signup.html', {'form': form})


@login_required
def item_list(request):
    items = InventoryItem.objects.filter(user=request.user)
    return render(request, "items/item_list.html", {"items": items})

@login_required
def item_create(request):
    if request.method == "POST":
        form = InventoryItemForm(request.POST)
        if form.is_valid():
            item = form.save(commit=False)
            item.user = request.user
            item.save()
            return redirect("item_list")
    else:
        form = InventoryItemForm()
    return render(request, "items/item_form.html", {"form": form})

@login_required
def item_update(request, pk):
    item = get_object_or_404(InventoryItem, pk=pk, user=request.user)
    if request.method == "POST":
        form = InventoryItemForm(request.POST, instance=item)
        if form.is_valid():
            form.save()
            return redirect("item_list")
    else:
        form = InventoryItemForm(instance=item)
    return render(request, "items/item_form.html", {"form": form})

@login_required
def item_delete(request, pk):
    item = get_object_or_404(InventoryItem, pk=pk, user=request.user)
    if request.method == "POST":
        item.delete()
        return redirect("item_list")
    return render(request, "items/item_confirm_delete.html", {"item": item})

