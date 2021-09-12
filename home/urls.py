from django.urls import path
from . import views

app_name = 'home'

urlpatterns = [
    path('',views.Home.as_view(),name='home'),
    path('upload',views.upload.as_view(),name='upload'),
    path('upload/<int:pk>',views.uploadTags.as_view(),name='upload_tags'),
    path('search/<str:tg>/<int:count>',views.search.as_view(),name='search'),
    path('view/<int:pk>',views.view.as_view(),name='view'),
]
