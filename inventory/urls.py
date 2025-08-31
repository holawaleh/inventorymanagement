from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'items', views.InventoryViewSet, basename='inventory')

# Extra URLs can go here
urlpatterns = [
    path('', include(router.urls)),
]