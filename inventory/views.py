from django.shortcuts import render, redirect

# For user authentication forms
from django.contrib.auth.forms import UserCreationForm

# For protecting views (only logged-in users can access)
from django.contrib.auth.decorators import login_required


# For API functionality
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response

# Our models and serializers
from .models import InventoryItem
from .serializers import InventoryItemSerializer

# HTML VIEWS (For Browser Pages)

def signup(request):
    # If the user is submitting the form (POST request)
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        # Is the data valid? (e.g. password strong enough, username not taken)
        if form.is_valid():
            form.save()  # Save the new user to the database
            return redirect('login')  # Go to login page after signup
    else:
        # If just visiting (GET request), show empty form
        form = UserCreationForm()

    # Render the signup page with the form
    return render(request, 'registration/signup.html', {'form': form})


@login_required
def dashboard(request):
    """
    Show the main dashboard page.
    Only accessible if logged in (thanks to @login_required).
    """
    return render(request, "dashboard.html")


# API VIEWS (For JSON Data)

class IsOwner(permissions.BasePermission):
   def has_object_permission(self, request, view, obj):
        # obj = the inventory item being accessed
        # request.user = the currently logged-in user
        return obj.user == request.user


class InventoryViewSet(viewsets.ModelViewSet):
    
    serializer_class = InventoryItemSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        
        return InventoryItem.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def low_stock(self, request):
        
        low_stock = self.get_queryset().filter(quantity__lt=5)
        page = self.paginate_queryset(low_stock)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(low_stock, many=True)
        return Response(serializer.data)